export function gerarHorarios(horaInicial, horaFinal, intervalo = 30) {
  const horarios = [];

  let hora = horaInicial;
  let minuto = 0;

  while (hora < horaFinal) {
    const h = String(hora).padStart(2, "0");
    const m = String(minuto).padStart(2, "0");

    horarios.push(`${h}:${m}`);

    minuto += intervalo;

    if (minuto >= 60) {
      hora += Math.floor(minuto / 60);
      minuto = minuto % 60;
    }
  }

  return horarios;
}