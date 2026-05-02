import { Text, View } from "react-native";
import { styles } from "./styles";

function DetalhesAgendamento({
  nomePet,
  raca,
  porte,
  preco,
  lamina,
  comportamento,
  observacoes,
}) {
  return (
    <View style={styles.card}>
      
      <Text style={styles.titulo}>Relatório do Atendimento</Text>

      <Text style={styles.nome}>{nomePet}</Text>
      <Text style={styles.info}>{raca}</Text>

      <Text style={[styles.porte, styles[`porte${porte}`]]}>
        Porte: {porte}
      </Text>

      <View style={styles.linha}>
        <Text style={styles.label}>Preço:</Text>
        <Text style={styles.valor}>R$ {preco}</Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.label}>Lâmina:</Text>
        <Text style={styles.valor}>{lamina}</Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.label}>Comportamento:</Text>
        <Text
          style={[
            styles.valor,
            comportamento ? styles.bonzinho : styles.naoBonzinho,
          ]}
        >
          {comportamento ? "Bonzinho 🐶" : "Deu trabalho 😅"}
        </Text>
      </View>

      <View style={styles.observacoesBox}>
        <Text style={styles.label}>Observações:</Text>
        <Text style={styles.observacoes}>{observacoes}</Text>
      </View>
    </View>
  );
}

export default DetalhesAgendamento;