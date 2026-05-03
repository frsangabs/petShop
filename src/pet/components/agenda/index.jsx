import { useState } from "react";
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
}) {
  const hoje = new Date();

  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

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

  const dias = gerarDiasDoMes(dataSelecionada);
  const dataAtual = formatarData(dataSelecionada);

  return (
    <FlatList
      data={horarios}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.lista}
      ListHeaderComponent={
        <FlatList
          data={dias}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.barraDias}
          keyExtractor={(item) => item.dia.toString()}
          renderItem={({ item }) => {
            const ativo =
              item.dataCompleta.toDateString() === dataSelecionada.toDateString();

            return (
              <TouchableOpacity
                style={[styles.dia, ativo && styles.diaAtivo]}
                onPress={() => setDataSelecionada(item.dataCompleta)}
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
      }
      renderItem={({ item }) => {
        const ativo = horarioSelecionado === item;
        const agendamento = agendamentos.find(
          (agenda) => agenda.data === dataAtual && agenda.horario === item
        );
        const pet = agendamento ? obterPet?.(agendamento.petId) : null;
        const ocupado = Boolean(agendamento);

        return (
          <TouchableOpacity
            style={[
              styles.card,
              ativo && styles.cardSelecionado,
              ocupado && styles.cardOcupado,
            ]}
            onPress={() => {
              setHorarioSelecionado(item);
              if (agendamento) {
                onAbrirAgendamento?.(agendamento.id);
                return;
              }

              onSelecionarHorario?.({ data: dataAtual, horario: item });
            }}
          >
            <View style={styles.linha}>
              <Text style={styles.icone}>{ocupado ? "!" : "+"}</Text>

              <Text style={[styles.horario, ativo && styles.textoAtivo]}>{item}</Text>

              <Text style={[styles.status, ativo && styles.statusAtivo]}>
                {ocupado ? pet?.nome ?? "Agendado" : "Agendar"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default Agenda;
