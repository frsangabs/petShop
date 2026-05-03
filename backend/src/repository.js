import { PrismaClient } from "@prisma/client";
import { carregarDb, salvarDb } from "./db.js";

const usarPrisma = Boolean(process.env.DATABASE_URL);
const prisma = usarPrisma ? new PrismaClient() : null;

function ordenarPorCriacaoDesc(a, b) {
  return String(b.criadoEm ?? "").localeCompare(String(a.criadoEm ?? ""));
}

export function usandoPostgres() {
  return usarPrisma;
}

export async function carregarDados() {
  if (!usarPrisma) {
    return carregarDb();
  }

  const [donos, pets, agendamentos, historico, pacotes] = await Promise.all([
    prisma.dono.findMany(),
    prisma.pet.findMany(),
    prisma.agendamento.findMany(),
    prisma.historico.findMany(),
    prisma.pacoteBanhos.findMany()
  ]);

  return {
    donos,
    pets,
    agendamentos,
    historico,
    pacotes: pacotes.sort(ordenarPorCriacaoDesc)
  };
}

export async function salvarPetComDono(pet, dono) {
  if (!usarPrisma) {
    const db = await carregarDb();

    if (dono && !db.donos.some((item) => item.id === dono.id)) {
      db.donos.push(dono);
    }

    db.pets.push(pet);
    await salvarDb(db);
    return carregarDados();
  }

  if (dono) {
    await prisma.dono.create({ data: dono });
  }

  await prisma.pet.create({ data: pet });
  return carregarDados();
}

export async function atualizarPet(id, dados) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.pets = db.pets.map((pet) => (pet.id === id ? { ...pet, ...dados } : pet));
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.pet.update({ where: { id }, data: dados });
  return carregarDados();
}

export async function atualizarDono(id, dados) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.donos = db.donos.map((dono) => (dono.id === id ? { ...dono, ...dados } : dono));
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.dono.update({ where: { id }, data: dados });
  return carregarDados();
}

export async function criarAgendamento(agendamento) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.agendamentos.push(agendamento);
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.agendamento.create({ data: agendamento });
  return carregarDados();
}

export async function criarPacoteComAgendamentos(pacote, agendamentos) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.pacotes.push(pacote);
    db.agendamentos.push(...agendamentos);
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.$transaction([
    prisma.pacoteBanhos.create({ data: pacote }),
    ...agendamentos.map((agendamento) =>
      prisma.agendamento.create({ data: agendamento })
    )
  ]);
  return carregarDados();
}

export async function atualizarAgendamento(id, dados) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.agendamentos = db.agendamentos.map((agendamento) =>
      agendamento.id === id ? { ...agendamento, ...dados } : agendamento
    );
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.agendamento.update({ where: { id }, data: dados });
  return carregarDados();
}

export async function removerAgendamento(id) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.agendamentos = db.agendamentos.filter((agendamento) => agendamento.id !== id);
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.agendamento.delete({ where: { id } });
  return carregarDados();
}

export async function concluirAgendamento(id, concluidoEm) {
  if (!usarPrisma) {
    const db = await carregarDb();
    const agendamento = db.agendamentos.find((item) => item.id === id);

    if (!agendamento) {
      return null;
    }

    db.historico.unshift({ ...agendamento, concluidoEm });
    db.agendamentos = db.agendamentos.filter((item) => item.id !== id);
    await salvarDb(db);
    return carregarDados();
  }

  const agendamento = await prisma.agendamento.findUnique({ where: { id } });

  if (!agendamento) {
    return null;
  }

  await prisma.$transaction([
    prisma.historico.create({ data: { ...agendamento, concluidoEm } }),
    prisma.agendamento.delete({ where: { id } })
  ]);
  return carregarDados();
}

export async function atualizarHistorico(id, dados) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.historico = db.historico.map((registro) =>
      registro.id === id ? { ...registro, ...dados } : registro
    );
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.historico.update({ where: { id }, data: dados });
  return carregarDados();
}
