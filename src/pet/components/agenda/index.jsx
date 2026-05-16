import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const LARGURA_ITEM_DIA = 75;

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
}

function mesmoMes(dataA, dataB) {
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth()
  );
}

function Agenda({
  horarios,
  agendamentos = [],
  obterPet,
  onSelecionarHorario,
  onAbrirAgendamento,
  onAbrirHorarioOcupado,
}) {
  const hoje = new Date();

  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [mesVisivel, setMesVisivel] = useState(
    new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const flatListDiasRef = useRef(null);
  const scrollInicialAplicado = useRef(false);

  function gerarDiasDoMes(dataBase) {
    const ano = dataBase.getFullYear();
    const mes = dataBase.getMonth();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const dias = [];

    for (let i = 1; i <= totalDias; i++) {
      const data = new Date(ano, mes, i);

      dias.push({
        dia: i,
        semana: data.toLocaleDateString("pt-BR", { weekday: "short" }),
        dataCompleta: data,
      });
    }

    return dias;
  }

  function alterarMes(delta) {
    const novoMes = new Date(
      mesVisivel.getFullYear(),
      mesVisivel.getMonth() + delta,
      1
    );

    setMesVisivel(novoMes);
    setDataSelecionada(novoMes);
    setHorarioSelecionado(null);
  }

  function selecionarHoje() {
    const agora = new Date();
    setMesVisivel(new Date(agora.getFullYear(), agora.getMonth(), 1));
    setDataSelecionada(agora);
    setHorarioSelecionado(null);
  }

  const dias = gerarDiasDoMes(mesVisivel);
  const dataAtual = formatarData(dataSelecionada);
  const mesTitulo = mesVisivel.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const mesCorrente = mesmoMes(mesVisivel, hoje);
  const indiceDiaHoje = hoje.getDate() - 1;
  const indiceScrollInicial = mesCorrente ? indiceDiaHoje : 0;

  const rolarParaIndice = useCallback(
    (indice, animado = true) => {
      if (indice < 0 || indice >= dias.length) {
        return;
      }

      flatListDiasRef.current?.scrollToIndex({
        index: indice,
        animated: animado,
        viewPosition: 0,
      });
    },
    [dias.length]
  );

  useEffect(() => {
    const indiceAlvo = mesCorrente
      ? indiceDiaHoje
      : Math.max(0, dataSelecionada.getDate() - 1);

    const animado = scrollInicialAplicado.current;
    const timeout = setTimeout(() => {
      rolarParaIndice(indiceAlvo, animado);
      scrollInicialAplicado.current = true;
    }, 80);

    return () => clearTimeout(timeout);
  }, [
    mesVisivel,
    dias.length,
    mesCorrente,
    indiceDiaHoje,
    dataSelecionada,
    rolarParaIndice,
  ]);

  return (
    <FlatList
      data={horarios}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.lista}
      ListHeaderComponent={
        <View>
          <View style={styles.controleMes}>
            <TouchableOpacity
              style={styles.botaoMes}
              onPress={() => alterarMes(-1)}
              accessibilityRole="button"
              accessibilityLabel="Ver mes anterior"
            >
              <Text style={styles.botaoMesTexto}>{"<"}</Text>
            </TouchableOpacity>
            <View style={styles.mesCentro}>
              <Text style={styles.mesTitulo}>{mesTitulo}</Text>
              <TouchableOpacity
                style={styles.botaoHoje}
                onPress={selecionarHoje}
                accessibilityRole="button"
                accessibilityLabel="Voltar para hoje"
              >
                <Text style={styles.botaoHojeTexto}>Hoje</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.botaoMes}
              onPress={() => alterarMes(1)}
              accessibilityRole="button"
              accessibilityLabel="Ver proximo mes"
            >
              <Text style={styles.botaoMesTexto}>{">"}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListDiasRef}
            key={`${mesVisivel.getFullYear()}-${mesVisivel.getMonth()}`}
            data={dias}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.barraDias}
            keyExtractor={(item) => item.dia.toString()}
            initialScrollIndex={indiceScrollInicial}
            getItemLayout={(_, index) => ({
              length: LARGURA_ITEM_DIA,
              offset: LARGURA_ITEM_DIA * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                rolarParaIndice(info.index, false);
              }, 300);
            }}
            renderItem={({ item }) => {
              const ativo =
                item.dataCompleta.toDateString() === dataSelecionada.toDateString();

              return (
                <TouchableOpacity
                  style={[styles.dia, ativo && styles.diaAtivo]}
                  onPress={() => {
                    setDataSelecionada(item.dataCompleta);
                    setHorarioSelecionado(null);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar ${item.semana}, dia ${item.dia}`}
                  accessibilityState={{ selected: ativo }}
                >
                  <Text style={[styles.semana, ativo && styles.textoAtivo]}>
                    {item.semana}
                  </Text>

                  <Text style={[styles.numero, ativo && styles.textoAtivo]}>
                    {item.dia}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      }
      renderItem={({ item }) => {
        const ativo = horarioSelecionado === item;
        const agendamentosDoHorario = agendamentos.filter(
          (agenda) => agenda.data === dataAtual && agenda.horario === item
        );
        const agendamento = agendamentosDoHorario[0];
        const nomesPets = agendamentosDoHorario
          .map((agenda) => obterPet?.(agenda.petId)?.nome)
          .filter(Boolean);
        const ocupado = agendamentosDoHorario.length > 0;

        return (
          <TouchableOpacity
            style={[
              styles.card,
              ativo && styles.cardSelecionado,
              ocupado && styles.cardOcupado,
            ]}
            onPress={() => {
              setHorarioSelecionado(item);
              if (agendamentosDoHorario.length > 1) {
                onAbrirHorarioOcupado?.({ data: dataAtual, horario: item });
                return;
              }

              if (agendamentosDoHorario.length === 1) {
                onAbrirAgendamento?.(agendamento.id);
                return;
              }

              onSelecionarHorario?.({ data: dataAtual, horario: item });
            }}
            accessibilityRole="button"
            accessibilityLabel={
              ocupado
                ? `Horário ${item} ocupado por ${nomesPets.join(", ") || "agendamento"}`
                : `Agendar horário ${item}`
            }
            accessibilityState={{ selected: ativo }}
          >
            <View style={styles.linha}>
              <Text style={[styles.etiqueta, ocupado ? styles.etiquetaOcupado : styles.etiquetaLivre]}>
                {ocupado ? "Ocupado" : "Livre"}
              </Text>

              <Text style={[styles.horario, ativo && styles.textoAtivo]}>{item}</Text>

              <Text style={[styles.status, ativo && styles.statusAtivo]}>
                {ocupado
                  ? agendamentosDoHorario.length > 1
                    ? `${agendamentosDoHorario.length} pets: ${nomesPets.slice(0, 2).join(", ")}`
                    : nomesPets[0] ?? "Agendado"
                  : "Agendar"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default Agenda;
