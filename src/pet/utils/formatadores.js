export function formatarHorario(valor) {
  const texto = String(valor ?? "").trim().replace("h", ":").replace(".", ":");

  if (!texto) {
    return "";
  }

  const [horaRaw, minutoRaw = "00"] = texto.split(":");
  const hora = Number(horaRaw);
  const minuto = Number(minutoRaw);

  if (Number.isNaN(hora)) {
    return texto;
  }

  const horaFormatada = String(Math.min(Math.max(hora, 0), 23)).padStart(2, "0");
  const minutoFormatado = String(
    Number.isNaN(minuto) ? 0 : Math.min(Math.max(minuto, 0), 59)
  ).padStart(2, "0");

  return `${horaFormatada}:${minutoFormatado}`;
}

export function formatarPreco(valor) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return "";
  }

  const normalizado = texto.replace(/\./g, "").replace(",", ".");
  const numero = Number(normalizado);

  if (Number.isNaN(numero)) {
    return texto;
  }

  return numero.toFixed(2).replace(".", ",");
}

export function formatarDataDigitada(valor) {
  const digitos = String(valor ?? "").replace(/\D/g, "").slice(0, 8);

  if (digitos.length <= 2) {
    return digitos;
  }

  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  }

  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

export function dataHoraParaTempo({ data, horario }) {
  const [dia, mes, ano] = String(data).split("/").map(Number);
  const [hora = 0, minuto = 0] = String(formatarHorario(horario)).split(":").map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto).getTime();
}

export function formatarDataHoraAtual() {
  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR");
  const horario = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${data} ${horario}`;
}

export function dataHoraTextoParaTempo(valor) {
  const [data = "", horario = "00:00"] = String(valor ?? "").split(" ");

  return dataHoraParaTempo({ data, horario });
}
