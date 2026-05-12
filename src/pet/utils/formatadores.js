export function formatarHorarioMascara(valor) {
  // Remove tudo que não é dígito e limita a 4 caracteres
  const digitos = String(valor ?? "").replace(/\D/g, "").slice(0, 4);

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return digitos;

  // A partir de 3 dígitos, insere o ":" automaticamente
  return `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
}

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

export function dataBRParaDate(valor) {
  const partes = String(valor ?? "").split("/");

  if (partes.length !== 3) {
    return null;
  }

  const [dia, mes, ano] = partes.map(Number);

  if (!dia || !mes || !ano || ano < 1900) {
    return null;
  }

  const data = new Date(ano, mes - 1, dia);

  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }

  return data;
}

export function dataValidaBR(valor) {
  return Boolean(dataBRParaDate(valor));
}

export function formatarDataBR(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    return "";
  }

  return data.toLocaleDateString("pt-BR");
}

export function adicionarDiasDataBR(valor, dias) {
  const data = dataBRParaDate(valor) ?? new Date();
  data.setDate(data.getDate() + dias);
  return formatarDataBR(data);
}

export function horarioValido(valor) {
  const texto = String(valor ?? "").trim().replace("h", ":").replace(".", ":");
  const [horaRaw, minutoRaw = "00"] = texto.split(":");

  if (!/^\d{1,2}$/.test(horaRaw) || !/^\d{1,2}$/.test(minutoRaw)) {
    return false;
  }

  const hora = Number(horaRaw);
  const minuto = Number(minutoRaw);

  return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
}

export function dataHoraParaTempo({ data, horario }) {
  const dataValida = dataBRParaDate(data);

  if (!dataValida) {
    return Number.NaN;
  }

  const dia = dataValida.getDate();
  const mes = dataValida.getMonth() + 1;
  const ano = dataValida.getFullYear();
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
