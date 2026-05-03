export const servicosPetshop = [
  "Banho",
  "Banho e Tosa",
  "Tosa Higiênica",
  "Corte de Unhas",
  "Banho Premium",
];

export const opcoesServicos = servicosPetshop.map((servico) => ({
  label: servico,
  value: servico,
}));
