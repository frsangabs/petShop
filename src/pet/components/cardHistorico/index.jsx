import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardHistorico({ nomePet, servico, lamina, preco, data, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${nomePet}, ${servico}, R$ ${preco}, ${data}`}
    >
      <View style={styles.topo}>
        <Text style={styles.nome}>{nomePet}</Text>
        <Text style={styles.preco}>R$ {preco}</Text>
      </View>

      <Text style={styles.servico}>Servico: {servico}</Text>
      <Text style={styles.lamina}>Lamina: {lamina}</Text>
      <Text style={styles.data}>Data: {data}</Text>
    </TouchableOpacity>
  );
}

export default CardHistorico;
