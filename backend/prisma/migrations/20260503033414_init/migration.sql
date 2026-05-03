-- CreateTable
CREATE TABLE "donos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "busca" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "donos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "porte" TEXT NOT NULL,
    "foto" TEXT NOT NULL DEFAULT '',
    "donoId" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacotes_banhos" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "quantidadeBanhos" INTEGER NOT NULL,
    "dataPrimeiroBanho" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacotes_banhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "preco" TEXT NOT NULL DEFAULT '0,00',
    "lamina" TEXT NOT NULL DEFAULT '-',
    "observacoes" TEXT NOT NULL DEFAULT 'Sem observacoes.',
    "imagemUri" TEXT NOT NULL DEFAULT '',
    "pacoteId" TEXT,
    "numeroBanho" INTEGER,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "preco" TEXT NOT NULL DEFAULT '0,00',
    "lamina" TEXT NOT NULL DEFAULT '-',
    "observacoes" TEXT NOT NULL DEFAULT 'Sem observacoes.',
    "imagemUri" TEXT NOT NULL DEFAULT '',
    "pacoteId" TEXT,
    "numeroBanho" INTEGER,
    "concluidoEm" TEXT NOT NULL,

    CONSTRAINT "historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_donoId_fkey" FOREIGN KEY ("donoId") REFERENCES "donos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacotes_banhos" ADD CONSTRAINT "pacotes_banhos_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_pacoteId_fkey" FOREIGN KEY ("pacoteId") REFERENCES "pacotes_banhos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico" ADD CONSTRAINT "historico_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
