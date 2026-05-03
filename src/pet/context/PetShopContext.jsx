import { createContext, useContext, useEffect, useState } from "react";
import {
  formatarDataHoraAtual,
  formatarHorario,
  formatarPreco,
} from "../utils/formatadores";

const PetShopContext = createContext(null);
const API_URL = "http://localhost:3333";
const STORAGE_KEY = "petshop-mvp-dados";

const dadosIniciais = {
  donos: [
    {
      id: "dono-1",
      nome: "Joao Silva",
      telefone: "(11) 99999-9999",
      busca: true,
    },
    {
      id: "dono-2",
      nome: "Ana Souza",
      telefone: "(11) 98888-8888",
      busca: false,
    },
  ],
  pets: [
    {
      id: "pet-1",
      nome: "Rex",
      raca: "Golden Retriever",
      porte: "Grande",
      donoId: "dono-1",
      foto: "https://placedog.net/200/200?id=1",
    },
    {
      id: "pet-2",
      nome: "Mia",
      raca: "Persa",
      porte: "Pequeno",
      donoId: "dono-2",
      foto: "",
    },
  ],
  agendamentos: [
    {
      id: "ag-1",
      petId: "pet-1",
      servico: "Banho e Tosa",
      data: "02/05/2026",
      horario: "10:00",
      pago: true,
      pagoEm: "02/05/2026 10:00",
      preco: "80,00",
      lamina: "3",
      observacoes: "Atendimento marcado.",
      imagemUri: "",
      pacoteId: null,
      numeroBanho: null,
    },
    {
      id: "ag-2",
      petId: "pet-2",
      servico: "Banho",
      data: "02/05/2026",
      horario: "14:30",
      pago: false,
      pagoEm: "",
      preco: "50,00",
      lamina: "-",
      observacoes: "Cliente prefere retirada no fim da tarde.",
      imagemUri: "",
      pacoteId: null,
      numeroBanho: null,
    },
  ],
  historico: [],
  pacotes: [],
};

function novoId(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function adicionarDias(dataBR, dias) {
  const [dia, mes, ano] = String(dataBR).split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString("pt-BR");
}

function carregarDados() {
  try {
    if (typeof localStorage === "undefined") {
      return dadosIniciais;
    }

    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : dadosIniciais;
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
    throw new Error("API indisponivel");
  }

  return resposta.json();
}

export function PetShopProvider({ children }) {
  const [dadosSalvos] = useState(carregarDados);
  const [donos, setDonos] = useState(dadosSalvos.donos ?? []);
  const [pets, setPets] = useState(dadosSalvos.pets ?? []);
  const [agendamentos, setAgendamentos] = useState(dadosSalvos.agendamentos ?? []);
  const [historico, setHistorico] = useState(dadosSalvos.historico ?? []);
  const [pacotes, setPacotes] = useState(dadosSalvos.pacotes ?? []);
  const [backendOnline, setBackendOnline] = useState(false);

  function aplicarDados(dados) {
    setDonos(dados.donos ?? []);
    setPets(dados.pets ?? []);
    setAgendamentos(dados.agendamentos ?? []);
    setHistorico(dados.historico ?? []);
    setPacotes(dados.pacotes ?? []);
  }

  useEffect(() => {
    chamarApi("/dados")
      .then((dados) => {
        aplicarDados(dados);
        setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ donos, pets, agendamentos, historico, pacotes })
        );
      }
    } catch {
      // Persistencia local opcional no web.
    }
  }, [donos, pets, agendamentos, historico, pacotes]);

  async function sincronizar(path, options, fallback) {
    try {
      const resultado = await chamarApi(path, options);
      if (resultado.dados) {
        aplicarDados(resultado.dados);
      }
      setBackendOnline(true);
      return resultado;
    } catch {
      setBackendOnline(false);
      return fallback?.();
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

      return sincronizar("/agendamentos/" + id, {
        method: "PATCH",
        body: JSON.stringify(dadosPagamento),
      });
    }

    return atualizarAgendamento(id, dadosPagamento);
  }

  function atualizarPet(id, dados) {
    setPets((atuais) =>
      atuais.map((pet) => (pet.id === id ? { ...pet, ...dados } : pet))
    );
    return sincronizar("/pets/" + id, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  }

  function atualizarDono(id, dados) {
    setDonos((atuais) =>
      atuais.map((dono) => (dono.id === id ? { ...dono, ...dados } : dono))
    );
    return sincronizar("/donos/" + id, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  }

  function atualizarAgendamento(id, dados) {
    setAgendamentos((atuais) =>
      atuais.map((agendamento) =>
        agendamento.id === id ? { ...agendamento, ...dados } : agendamento
      )
    );
    return sincronizar("/agendamentos/" + id, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  }

  function atualizarPacote(id, dados) {
    setPacotes((atuais) =>
      atuais.map((pacote) => (pacote.id === id ? { ...pacote, ...dados } : pacote))
    );
    return sincronizar("/pacotes/" + id, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  }

  function atualizarHistorico(id, dados) {
    setHistorico((atuais) =>
      atuais.map((registro) =>
        registro.id === id ? { ...registro, ...dados } : registro
      )
    );
    return sincronizar("/historico/" + id, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  }

  function cancelarAgendamento(id) {
    setAgendamentos((atuais) =>
      atuais.filter((agendamento) => agendamento.id !== id)
    );
    return sincronizar("/agendamentos/" + id, { method: "DELETE" });
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

    return sincronizar(`/agendamentos/${id}/concluir`, { method: "POST" });
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
