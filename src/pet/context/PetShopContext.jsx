import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  formatarDataHoraAtual,
  formatarHorario,
  formatarPreco,
} from "../utils/formatadores";
import { dadosIniciais } from "../data/dadosIniciais";

const PetShopContext = createContext(null);
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";
const STORAGE_KEY = "petshop-mvp-dados-v2";

function novoId(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function adicionarDias(dataBR, dias) {
  const [dia, mes, ano] = String(dataBR).split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString("pt-BR");
}

async function carregarDadosLocais() {
  try {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : dadosIniciais;
    }

    const salvo = await AsyncStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : dadosIniciais;
  } catch {
    return dadosIniciais;
  }
}

async function salvarDadosLocais(dados) {
  try {
    const serializado = JSON.stringify(dados);

    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, serializado);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEY, serializado);
  } catch {
    // Persistência local é fallback; falhas não devem bloquear o uso.
  }
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
  const resposta = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!resposta.ok) {
    throw new Error("API indisponível");
  }

  return resposta.json();
}

export function PetShopProvider({ children }) {
  const [dadosSalvos] = useState(dadosPadrao);
  const [donos, setDonos] = useState(dadosSalvos.donos ?? []);
  const [pets, setPets] = useState(dadosSalvos.pets ?? []);
  const [agendamentos, setAgendamentos] = useState(dadosSalvos.agendamentos ?? []);
  const [historico, setHistorico] = useState(dadosSalvos.historico ?? []);
  const [pacotes, setPacotes] = useState(dadosSalvos.pacotes ?? []);
  const [backendOnline, setBackendOnline] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [ultimoErroSync, setUltimoErroSync] = useState("");

  function aplicarDados(dados) {
    setDonos(dados.donos ?? []);
    setPets(dados.pets ?? []);
    setAgendamentos(dados.agendamentos ?? []);
    setHistorico(dados.historico ?? []);
    setPacotes(dados.pacotes ?? []);
  }

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      const locais = await carregarDadosLocais();

      if (!ativo) {
        return;
      }

      aplicarDados(locais);
      setDadosCarregados(true);

      try {
        const dados = await chamarApi("/dados");

        if (!ativo) {
          return;
        }

        aplicarDados(dados);
        setBackendOnline(true);
        setUltimoErroSync("");
      } catch (error) {
        if (!ativo) {
          return;
        }

        setBackendOnline(false);
        setUltimoErroSync(mensagemErroApi(error));
      } finally {
        if (ativo) {
          setCarregandoDados(false);
        }
      }
    }

    inicializar();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!dadosCarregados) {
      return;
    }

    salvarDadosLocais({ donos, pets, agendamentos, historico, pacotes });
  }, [dadosCarregados, donos, pets, agendamentos, historico, pacotes]);

  async function sincronizar(path, options, fallback) {
    setSincronizando(true);

    try {
      const resultado = await chamarApi(path, options);
      if (resultado.dados) {
        aplicarDados(resultado.dados);
      }
      setBackendOnline(true);
      setUltimoErroSync("");
      return { ...resultado, offline: false };
    } catch (error) {
      setBackendOnline(false);
      setUltimoErroSync(mensagemErroApi(error));
      return normalizarRespostaLocal(fallback?.(), error);
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
    return sincronizar(
      "/pets",
      {
        method: "POST",
        body: JSON.stringify({ nome, raca, porte, dono, telefone, foto, donoId }),
      },
      () => {
        const donoExistente = donoId
          ? donos.find((item) => item.id === donoId)
          : buscarDonoPorTelefone(telefone);
        const novoDonoId = donoExistente?.id ?? novoId("dono");

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
          id: novoId("pet"),
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
    return sincronizar(
      "/agendamentos",
      { method: "POST", body: JSON.stringify(dados) },
      () => {
        const agendamento = {
          id: novoId("ag"),
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
    return sincronizar(
      "/pacotes",
      { method: "POST", body: JSON.stringify(dados) },
      () => {
        const quantidade = Math.min(Math.max(Number(dados.quantidadeBanhos), 1), 4);
        const pacoteId = novoId("pacote");
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
          criadoEm: new Date().toISOString(),
        };
        const novosAgendamentos = Array.from({ length: quantidade }, (_, index) => ({
          id: novoId("ag"),
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
