import { PrismaClient } from "@prisma/client";
import { dadosIniciais, salvarDb } from "../src/db.js";

function normalizarPacote(pacote) {
  return {
    ...pacote,
    criadoEm: pacote.criadoEm ? new Date(pacote.criadoEm) : undefined
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    await salvarDb(dadosIniciais);
    console.log("Banco JSON local resetado e populado com dados realistas.");
    return;
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.historico.deleteMany();
      await tx.agendamento.deleteMany();
      await tx.pacoteBanhos.deleteMany();
      await tx.pet.deleteMany();
      await tx.dono.deleteMany();

      await tx.dono.createMany({ data: dadosIniciais.donos });
      await tx.pet.createMany({ data: dadosIniciais.pets });
      await tx.pacoteBanhos.createMany({
        data: dadosIniciais.pacotes.map(normalizarPacote)
      });
      await tx.agendamento.createMany({ data: dadosIniciais.agendamentos });
      await tx.historico.createMany({ data: dadosIniciais.historico });
    });

    console.log("Banco PostgreSQL resetado e populado com dados realistas.");
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
