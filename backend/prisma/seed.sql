BEGIN;

TRUNCATE TABLE historico, agendamentos, pacotes_banhos, pets, donos
RESTART IDENTITY CASCADE;

INSERT INTO donos (id, nome, telefone, busca) VALUES
  ('dono-mariana-alves', 'Mariana Alves', '(11) 98432-1180', true),
  ('dono-roberto-lima', 'Roberto Lima', '(11) 97214-5530', false),
  ('dono-camila-ferreira', 'Camila Ferreira', '(11) 96548-2201', true),
  ('dono-paulo-nogueira', 'Paulo Nogueira', '(11) 99176-4420', false),
  ('dono-juliana-ramos', 'Juliana Ramos', '(11) 98765-1402', false),
  ('dono-rafael-mendes', 'Rafael Mendes', '(11) 97642-8890', true),
  ('dono-patricia-duarte', 'Patricia Duarte', '(11) 99418-6721', false),
  ('dono-andre-costa', 'Andre Costa', '(11) 96810-3344', false);

INSERT INTO pets (id, nome, raca, porte, foto, "donoId") VALUES
  ('pet-lola', 'Lola', 'Shih Tzu', 'Pequeno', 'https://placedog.net/300/300?id=21', 'dono-mariana-alves'),
  ('pet-thor', 'Thor', 'Labrador', 'Grande', 'https://placedog.net/300/300?id=22', 'dono-roberto-lima'),
  ('pet-mel', 'Mel', 'Spitz Alemao', 'Pequeno', 'https://placedog.net/300/300?id=23', 'dono-camila-ferreira'),
  ('pet-bento', 'Bento', 'SRD', 'Medio', '', 'dono-paulo-nogueira'),
  ('pet-nina', 'Nina', 'Golden Retriever', 'Grande', 'https://placedog.net/300/300?id=24', 'dono-juliana-ramos'),
  ('pet-simba', 'Simba', 'Persa', 'Pequeno', '', 'dono-rafael-mendes'),
  ('pet-pipoca', 'Pipoca', 'Poodle', 'Medio', 'https://placedog.net/300/300?id=25', 'dono-patricia-duarte'),
  ('pet-bob', 'Bob', 'Bulldog Frances', 'Medio', 'https://placedog.net/300/300?id=26', 'dono-andre-costa'),
  ('pet-amora', 'Amora', 'Yorkshire', 'Pequeno', '', 'dono-mariana-alves'),
  ('pet-olivia', 'Olivia', 'Border Collie', 'Grande', '', 'dono-camila-ferreira');

INSERT INTO pacotes_banhos (
  id,
  "petId",
  "quantidadeBanhos",
  "dataPrimeiroBanho",
  horario,
  servico,
  "bonusServico",
  "bonusConcluido",
  "bonusConcluidoEm",
  "criadoEm"
) VALUES
  ('pacote-pipoca-maio', 'pet-pipoca', 4, '04/05/2026', '09:00', 'Banho', 'Tosa Higienica', false, '', '2026-05-01T12:00:00.000Z'),
  ('pacote-bento-maio', 'pet-bento', 3, '06/05/2026', '16:00', 'Banho', 'Hidratacao das patas', true, '10/05/2026 15:00', '2026-05-03T15:30:00.000Z');

INSERT INTO agendamentos (
  id,
  "petId",
  servico,
  data,
  horario,
  pago,
  "pagoEm",
  preco,
  lamina,
  observacoes,
  "imagemUri",
  "pacoteId",
  "numeroBanho"
) VALUES
  ('ag-lola-20260511', 'pet-lola', 'Banho e Tosa', '11/05/2026', '10:30', true, '10/05/2026 18:22', '95,00', '4', 'Tosar baixinho e usar laco azul.', '', NULL, NULL),
  ('ag-thor-20260511', 'pet-thor', 'Banho', '11/05/2026', '14:00', false, '', '70,00', '-', 'Usar shampoo neutro. Tutor busca as 17h.', '', NULL, NULL),
  ('ag-pipoca-p2', 'pet-pipoca', 'Banho', '11/05/2026', '09:00', true, '04/05/2026 09:12', '180,00', '-', 'Segundo banho do pacote. Conferir ouvido esquerdo.', '', 'pacote-pipoca-maio', 2),
  ('ag-simba-20260512', 'pet-simba', 'Banho Premium', '12/05/2026', '09:30', false, '', '90,00', '-', 'Gato arisco. Manusear com calma e evitar secador forte.', '', NULL, NULL),
  ('ag-nina-20260512', 'pet-nina', 'Banho Premium', '12/05/2026', '15:00', true, '11/05/2026 12:10', '110,00', '-', 'Inclui hidratacao e escovacao reforcada.', '', NULL, NULL),
  ('ag-bento-p2', 'pet-bento', 'Banho', '13/05/2026', '16:00', true, '06/05/2026 16:05', '150,00', '-', 'Segundo banho do pacote.', '', 'pacote-bento-maio', 2),
  ('ag-olivia-20260513', 'pet-olivia', 'Banho e Tosa', '13/05/2026', '11:00', false, '', '120,00', '5', 'Remover nos atras da orelha antes do banho.', '', NULL, NULL),
  ('ag-bob-20260514', 'pet-bob', 'Banho e Tosa', '14/05/2026', '13:30', true, '09/05/2026 10:40', '100,00', '7', 'Manter focinho arredondado.', '', NULL, NULL),
  ('ag-pipoca-p3', 'pet-pipoca', 'Banho', '18/05/2026', '09:00', true, '04/05/2026 09:12', '180,00', '-', 'Terceiro banho do pacote.', '', 'pacote-pipoca-maio', 3),
  ('ag-bento-p3', 'pet-bento', 'Banho', '20/05/2026', '16:00', true, '06/05/2026 16:05', '150,00', '-', 'Ultimo banho do pacote.', '', 'pacote-bento-maio', 3),
  ('ag-pipoca-p4', 'pet-pipoca', 'Banho', '25/05/2026', '09:00', true, '04/05/2026 09:12', '180,00', '-', 'Ultimo banho do pacote.', '', 'pacote-pipoca-maio', 4);

INSERT INTO historico (
  id,
  "petId",
  servico,
  data,
  horario,
  pago,
  "pagoEm",
  preco,
  lamina,
  observacoes,
  "imagemUri",
  "pacoteId",
  "numeroBanho",
  "concluidoEm"
) VALUES
  ('hist-lola-20260502', 'pet-lola', 'Banho', '02/05/2026', '09:30', true, '02/05/2026 09:35', '55,00', '-', 'Banho concluido. Tutor pediu perfume suave.', '', NULL, NULL, '02/05/2026'),
  ('hist-mel-20260503', 'pet-mel', 'Banho Premium', '03/05/2026', '11:00', true, '03/05/2026 11:05', '85,00', '-', 'Hidratacao feita. Pelagem sem nos.', '', NULL, NULL, '03/05/2026'),
  ('hist-thor-20260504', 'pet-thor', 'Corte de Unhas', '04/05/2026', '10:00', true, '04/05/2026 10:08', '30,00', '-', 'Atendimento rapido, sem intercorrencias.', '', NULL, NULL, '04/05/2026'),
  ('hist-pipoca-p1', 'pet-pipoca', 'Banho', '04/05/2026', '09:00', true, '04/05/2026 09:12', '180,00', '-', 'Primeiro banho do pacote.', '', 'pacote-pipoca-maio', 1, '04/05/2026'),
  ('hist-bob-20260505', 'pet-bob', 'Banho e Tosa', '05/05/2026', '15:30', true, '05/05/2026 15:40', '95,00', '7', 'Finalizado sem ocorrencias.', '', NULL, NULL, '05/05/2026'),
  ('hist-bento-p1', 'pet-bento', 'Banho', '06/05/2026', '16:00', true, '06/05/2026 16:05', '150,00', '-', 'Primeiro banho do pacote.', '', 'pacote-bento-maio', 1, '06/05/2026'),
  ('hist-simba-20260507', 'pet-simba', 'Banho', '07/05/2026', '13:00', true, '07/05/2026 13:10', '75,00', '-', 'Usado shampoo para peles sensiveis.', '', NULL, NULL, '07/05/2026'),
  ('hist-nina-20260508', 'pet-nina', 'Banho Premium', '08/05/2026', '10:30', true, '08/05/2026 10:45', '105,00', '-', 'Escovacao longa por troca de pelos.', '', NULL, NULL, '08/05/2026'),
  ('hist-amora-20260509', 'pet-amora', 'Banho e Tosa', '09/05/2026', '09:00', true, '09/05/2026 09:15', '90,00', '4', 'Tosa bebe solicitada pela tutora.', '', NULL, NULL, '09/05/2026'),
  ('hist-mel-20260510', 'pet-mel', 'Corte de Unhas', '10/05/2026', '12:00', true, '10/05/2026 12:05', '30,00', '-', 'Retorno rapido para manutencao.', '', NULL, NULL, '10/05/2026');

COMMIT;
