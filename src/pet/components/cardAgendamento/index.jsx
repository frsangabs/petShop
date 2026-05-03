import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardAgendamento({
  nomePet,
  raca,
  servico,
  data,
  pago,
  porte,
  onPress,
  onTogglePago,
  onConcluir,
  onCancelar,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, pago && styles.cardPago]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.linhaTopo}>
        <Text style={styles.nome}>{nomePet}</Text>

        <Text style={[styles.status, pago && styles.statusPago]}>
          {pago ? "Pago" : "Pendente"}
        </Text>
      </View>

      <Text style={styles.raca}>{raca}</Text>

      <Text style={styles.servico}>Servico: {servico}</Text>

      <Text style={styles.data}>Data: {data}</Text>

      <Text style={[styles.porte, styles[`porte${porte}`]]}>Porte: {porte}</Text>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={(event) => {
            event.stopPropagation?.();
            onTogglePago?.();
          }}
        >
          <Text style={styles.textoSecundario}>{pago ? "Marcar pendente" : "Marcar pago"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoConcluir}
          onPress={(event) => {
            event.stopPropagation?.();
            onConcluir?.();
          }}
        >
          <Text style={styles.textoAcao}>Concluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={(event) => {
            event.stopPropagation?.();
            onCancelar?.();
          }}
        >
          <Text style={styles.textoAcao}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default CardAgendamento;
