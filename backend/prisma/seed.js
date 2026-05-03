import { PrismaClient } from "@prisma/client";
import { dadosIniciais } from "../src/db.js";

const prisma = new PrismaClient();

async function main() {
  for (const dono of dadosIniciais.donos) {
    await prisma.dono.upsert({
      where: { id: dono.id },
      create: dono,
      update: dono
    });
  }

  for (const pet of dadosIniciais.pets) {
    await prisma.pet.upsert({
      where: { id: pet.id },
      create: pet,
      update: pet
    });
  }

  for (const agendamento of dadosIniciais.agendamentos) {
    await prisma.agendamento.upsert({
      where: { id: agendamento.id },
      create: agendamento,
      update: agendamento
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
