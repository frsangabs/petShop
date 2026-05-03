ALTER TABLE "pacotes_banhos"
ADD COLUMN "bonusServico" TEXT NOT NULL DEFAULT 'Tosa Higiênica',
ADD COLUMN "bonusConcluido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "bonusConcluidoEm" TEXT NOT NULL DEFAULT '';

ALTER TABLE "agendamentos"
ADD COLUMN "pagoEm" TEXT NOT NULL DEFAULT '';

ALTER TABLE "historico"
ADD COLUMN "pagoEm" TEXT NOT NULL DEFAULT '';
