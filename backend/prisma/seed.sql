BEGIN;

INSERT INTO donos (id, nome, telefone, busca) VALUES
  ('dono-joao', 'Joao Silva', '(11) 99999-9999', true),
  ('dono-ana', 'Ana Souza', '(11) 98888-8888', false),
  ('dono-marina', 'Marina Costa', '(11) 97777-7777', false),
  ('dono-carlos', 'Carlos Pereira', '(11) 96666-6666', true),
  ('dono-bianca', 'Bianca Lima', '(11) 95555-5555', false)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  telefone = EXCLUDED.telefone,
  busca = EXCLUDED.busca;

INSERT INTO pets (id, nome, raca, porte, foto, "donoId") VALUES
  ('pet-rex', 'Rex', 'Golden Retriever', 'Grande', 'https://placedog.net/300/300?id=10', 'dono-joao'),
  ('pet-mia', 'Mia', 'Persa', 'Pequeno', '', 'dono-ana'),
  ('pet-luna', 'Luna', 'Shih Tzu', 'Pequeno', 'https://placedog.net/300/300?id=11', 'dono-marina'),
  ('pet-thor', 'Thor', 'Pitbull', 'Grande', '', 'dono-carlos'),
  ('pet-mel', 'Mel', 'Poodle', 'Medio', '', 'dono-bianca'),
  ('pet-bob', 'Bob', 'Bulldog Frances', 'Medio', 'https://placedog.net/300/300?id=12', 'dono-joao')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  raca = EXCLUDED.raca,
  porte = EXCLUDED.porte,
  foto = EXCLUDED.foto,
  "donoId" = EXCLUDED."donoId";

INSERT INTO pacotes_banhos (
  id,
  "petId",
  "quantidadeBanhos",
  "dataPrimeiroBanho",
  horario,
  servico,
  "criadoEm"
) VALUES
  ('pacote-luna-maio', 'pet-luna', 4, '06/05/2026', '09:00', 'Banho', NOW()),
  ('pacote-mel-maio', 'pet-mel', 3, '07/05/2026', '15:30', 'Banho e Tosa', NOW())
ON CONFLICT (id) DO UPDATE SET
  "petId" = EXCLUDED."petId",
  "quantidadeBanhos" = EXCLUDED."quantidadeBanhos",
  "dataPrimeiroBanho" = EXCLUDED."dataPrimeiroBanho",
  horario = EXCLUDED.horario,
  servico = EXCLUDED.servico;

INSERT INTO agendamentos (
  id,
  "petId",
  servico,
  data,
  horario,
  pago,
  preco,
  lamina,
  observacoes,
  "imagemUri",
  "pacoteId",
  "numeroBanho"
) VALUES
  ('ag-rex-01', 'pet-rex', 'Banho e Tosa', '05/05/2026', '10:00', true, '90,00', '4', 'Rex costuma ficar tranquilo na secagem.', '', NULL, NULL),
  ('ag-mia-01', 'pet-mia', 'Banho', '05/05/2026', '14:00', false, '55,00', '-', 'Usar shampoo para pele sensivel.', '', NULL, NULL),
  ('ag-thor-01', 'pet-thor', 'Tosa higienica', '06/05/2026', '11:30', false, '70,00', '7', 'Confirmar comportamento antes do banho.', '', NULL, NULL),
  ('ag-luna-p1', 'pet-luna', 'Banho', '06/05/2026', '09:00', true, '50,00', '-', 'Primeiro banho do pacote.', '', 'pacote-luna-maio', 1),
  ('ag-luna-p2', 'pet-luna', 'Banho', '13/05/2026', '09:00', true, '50,00', '-', 'Banho gerado pelo pacote.', '', 'pacote-luna-maio', 2),
  ('ag-luna-p3', 'pet-luna', 'Banho', '20/05/2026', '09:00', true, '50,00', '-', 'Banho gerado pelo pacote.', '', 'pacote-luna-maio', 3),
  ('ag-luna-p4', 'pet-luna', 'Banho', '27/05/2026', '09:00', true, '50,00', '-', 'Banho gerado pelo pacote.', '', 'pacote-luna-maio', 4),
  ('ag-mel-p1', 'pet-mel', 'Banho e Tosa', '07/05/2026', '15:30', false, '85,00', '5', 'Primeiro banho do pacote.', '', 'pacote-mel-maio', 1),
  ('ag-mel-p2', 'pet-mel', 'Banho e Tosa', '14/05/2026', '15:30', false, '85,00', '5', 'Banho gerado pelo pacote.', '', 'pacote-mel-maio', 2),
  ('ag-mel-p3', 'pet-mel', 'Banho e Tosa', '21/05/2026', '15:30', false, '85,00', '5', 'Banho gerado pelo pacote.', '', 'pacote-mel-maio', 3)
ON CONFLICT (id) DO UPDATE SET
  "petId" = EXCLUDED."petId",
  servico = EXCLUDED.servico,
  data = EXCLUDED.data,
  horario = EXCLUDED.horario,
  pago = EXCLUDED.pago,
  preco = EXCLUDED.preco,
  lamina = EXCLUDED.lamina,
  observacoes = EXCLUDED.observacoes,
  "imagemUri" = EXCLUDED."imagemUri",
  "pacoteId" = EXCLUDED."pacoteId",
  "numeroBanho" = EXCLUDED."numeroBanho";

INSERT INTO historico (
  id,
  "petId",
  servico,
  data,
  horario,
  pago,
  preco,
  lamina,
  observacoes,
  "imagemUri",
  "pacoteId",
  "numeroBanho",
  "concluidoEm"
) VALUES
  ('hist-bob-01', 'pet-bob', 'Banho e Tosa', '28/04/2026', '16:00', true, '80,00', '5', 'Finalizado sem ocorrencias.', '', NULL, NULL, '28/04/2026'),
  ('hist-rex-01', 'pet-rex', 'Banho', '29/04/2026', '10:30', true, '45,00', '-', 'Banho concluido. Tutor pediu perfume suave.', '', NULL, NULL, '29/04/2026'),
  ('hist-mia-01', 'pet-mia', 'Tosa higienica', '30/04/2026', '13:00', false, '50,00', '10', 'Pagamento ficou pendente.', '', NULL, NULL, '30/04/2026')
ON CONFLICT (id) DO UPDATE SET
  "petId" = EXCLUDED."petId",
  servico = EXCLUDED.servico,
  data = EXCLUDED.data,
  horario = EXCLUDED.horario,
  pago = EXCLUDED.pago,
  preco = EXCLUDED.preco,
  lamina = EXCLUDED.lamina,
  observacoes = EXCLUDED.observacoes,
  "imagemUri" = EXCLUDED."imagemUri",
  "pacoteId" = EXCLUDED."pacoteId",
  "numeroBanho" = EXCLUDED."numeroBanho",
  "concluidoEm" = EXCLUDED."concluidoEm";

COMMIT;
