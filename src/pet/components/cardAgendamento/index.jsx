import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardAgendamento({
  nomePet,
  raca,
  servico,
  data,
  pago,
  porte,
  rotuloTipoServico,
  ehPacote,
  onPress,
  onTogglePago,
  onConcluir,
  onCancelar,
}) {
  const mostrarTipoServico = Boolean(rotuloTipoServico);
  const labelA11y = [
    nomePet,
    servico,
    data,
    mostrarTipoServico ? rotuloTipoServico : null,
    `pagamento ${pago ? "pago" : "pendente"}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      style={[styles.card, pago && styles.cardPago]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={labelA11y}
    >
      <View style={styles.linhaTopo}>
        <Text style={styles.nome}>{nomePet}</Text>

        <Text style={[styles.status, pago && styles.statusPago]}>
          {pago ? "Pago" : "Pendente"}
        </Text>
      </View>

      {mostrarTipoServico ? (
        <View style={styles.linhaIndicador}>
          <Text
            style={[styles.etiqueta, ehPacote ? styles.etiquetaPacote : styles.etiquetaAvulso]}
          >
            {rotuloTipoServico}
          </Text>
        </View>
      ) : null}

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
          accessibilityRole="button"
          accessibilityLabel={pago ? "Marcar pagamento como pendente" : "Marcar pagamento como pago"}
        >
          <Text style={styles.textoSecundario}>{pago ? "Marcar pendente" : "Marcar pago"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoConcluir}
          onPress={(event) => {
            event.stopPropagation?.();
            onConcluir?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Concluir atendimento de ${nomePet}`}
        >
          <Text style={styles.textoAcao}>Concluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={(event) => {
            event.stopPropagation?.();
            onCancelar?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Cancelar agendamento de ${nomePet}`}
        >
          <Text style={styles.textoAcao}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default CardAgendamento;
