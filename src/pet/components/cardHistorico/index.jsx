import { Text, View } from "react-native";
import { styles } from "./styles";

function CardHistorico({
  nomePet,
  servico,
  lamina,
  preco,
  data,
}) {
  return (
    <View style={styles.card}>
      
      <View style={styles.topo}>
        <Text style={styles.nome}>{nomePet}</Text>
        <Text style={styles.preco}>R$ {preco}</Text>
      </View>

      <Text style={styles.servico}>
        Serviço: {servico}
      </Text>

      <Text style={styles.lamina}>
        Lâmina: {lamina}
      </Text>

      <Text style={styles.data}>
        Data: {data}
      </Text>
    </View>
  );
}

export default CardHistorico;