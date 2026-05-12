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

    db.pets = db.pets.some((item) => item.id === pet.id)
      ? db.pets.map((item) => (item.id === pet.id ? { ...item, ...pet } : item))
      : [...db.pets, pet];
    await salvarDb(db);
    return carregarDados();
  }

  if (dono) {
    await prisma.dono.upsert({
      where: { id: dono.id },
      update: dono,
      create: dono
    });
  }

  await prisma.pet.upsert({
    where: { id: pet.id },
    update: pet,
    create: pet
  });
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
    db.agendamentos = db.agendamentos.some((item) => item.id === agendamento.id)
      ? db.agendamentos.map((item) =>
          item.id === agendamento.id ? { ...item, ...agendamento } : item
        )
      : [...db.agendamentos, agendamento];
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.agendamento.upsert({
    where: { id: agendamento.id },
    update: agendamento,
    create: agendamento
  });
  return carregarDados();
}

export async function criarPacoteComAgendamentos(pacote, agendamentos) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.pacotes = db.pacotes.some((item) => item.id === pacote.id)
      ? db.pacotes.map((item) => (item.id === pacote.id ? { ...item, ...pacote } : item))
      : [...db.pacotes, pacote];
    for (const agendamento of agendamentos) {
      db.agendamentos = db.agendamentos.some((item) => item.id === agendamento.id)
        ? db.agendamentos.map((item) =>
            item.id === agendamento.id ? { ...item, ...agendamento } : item
          )
        : [...db.agendamentos, agendamento];
    }
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.$transaction([
    prisma.pacoteBanhos.upsert({
      where: { id: pacote.id },
      update: pacote,
      create: pacote
    }),
    ...agendamentos.map((agendamento) =>
      prisma.agendamento.upsert({
        where: { id: agendamento.id },
        update: agendamento,
        create: agendamento
      })
    )
  ]);
  return carregarDados();
}

export async function atualizarAgendamento(id, dados) {
  if (!usarPrisma) {
    const db = await carregarDb();
    const agendamentoAtual = db.agendamentos.find((agendamento) => agendamento.id === id);

    db.agendamentos = db.agendamentos.map((agendamento) =>
      agendamento.id === id ? { ...agendamento, ...dados } : agendamento
    );

    if (agendamentoAtual?.pacoteId && dados.pago !== undefined) {
      const dadosPagamento = { pago: dados.pago, pagoEm: dados.pagoEm ?? "" };

      db.agendamentos = db.agendamentos.map((agendamento) =>
        agendamento.pacoteId === agendamentoAtual.pacoteId
          ? { ...agendamento, ...dadosPagamento }
          : agendamento
      );
      db.historico = db.historico.map((registro) =>
        registro.pacoteId === agendamentoAtual.pacoteId
          ? { ...registro, ...dadosPagamento }
          : registro
      );
    }

    await salvarDb(db);
    return carregarDados();
  }

  const agendamentoAtual = await prisma.agendamento.findUnique({ where: { id } });

  if (!agendamentoAtual) {
    return carregarDados();
  }

  const operacoes = [prisma.agendamento.update({ where: { id }, data: dados })];

  if (agendamentoAtual.pacoteId && dados.pago !== undefined) {
    const dadosPagamento = { pago: dados.pago, pagoEm: dados.pagoEm ?? "" };

    operacoes.push(
      prisma.agendamento.updateMany({
        where: { pacoteId: agendamentoAtual.pacoteId },
        data: dadosPagamento
      }),
      prisma.historico.updateMany({
        where: { pacoteId: agendamentoAtual.pacoteId },
        data: dadosPagamento
      })
    );
  }

  await prisma.$transaction(operacoes);
  return carregarDados();
}

export async function atualizarPacote(id, dados) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.pacotes = db.pacotes.map((pacote) =>
      pacote.id === id ? { ...pacote, ...dados } : pacote
    );
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.pacoteBanhos.update({ where: { id }, data: dados });
  return carregarDados();
}

export async function removerAgendamento(id) {
  if (!usarPrisma) {
    const db = await carregarDb();
    db.agendamentos = db.agendamentos.filter((agendamento) => agendamento.id !== id);
    await salvarDb(db);
    return carregarDados();
  }

  await prisma.agendamento.deleteMany({ where: { id } });
  return carregarDados();
}

export async function concluirAgendamento(id, concluidoEm) {
  if (!usarPrisma) {
    const db = await carregarDb();
    const agendamento = db.agendamentos.find((item) => item.id === id);

    if (!agendamento) {
      return null;
    }

    if (!agendamento.pago) {
      return { pagamentoPendente: true };
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

  if (!agendamento.pago) {
    return { pagamentoPendente: true };
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
