import { Text, View } from "react-native";
import { styles } from "./styles";

function CardAgendamento({
  nomePet,
  raca,
  servico,
  data,
  pago,
  porte,
}) {
  return (
    <View style={[styles.card, pago && styles.cardPago]}>
      
      <View style={styles.linhaTopo}>
        <Text style={styles.nome}>{nomePet}</Text>

        <Text style={[styles.status, pago && styles.statusPago]}>
          {pago ? "Pago" : "Pendente"}
        </Text>
      </View>

      <Text style={styles.raca}>{raca}</Text>

      <Text style={styles.servico}>
        Serviço: {servico}
      </Text>

      <Text style={styles.data}>
        Data: {data}
      </Text>

      <Text style={[styles.porte, styles[`porte${porte}`]]}>
        Porte: {porte}
      </Text>
    </View>
  );
}

export default CardAgendamento;