import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function Agenda({ horarios }) {
  const hoje = new Date();

  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  // gera dias do mês corretamente
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

  return (
    <FlatList
      data={horarios}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.lista}

      // 🔥 HEADER (calendário)
      ListHeaderComponent={
        <FlatList
          data={dias}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.barraDias}
          keyExtractor={(item) => item.dia.toString()}
          renderItem={({ item }) => {
            const ativo =
              item.dataCompleta.toDateString() ===
              dataSelecionada.toDateString();

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

      // 🔥 HORÁRIOS
      renderItem={({ item }) => {
        const ativo = horarioSelecionado === item;

        return (
          <TouchableOpacity
            style={[styles.card, ativo && styles.cardSelecionado]}
            onPress={() => setHorarioSelecionado(item)}
          >
            <View style={styles.linha}>
              <Text style={styles.icone}>🐾</Text>

              <Text style={styles.horario}>{item}</Text>

              <Text style={[styles.status, ativo && styles.statusAtivo]}>
                {ativo ? "Selecionado" : "Disponível"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default Agenda;