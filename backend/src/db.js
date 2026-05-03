import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../data/db.json");

export const dadosIniciais = {
  donos: [
    {
      id: "dono-1",
      nome: "Joao Silva",
      telefone: "(11) 99999-9999",
      busca: true
    },
    {
      id: "dono-2",
      nome: "Ana Souza",
      telefone: "(11) 98888-8888",
      busca: false
    }
  ],
  pets: [
    {
      id: "pet-1",
      nome: "Rex",
      raca: "Golden Retriever",
      porte: "Grande",
      donoId: "dono-1",
      foto: "https://placedog.net/200/200?id=1"
    },
    {
      id: "pet-2",
      nome: "Mia",
      raca: "Persa",
      porte: "Pequeno",
      donoId: "dono-2",
      foto: ""
    }
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
      numeroBanho: null
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
      numeroBanho: null
    }
  ],
  historico: [],
  pacotes: []
};

export function novoId(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function carregarDb() {
  try {
    const conteudo = await readFile(dbPath, "utf8");
    return JSON.parse(conteudo);
  } catch {
    await salvarDb(dadosIniciais);
    return structuredClone(dadosIniciais);
  }
}

export async function salvarDb(dados) {
  await mkdir(path.dirname(dbPath), { recursive: true });
  await writeFile(dbPath, JSON.stringify(dados, null, 2));
}
