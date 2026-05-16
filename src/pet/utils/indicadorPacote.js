/**
 * Texto para badge/modal: serviço avulso ou banho de pacote (com número, se houver).
 */
export function textoIndicadorPacote(registro) {
  if (!registro?.pacoteId) {
    return "Avulso";
  }

  return registro.numeroBanho
    ? `Pacote · banho ${registro.numeroBanho}`
    : "Pacote";
}
