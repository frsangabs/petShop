function parseDataBR(valor) {
  const [dia, mes, ano] = String(valor ?? "").split("/").map(Number);
  return new Date(ano, mes - 1, dia).getTime();
}

function dentroDoPeriodo(registro, inicio, fim) {
  const dataBase = registro.concluidoEm || registro.data;
  const tempo = parseDataBR(dataBase);
  const inicioTempo = inicio ? parseDataBR(inicio) : Number.NEGATIVE_INFINITY;
  const fimTempo = fim ? parseDataBR(fim) : Number.POSITIVE_INFINITY;
  return tempo >= inicioTempo && tempo <= fimTempo;
}

function precoParaNumero(valor) {
  const numero = Number(String(valor ?? "0").replace(/\./g, "").replace(",", "."));
  return Number.isNaN(numero) ? 0 : numero;
}

function incrementar(mapa, chave, valor = 1) {
  mapa.set(chave, (mapa.get(chave) ?? 0) + valor);
}

function mapaParaRanking(mapa) {
  return [...mapa.entries()]
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

export function gerarDashboard(dados, { inicio, fim } = {}) {
  const historico = dados.historico.filter((registro) =>
    dentroDoPeriodo(registro, inicio, fim)
  );
  const servicos = new Map();
  const servicosPorPet = new Map();
  const receita = historico.reduce(
    (total, registro) => total + precoParaNumero(registro.preco),
    0
  );

  for (const registro of historico) {
    const pet = dados.pets.find((item) => item.id === registro.petId);
    const petNome = pet?.nome ?? "Pet removido";

    incrementar(servicos, registro.servico);

    if (!servicosPorPet.has(petNome)) {
      servicosPorPet.set(petNome, new Map());
    }

    incrementar(servicosPorPet.get(petNome), registro.servico);
  }

  return {
    periodo: { inicio: inicio || null, fim: fim || null },
    totalAtendimentos: historico.length,
    receita: receita.toFixed(2).replace(".", ","),
    servicosMaisContratados: mapaParaRanking(servicos),
    servicosPorPet: [...servicosPorPet.entries()]
      .map(([pet, mapa]) => ({
        pet,
        total: [...mapa.values()].reduce((soma, valor) => soma + valor, 0),
        servicos: mapaParaRanking(mapa)
      }))
      .sort((a, b) => b.total - a.total)
  };
}
