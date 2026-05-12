import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
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

  // Ref da FlatList horizontal para controlar o scroll
  const flatListDiasRef = useRef(null);

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

  // Sempre que o mês visível mudar, rola para o dia selecionado (ou dia atual se for o mês atual)
  useEffect(() => {
    const anoHoje = hoje.getFullYear();
    const mesHoje = hoje.getMonth();
    const anoVisivel = mesVisivel.getFullYear();
    const mesAtualVisivel = mesVisivel.getMonth();

    // Se está exibindo o mês atual, rola para o dia de hoje (índice = dia - 1)
    // Caso contrário, rola para o início (índice 0)
    const indiceAlvo =
      anoVisivel === anoHoje && mesAtualVisivel === mesHoje
        ? hoje.getDate() - 1
        : 0;

    // Aguarda a lista renderizar antes de rolar
    const timeout = setTimeout(() => {
      flatListDiasRef.current?.scrollToIndex({
        index: indiceAlvo,
        animated: true,
        viewPosition: 0, // Alinha o item no início da lista visível
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [mesVisivel]);

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
            data={dias}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.barraDias}
            keyExtractor={(item) => item.dia.toString()}
            // Necessário para scrollToIndex funcionar corretamente
            getItemLayout={(_, index) => ({
              length: 56, // Ajuste conforme a largura real do item de dia no seu styles
              offset: 56 * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              // Fallback: aguarda mais tempo e tenta novamente
              setTimeout(() => {
                flatListDiasRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0,
                });
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
