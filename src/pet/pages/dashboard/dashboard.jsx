import { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "../../components/appScreen";
import Menu from "../../components/navbar";
import { usePetShop } from "../../context/PetShopContext";
import {
  dataHoraParaTempo,
  formatarDataDigitada,
  formatarDataHoraAtual,
} from "../../utils/formatadores";
import { styles } from "./styles";

const tabs = ["Geral", "Pets", "Donos", "Pacotes abertos"];

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

function incrementar(mapa, chave) {
  mapa.set(chave, (mapa.get(chave) ?? 0) + 1);
}

function ranking(mapa) {
  return [...mapa.entries()]
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

function ordenarBanhos(a, b) {
  const numeroA = a.numeroBanho ?? 999;
  const numeroB = b.numeroBanho ?? 999;

  if (numeroA !== numeroB) {
    return numeroA - numeroB;
  }

  return dataHoraParaTempo(a) - dataHoraParaTempo(b);
}

function ordenarBanhosDesc(a, b) {
  return dataHoraParaTempo(b) - dataHoraParaTempo(a);
}

function dataDePagamento(pagoEm) {
  return String(pagoEm ?? "").split(" ")[0];
}

function Barras({ dados, limite = 5, onPress }) {
  const visiveis = dados.slice(0, limite);
  const maior = Math.max(...visiveis.map((item) => item.quantidade), 1);

  return (
    <>
      {visiveis.length ? (
        visiveis.map((item) => (
          <TouchableOpacity
            key={item.nome}
            style={styles.barraLinha}
            activeOpacity={onPress ? 0.75 : 1}
            onPress={() => onPress?.(item)}
          >
            <View style={styles.barraTopo}>
              <Text style={styles.barraLabel} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.barraValor}>{item.quantidade}</Text>
            </View>
            <View style={styles.barraTrilho}>
              <View
                style={[
                  styles.barraPreenchida,
                  { width: `${Math.max((item.quantidade / maior) * 100, 8)}%` },
                ]}
              />
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.vazio}>Sem dados no periodo.</Text>
      )}
    </>
  );
}

function DetalheModal({ titulo, visivel, onFechar, children }) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalTopo}>
            <Text style={styles.modalTitulo}>{titulo}</Text>
            <TouchableOpacity style={styles.fechar} onPress={onFechar}>
              <Text style={styles.fecharTexto}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Dashboard() {
  const {
    historico,
    pets,
    donos,
    pacotes,
    agendamentos,
    atualizarPacote,
  } = usePetShop();
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [aba, setAba] = useState("Geral");
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [donoSelecionado, setDonoSelecionado] = useState(null);
  const [pacoteSelecionado, setPacoteSelecionado] = useState(null);

  const dashboard = useMemo(() => {
    const registros = historico.filter((registro) =>
      dentroDoPeriodo(registro, inicio, fim)
    );
    const porServico = new Map();
    const porPetServico = new Map();
    const porDono = new Map();
    const registrosPorServico = new Map();
    const registrosPorPet = new Map();
    const registrosPorDono = new Map();
    const receita = registros.reduce(
      (total, registro) => total + precoParaNumero(registro.preco),
      0
    );

    for (const registro of registros) {
      const pet = pets.find((item) => item.id === registro.petId);
      const dono = pet ? donos.find((item) => item.id === pet.donoId) : null;
      const petNome = pet?.nome ?? "Pet removido";
      const donoNome = dono?.nome ?? "Dono removido";

      incrementar(porServico, registro.servico);
      incrementar(porDono, donoNome);

      if (!registrosPorServico.has(registro.servico)) {
        registrosPorServico.set(registro.servico, []);
      }
      registrosPorServico.get(registro.servico).push({ ...registro, pet: petNome });

      if (!porPetServico.has(petNome)) {
        porPetServico.set(petNome, new Map());
      }
      incrementar(porPetServico.get(petNome), registro.servico);

      if (!registrosPorPet.has(petNome)) {
        registrosPorPet.set(petNome, []);
      }
      registrosPorPet.get(petNome).push(registro);

      if (!registrosPorDono.has(donoNome)) {
        registrosPorDono.set(donoNome, []);
      }
      registrosPorDono.get(donoNome).push({ ...registro, pet: petNome });
    }

    for (const pacote of pacotes) {
      const banhosConcluidos = historico
        .filter((item) => item.pacoteId === pacote.id)
        .sort(ordenarBanhosDesc);
      const banhosDoPacote = [
        ...banhosConcluidos,
        ...agendamentos.filter((item) => item.pacoteId === pacote.id),
      ];
      const banhoPago = banhosDoPacote.find((item) => item.pago && item.pagoEm);
      const primeiroBanhoConcluido = banhosConcluidos[banhosConcluidos.length - 1];
      const dataReferencia =
        dataDePagamento(banhoPago?.pagoEm) ||
        primeiroBanhoConcluido?.concluidoEm ||
        primeiroBanhoConcluido?.data;

      if (!dataReferencia) {
        continue;
      }

      if (!dentroDoPeriodo({ data: dataReferencia }, inicio, fim)) {
        continue;
      }

      const pet = pets.find((item) => item.id === pacote.petId);
      const nomeServicoPacote = "Pacote - Banho";
      const registroBase = banhoPago || primeiroBanhoConcluido;
      const registroPacote = {
        ...registroBase,
        id: `servico-${pacote.id}`,
        concluidoEm: dataReferencia,
        data: dataReferencia,
        servico: nomeServicoPacote,
        pet: pet?.nome ?? "Pet removido",
        preco: registroBase?.preco ?? "0,00",
      };

      incrementar(porServico, nomeServicoPacote);

      if (!registrosPorServico.has(nomeServicoPacote)) {
        registrosPorServico.set(nomeServicoPacote, []);
      }
      registrosPorServico.get(nomeServicoPacote).push(registroPacote);
    }

    const servicosPorPet = [...porPetServico.entries()]
      .map(([pet, mapa]) => ({
        nome: pet,
        quantidade: [...mapa.values()].reduce((soma, valor) => soma + valor, 0),
        servicos: ranking(mapa),
        registros: registrosPorPet.get(pet) ?? [],
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    const donosRanking = ranking(porDono).map((dono) => ({
      ...dono,
      registros: registrosPorDono.get(dono.nome) ?? [],
    }));

    const pacotesResumo = pacotes
      .map((pacote) => {
        const pet = pets.find((item) => item.id === pacote.petId);
        const banhosEmAberto = agendamentos.filter(
          (item) => item.pacoteId === pacote.id
        ).length;
        const banhosConcluidos = historico.filter(
          (item) => item.pacoteId === pacote.id
        ).length;
        const quantidade = Number(pacote.quantidadeBanhos) || 0;
        const banhosFaltando = Math.max(quantidade - banhosConcluidos, 0);
        const proximoBanho = banhosFaltando > 0 ? banhosConcluidos + 1 : null;
        const progresso =
          quantidade > 0 ? Math.min((banhosConcluidos / quantidade) * 100, 100) : 0;
        const banhos = [
          ...historico
            .filter((item) => item.pacoteId === pacote.id)
            .map((item) => ({ ...item, statusPacote: "Concluido" })),
          ...agendamentos
            .filter((item) => item.pacoteId === pacote.id)
            .map((item) => ({ ...item, statusPacote: "Agendado" })),
        ].sort(ordenarBanhos);

        return {
          nome: `${pet?.nome ?? "Pet removido"} - Pacote de banhos`,
          quantidade,
          pacote,
          pet: pet?.nome ?? "Pet removido",
          banhosEmAberto,
          banhosConcluidos,
          banhosFaltando,
          proximoBanho,
          progresso,
          banhos,
          bonusServico: pacote.bonusServico ?? "Tosa Higiênica",
          bonusConcluido: Boolean(pacote.bonusConcluido),
          bonusConcluidoEm: pacote.bonusConcluidoEm ?? "",
        };
      })
      .filter((item) => item.banhosFaltando > 0)
      .sort((a, b) => b.banhosFaltando - a.banhosFaltando);

    return {
      totalAtendimentos: registros.length,
      receita: receita.toFixed(2).replace(".", ","),
      servicosMaisContratados: ranking(porServico),
      servicosPorPet,
      donosRanking,
      pacotesResumo,
      registrosPorServico,
    };
  }, [historico, pets, donos, pacotes, agendamentos, inicio, fim]);

  const servicoMaisContratado = dashboard.servicosMaisContratados[0]?.nome ?? "-";
  const petMaisRecorrente = dashboard.servicosPorPet[0]?.nome ?? "-";
  const servicoDetalhe = servicoSelecionado
    ? dashboard.registrosPorServico.get(servicoSelecionado.nome) ?? []
    : [];

  function alternarBonusPacote() {
    if (!pacoteSelecionado) {
      return;
    }

    const bonusConcluido = !pacoteSelecionado.bonusConcluido;
    const dados = {
      bonusConcluido,
      bonusConcluidoEm: bonusConcluido ? formatarDataHoraAtual() : "",
    };

    atualizarPacote(pacoteSelecionado.pacote.id, dados);
    setPacoteSelecionado((atual) => (atual ? { ...atual, ...dados } : atual));
  }

  return (
    <AppScreen style={styles.container}>
      <Menu />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Dashboard</Text>

        <View style={styles.filtros}>
          <TextInput
            value={inicio}
            onChangeText={(valor) => setInicio(formatarDataDigitada(valor))}
            placeholder="Data inicial"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="number-pad"
          />
          <TextInput
            value={fim}
            onChangeText={(valor) => setFim(formatarDataDigitada(valor))}
            placeholder="Data final"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.resumoGrid}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoValor}>{dashboard.totalAtendimentos}</Text>
            <Text style={styles.resumoLabel}>Atendimentos</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoValor}>R$ {dashboard.receita}</Text>
            <Text style={styles.resumoLabel}>Receita</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoValor} numberOfLines={1}>
              {servicoMaisContratado}
            </Text>
            <Text style={styles.resumoLabel}>Servico top</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoValor} numberOfLines={1}>
              {petMaisRecorrente}
            </Text>
            <Text style={styles.resumoLabel}>Pet top</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tab, aba === item && styles.tabAtiva]}
              onPress={() => setAba(item)}
            >
              <Text style={[styles.tabTexto, aba === item && styles.tabTextoAtivo]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {aba === "Geral" ? (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Servicos contratados</Text>
            <Barras
              dados={dashboard.servicosMaisContratados}
              onPress={setServicoSelecionado}
            />
          </View>
        ) : null}

        {aba === "Pets" ? (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Pets mais recorrentes</Text>
            {dashboard.servicosPorPet.length ? (
              dashboard.servicosPorPet.slice(0, 5).map((item) => (
                <TouchableOpacity
                  key={item.nome}
                  style={styles.petLinha}
                  onPress={() => setPetSelecionado(item)}
                >
                  <View>
                    <Text style={styles.petNome}>{item.nome}</Text>
                    <Text style={styles.petResumo} numberOfLines={1}>
                      {item.servicos[0]?.nome ?? "-"}
                    </Text>
                  </View>
                  <Text style={styles.petTotal}>{item.quantidade}x</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.vazio}>Sem dados no periodo.</Text>
            )}
          </View>
        ) : null}

        {aba === "Donos" ? (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Donos mais recorrentes</Text>
            <Barras dados={dashboard.donosRanking} onPress={setDonoSelecionado} />
          </View>
        ) : null}

        {aba === "Pacotes abertos" ? (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Pacotes em aberto</Text>
            {dashboard.pacotesResumo.length ? (
              dashboard.pacotesResumo.slice(0, 5).map((item) => (
                <TouchableOpacity
                  key={item.pacote.id}
                  style={styles.petLinha}
                  onPress={() => setPacoteSelecionado(item)}
                >
                  <View style={styles.petLinhaConteudo}>
                    <Text style={styles.petNome}>{item.nome}</Text>
                    <Text style={styles.petResumo}>
                      {item.banhosConcluidos} de {item.quantidade} feitos. Faltam{" "}
                      {item.banhosFaltando}
                    </Text>
                    <Text style={styles.petResumo}>
                      Tosa higiênica feita? {item.bonusConcluido ? "Sim" : "Nao"}
                    </Text>
                    <View style={styles.progressoTrilho}>
                      <View
                        style={[
                          styles.progressoPreenchido,
                          { width: `${Math.max(item.progresso, item.progresso ? 8 : 0)}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.petTotal}>
                    {item.banhosConcluidos}/{item.quantidade}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.vazio}>Nenhum pacote criado.</Text>
            )}
          </View>
        ) : null}
      </ScrollView>

      <DetalheModal
        visivel={Boolean(servicoSelecionado)}
        titulo={servicoSelecionado?.nome ?? "Servico"}
        onFechar={() => setServicoSelecionado(null)}
      >
        <Text style={styles.modalResumo}>
          Total: {servicoSelecionado?.quantidade ?? 0} atendimentos
        </Text>
        {servicoDetalhe.slice(0, 10).map((item) => (
          <Text key={item.id} style={styles.modalLinha}>
            {item.pet} - {item.concluidoEm ?? item.data} - R$ {item.preco}
          </Text>
        ))}
      </DetalheModal>

      <DetalheModal
        visivel={Boolean(petSelecionado)}
        titulo={petSelecionado?.nome ?? "Pet"}
        onFechar={() => setPetSelecionado(null)}
      >
        <Text style={styles.modalResumo}>
          Total: {petSelecionado?.quantidade ?? 0} atendimentos
        </Text>
        <Barras dados={petSelecionado?.servicos ?? []} limite={8} />
        {(petSelecionado?.registros ?? []).slice(0, 10).map((item) => (
          <Text key={item.id} style={styles.modalLinha}>
            {item.concluidoEm ?? item.data} - {item.servico} - R$ {item.preco}
          </Text>
        ))}
      </DetalheModal>

      <DetalheModal
        visivel={Boolean(donoSelecionado)}
        titulo={donoSelecionado?.nome ?? "Dono"}
        onFechar={() => setDonoSelecionado(null)}
      >
        <Text style={styles.modalResumo}>
          Total: {donoSelecionado?.quantidade ?? 0} atendimentos
        </Text>
        {(donoSelecionado?.registros ?? []).slice(0, 10).map((item) => (
          <Text key={item.id} style={styles.modalLinha}>
            {item.pet} - {item.concluidoEm ?? item.data} - {item.servico}
          </Text>
        ))}
      </DetalheModal>

      <DetalheModal
        visivel={Boolean(pacoteSelecionado)}
        titulo={pacoteSelecionado?.pet ?? "Pacote"}
        onFechar={() => setPacoteSelecionado(null)}
      >
        <Text style={styles.modalResumo}>Pacote de banhos</Text>
        <Text style={styles.modalLinha}>
          Banhos no pacote: {pacoteSelecionado?.quantidade ?? 0}
        </Text>
        <Text style={styles.modalLinha}>
          Concluidos: {pacoteSelecionado?.banhosConcluidos ?? 0}
        </Text>
        <Text style={styles.modalLinha}>
          Faltam: {pacoteSelecionado?.banhosFaltando ?? 0}
        </Text>
        <Text style={styles.modalLinha}>
          Agendados em aberto: {pacoteSelecionado?.banhosEmAberto ?? 0}
        </Text>
        <Text style={styles.modalLinha}>
          Proximo banho:{" "}
          {pacoteSelecionado?.proximoBanho
            ? `${pacoteSelecionado.proximoBanho} de ${pacoteSelecionado.quantidade}`
            : "Pacote finalizado"}
        </Text>
        <Text style={styles.modalLinha}>
          Primeiro banho: {pacoteSelecionado?.pacote.dataPrimeiroBanho}
        </Text>
        <Text style={styles.modalLinha}>
          Servico extra: {pacoteSelecionado?.bonusServico ?? "Tosa Higiênica"}
        </Text>
        <Text style={styles.modalLinha}>
          Tosa higiênica feita?{" "}
          {pacoteSelecionado?.bonusConcluido
            ? `Sim, em ${pacoteSelecionado.bonusConcluidoEm || "-"}`
            : "Nao"}
        </Text>
        <TouchableOpacity style={styles.botaoBonus} onPress={alternarBonusPacote}>
          <Text style={styles.botaoBonusTexto}>
            {pacoteSelecionado?.bonusConcluido
              ? "Marcar tosa higiênica pendente"
              : "Marcar tosa higiênica feita"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.modalSubtitulo}>Banhos do pacote</Text>
        {(pacoteSelecionado?.banhos ?? []).map((banho) => (
          <View key={`${banho.statusPacote}-${banho.id}`} style={styles.banhoLinha}>
            <Text style={styles.banhoTitulo}>
              Banho {banho.numeroBanho ?? "-"} - {banho.statusPacote}
            </Text>
            <Text style={styles.banhoTexto}>
              {banho.data} as {banho.horario}
            </Text>
            <Text style={styles.banhoTexto}>
              Pagamento: {banho.pago ? `pago em ${banho.pagoEm || "-"}` : "pendente"}
            </Text>
          </View>
        ))}
      </DetalheModal>
    </AppScreen>
  );
}

export default Dashboard;
