import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import {
  formatarDataHoraAtual,
  formatarHorario,
  formatarPreco,
} from "../utils/formatadores";
import { dadosIniciais } from "../data/dadosIniciais";
import {
  carregarDadosLocais,
  carregarPendenciasLocais,
  montarSnapshot,
  salvarDadosLocais,
  salvarPendenciasLocais,
} from "../storage/persistenciaLocal";

const PetShopContext = createContext(null);
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";
const API_TIMEOUT_MS = 8000;

function novoId(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function adicionarDias(dataBR, dias) {
  const [dia, mes, ano] = String(dataBR).split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString("pt-BR");
}

function normalizarDadosResposta(resposta) {
  if (!resposta || typeof resposta !== "object") {
    return null;
  }

  if (resposta.dados && typeof resposta.dados === "object") {
    return montarSnapshot(resposta.dados);
  }

  if (
    Array.isArray(resposta.donos) ||
    Array.isArray(resposta.pets) ||
    Array.isArray(resposta.agendamentos)
  ) {
    return montarSnapshot(resposta);
  }

  return null;
}

function mensagemErroApi(error) {
  if (error?.message) {
    return error.message;
  }

  return "Não foi possível sincronizar com o servidor.";
}

function normalizarRespostaLocal(resultado, erro) {
  return {
    ...(resultado ?? {}),
    offline: true,
    erroSync: mensagemErroApi(erro),
  };
}

function dadosPadrao() {
  try {
    if (typeof structuredClone === "function") {
      return structuredClone(dadosIniciais);
    }

    return JSON.parse(JSON.stringify(dadosIniciais));
  } catch {
    return dadosIniciais;
  }
}

async function chamarApi(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const resposta = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
      signal: controller.signal,
    });

    if (!resposta.ok) {
      throw new Error("API indisponível");
    }

    return resposta.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function enviarPendencias(pendencias) {
  let dadosAtualizados = null;

  for (const pendencia of pendencias) {
    const resultado = await chamarApi(pendencia.path, pendencia.options);
    const normalizado = normalizarDadosResposta(resultado);

    if (normalizado) {
      dadosAtualizados = normalizado;
    }
  }

  if (dadosAtualizados) {
    return dadosAtualizados;
  }

  return normalizarDadosResposta(await chamarApi("/dados"));
}

export function PetShopProvider({ children }) {
  const [donos, setDonos] = useState([]);
  const [pets, setPets] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [ultimoErroSync, setUltimoErroSync] = useState("");
  const [pendenciasSync, setPendenciasSync] = useState([]);
  const estadoRef = useRef({ donos: [], pets: [], agendamentos: [], historico: [], pacotes: [] });

  function aplicarDados(dados) {
    const snapshot = montarSnapshot(dados);
    estadoRef.current = snapshot;
    setDonos(snapshot.donos);
    setPets(snapshot.pets);
    setAgendamentos(snapshot.agendamentos);
    setHistorico(snapshot.historico);
    setPacotes(snapshot.pacotes);
  }

  const persistirEstadoAtual = useCallback(async (snapshot) => {
    const dados = snapshot ?? estadoRef.current;
    await salvarDadosLocais(dados);
  }, []);

  useEffect(() => {
    estadoRef.current = { donos, pets, agendamentos, historico, pacotes };
  }, [donos, pets, agendamentos, historico, pacotes]);

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      const [locais, pendentes] = await Promise.all([
        carregarDadosLocais(),
        carregarPendenciasLocais(),
      ]);

      if (!ativo) {
        return;
      }

      const primeiroUso = locais === null;
      const dadosInicio = locais ?? dadosPadrao();
      aplicarDados(dadosInicio);
      setPendenciasSync(pendentes);
      setDadosCarregados(true);
      setCarregandoDados(false);

      if (primeiroUso) {
        await salvarDadosLocais(dadosInicio);
      }

      try {
        if (pendentes.length > 0) {
          const dadosServidor = await enviarPendencias(pendentes);

          if (!ativo) {
            return;
          }

          if (dadosServidor) {
            aplicarDados(dadosServidor);
            await salvarDadosLocais(dadosServidor);
          }

          setPendenciasSync([]);
          await salvarPendenciasLocais([]);
        } else if (primeiroUso) {
          const resposta = await chamarApi("/dados");
          const dadosServidor = normalizarDadosResposta(resposta);

          if (!ativo) {
            return;
          }

          if (dadosServidor) {
            aplicarDados(dadosServidor);
            await salvarDadosLocais(dadosServidor);
          }
        } else {
          await chamarApi("/health");
        }

        if (!ativo) {
          return;
        }

        setBackendOnline(true);
        setUltimoErroSync("");
      } catch (error) {
        if (!ativo) {
          return;
        }

        setBackendOnline(false);
        setUltimoErroSync(mensagemErroApi(error));
      }
    }

    inicializar();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!dadosCarregados) {
      return undefined;
    }

    const timer = setTimeout(() => {
      persistirEstadoAtual({
        donos,
        pets,
        agendamentos,
        historico,
        pacotes,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [dadosCarregados, donos, pets, agendamentos, historico, pacotes, persistirEstadoAtual]);

  useEffect(() => {
    if (!dadosCarregados) {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (estadoApp) => {
      if (estadoApp === "background" || estadoApp === "inactive") {
        persistirEstadoAtual(estadoRef.current);
        salvarPendenciasLocais(pendenciasSync);
      }
    });

    return () => subscription.remove();
  }, [dadosCarregados, pendenciasSync, persistirEstadoAtual]);

  useEffect(() => {
    if (!dadosCarregados) {
      return;
    }

    salvarPendenciasLocais(pendenciasSync);
  }, [dadosCarregados, pendenciasSync]);

  useEffect(() => {
    if (!dadosCarregados || carregandoDados || !pendenciasSync.length) {
      return undefined;
    }

    let ativo = true;
    let enviando = false;

    async function tentarEnviar() {
      if (enviando) {
        return;
      }

      enviando = true;
      setSincronizando(true);

      try {
        const dados = await enviarPendencias(pendenciasSync);

        if (!ativo) {
          return;
        }

        if (dados) {
          aplicarDados(dados);
          await salvarDadosLocais(dados);
        }

        setPendenciasSync([]);
        await salvarPendenciasLocais([]);
        setBackendOnline(true);
        setUltimoErroSync("");
      } catch (error) {
        if (!ativo) {
          return;
        }

        setBackendOnline(false);
        setUltimoErroSync(mensagemErroApi(error));
      } finally {
        enviando = false;

        if (ativo) {
          setSincronizando(false);
        }
      }
    }

    const timer = setInterval(tentarEnviar, 8000);

    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, [carregandoDados, dadosCarregados, pendenciasSync]);

  async function sincronizar(path, options, fallback) {
    setSincronizando(true);

    try {
      if (pendenciasSync.length) {
        const dadosPendentes = await enviarPendencias(pendenciasSync);

        if (dadosPendentes) {
          aplicarDados(dadosPendentes);
          await salvarDadosLocais(dadosPendentes);
        }

        setPendenciasSync([]);
        await salvarPendenciasLocais([]);
      }

      const resultado = await chamarApi(path, options);
      const dadosServidor = normalizarDadosResposta(resultado);

      if (dadosServidor) {
        aplicarDados(dadosServidor);
        await salvarDadosLocais(dadosServidor);
      }

      setBackendOnline(true);
      setUltimoErroSync("");
      return { ...resultado, offline: false };
    } catch (error) {
      const resultadoLocal = fallback?.();
      const pendencia = {
        id: novoId("sync"),
        path,
        options,
        criadoEm: new Date().toISOString(),
      };

      setPendenciasSync((atuais) => {
        const proximas = [...atuais, pendencia];
        void salvarPendenciasLocais(proximas);
        return proximas;
      });
      setBackendOnline(false);
      setUltimoErroSync(mensagemErroApi(error));
      setTimeout(() => {
        persistirEstadoAtual(estadoRef.current);
      }, 100);
      return normalizarRespostaLocal(resultadoLocal, error);
    } finally {
      setSincronizando(false);
    }
  }

  function buscarDonoPorTelefone(telefone) {
    return donos.find(
      (dono) => dono.telefone.trim() === String(telefone).trim()
    );
  }

  function criarPet({ nome, raca, porte, dono, telefone, foto, donoId }) {
    const donoExistente = donoId
      ? donos.find((item) => item.id === donoId)
      : buscarDonoPorTelefone(telefone);
    const novoDonoId = donoExistente?.id ?? novoId("dono");
    const petId = novoId("pet");

    return sincronizar(
      "/pets",
      {
        method: "POST",
        body: JSON.stringify({
          id: petId,
          nome,
          raca,
          porte,
          dono,
          telefone,
          foto,
          donoId,
          novoDonoId,
        }),
      },
      () => {
        if (!donoExistente) {
          setDonos((atuais) => [
            ...atuais,
            {
              id: novoDonoId,
              nome: String(dono).trim(),
              telefone: String(telefone).trim(),
              busca: false,
            },
          ]);
        }

        const pet = {
          id: petId,
          nome: nome.trim(),
          raca: raca.trim(),
          porte,
          donoId: novoDonoId,
          foto: foto ?? "",
        };

        setPets((atuais) => [...atuais, pet]);
        return { pet };
      }
    );
  }

  function criarAgendamento(dados) {
    const agendamentoId = novoId("ag");

    return sincronizar(
      "/agendamentos",
      { method: "POST", body: JSON.stringify({ ...dados, id: agendamentoId }) },
      () => {
        const agendamento = {
          id: agendamentoId,
          petId: dados.petId,
          servico: dados.servico.trim(),
          data: dados.data.trim(),
          horario: formatarHorario(dados.horario),
          pago: dados.pago,
          pagoEm: dados.pago ? formatarDataHoraAtual() : "",
          preco: formatarPreco(dados.preco) || "0,00",
          lamina: dados.lamina.trim() || "-",
          observacoes: dados.observacoes.trim() || "Sem observacoes.",
          imagemUri: dados.imagemUri ?? "",
          pacoteId: null,
          numeroBanho: null,
        };

        setAgendamentos((atuais) => [...atuais, agendamento]);
        return { agendamento };
      }
    );
  }

  function criarPacoteBanhos(dados) {
    const quantidade = Math.min(Math.max(Number(dados.quantidadeBanhos), 1), 4);
    const pacoteId = novoId("pacote");
    const agendamentoIds = Array.from({ length: quantidade }, () => novoId("ag"));
    const criadoEm = new Date().toISOString();

    return sincronizar(
      "/pacotes",
      {
        method: "POST",
        body: JSON.stringify({
          ...dados,
          quantidadeBanhos: quantidade,
          id: pacoteId,
          agendamentoIds,
          criadoEm,
        }),
      },
      () => {
        const pacote = {
          id: pacoteId,
          petId: dados.petId,
          quantidadeBanhos: quantidade,
          dataPrimeiroBanho: dados.data,
          horario: dados.horario,
          servico: "Banho",
          bonusServico: dados.bonusServico ?? "Tosa Higiênica",
          bonusConcluido: false,
          bonusConcluidoEm: "",
          criadoEm,
        };
        const novosAgendamentos = Array.from({ length: quantidade }, (_, index) => ({
          id: agendamentoIds[index],
          petId: dados.petId,
          servico: "Banho",
          data: adicionarDias(dados.data, index * 7),
          horario: formatarHorario(dados.horario),
          pago: dados.pago,
          pagoEm: dados.pago ? formatarDataHoraAtual() : "",
          preco: formatarPreco(dados.preco) || "0,00",
          lamina: dados.lamina.trim() || "-",
          observacoes:
            index === 0
              ? dados.observacoes.trim() || "Pacote de banhos."
              : "Banho gerado pelo pacote.",
          imagemUri: index === 0 ? dados.imagemUri ?? "" : "",
          pacoteId,
          numeroBanho: index + 1,
        }));

        setPacotes((atuais) => [...atuais, pacote]);
        setAgendamentos((atuais) => [...atuais, ...novosAgendamentos]);
        return { pacote, agendamentos: novosAgendamentos };
      }
    );
  }

  function alternarPagamento(id) {
    const agendamento = agendamentos.find((item) => item.id === id);
    const pago = !agendamento?.pago;
    const dadosPagamento = {
      pago,
      pagoEm: pago ? formatarDataHoraAtual() : "",
    };

    if (agendamento?.pacoteId) {
      setAgendamentos((atuais) =>
        atuais.map((item) =>
          item.pacoteId === agendamento.pacoteId
            ? { ...item, ...dadosPagamento }
            : item
        )
      );
      setHistorico((atuais) =>
        atuais.map((item) =>
          item.pacoteId === agendamento.pacoteId
            ? { ...item, ...dadosPagamento }
            : item
        )
      );

      return sincronizar(
        "/agendamentos/" + id,
        {
          method: "PATCH",
          body: JSON.stringify(dadosPagamento),
        },
        () => ({ pago })
      );
    }

    return atualizarAgendamento(id, dadosPagamento);
  }

  function atualizarPet(id, dados) {
    setPets((atuais) =>
      atuais.map((pet) => (pet.id === id ? { ...pet, ...dados } : pet))
    );
    return sincronizar(
      "/pets/" + id,
      {
        method: "PATCH",
        body: JSON.stringify(dados),
      },
      () => ({ pet: { id, ...dados } })
    );
  }

  function atualizarDono(id, dados) {
    setDonos((atuais) =>
      atuais.map((dono) => (dono.id === id ? { ...dono, ...dados } : dono))
    );
    return sincronizar(
      "/donos/" + id,
      {
        method: "PATCH",
        body: JSON.stringify(dados),
      },
      () => ({ dono: { id, ...dados } })
    );
  }

  function atualizarAgendamento(id, dados) {
    setAgendamentos((atuais) =>
      atuais.map((agendamento) =>
        agendamento.id === id ? { ...agendamento, ...dados } : agendamento
      )
    );
    return sincronizar(
      "/agendamentos/" + id,
      {
        method: "PATCH",
        body: JSON.stringify(dados),
      },
      () => ({ agendamento: { id, ...dados } })
    );
  }

  function atualizarPacote(id, dados) {
    setPacotes((atuais) =>
      atuais.map((pacote) => (pacote.id === id ? { ...pacote, ...dados } : pacote))
    );
    return sincronizar(
      "/pacotes/" + id,
      {
        method: "PATCH",
        body: JSON.stringify(dados),
      },
      () => ({ pacote: { id, ...dados } })
    );
  }

  function atualizarHistorico(id, dados) {
    setHistorico((atuais) =>
      atuais.map((registro) =>
        registro.id === id ? { ...registro, ...dados } : registro
      )
    );
    return sincronizar(
      "/historico/" + id,
      {
        method: "PATCH",
        body: JSON.stringify(dados),
      },
      () => ({ registro: { id, ...dados } })
    );
  }

  function cancelarAgendamento(id) {
    setAgendamentos((atuais) =>
      atuais.filter((agendamento) => agendamento.id !== id)
    );
    return sincronizar(
      "/agendamentos/" + id,
      { method: "DELETE" },
      () => ({ removido: true })
    );
  }

  function concluirAgendamento(id) {
    const agendamento = agendamentos.find((item) => item.id === id);

    if (agendamento && !agendamento.pago) {
      return { erro: "PAGAMENTO_PENDENTE" };
    }

    if (agendamento) {
      setHistorico((atuais) => [
        { ...agendamento, concluidoEm: new Date().toLocaleDateString("pt-BR") },
        ...atuais,
      ]);
      setAgendamentos((atuais) => atuais.filter((item) => item.id !== id));
    }

    return sincronizar(
      `/agendamentos/${id}/concluir`,
      { method: "POST" },
      () => ({ concluido: true })
    );
  }

  function obterPet(id) {
    return pets.find((pet) => pet.id === id);
  }

  function obterDono(id) {
    return donos.find((dono) => dono.id === id);
  }

  function obterAgendamento(id) {
    return agendamentos.find((agendamento) => agendamento.id === id);
  }

  const valor = {
    donos,
    pets,
    agendamentos,
    historico,
    pacotes,
    backendOnline,
    carregandoDados,
    sincronizando,
    ultimoErroSync,
    alteracoesPendentes: pendenciasSync.length,
    apiUrl: API_URL,
    criarPet,
    criarAgendamento,
    criarPacoteBanhos,
    alternarPagamento,
    cancelarAgendamento,
    concluirAgendamento,
    atualizarPet,
    atualizarDono,
    atualizarAgendamento,
    atualizarHistorico,
    atualizarPacote,
    obterPet,
    obterDono,
    obterAgendamento,
  };

  return (
    <PetShopContext.Provider value={valor}>{children}</PetShopContext.Provider>
  );
}

export function usePetShop() {
  const context = useContext(PetShopContext);

  if (!context) {
    throw new Error("usePetShop deve ser usado dentro de PetShopProvider");
  }

  return context;
}
