import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardHistorico({
  nomePet,
  servico,
  lamina,
  preco,
  data,
  rotuloTipoServico,
  ehPacote,
  onPress,
}) {
  const mostrarTipoServico = Boolean(rotuloTipoServico);
  const labelA11y = [
    nomePet,
    servico,
    mostrarTipoServico ? rotuloTipoServico : null,
    `R$ ${preco}`,
    data,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={labelA11y}
    >
      <View style={styles.topo}>
        <View style={styles.topoEsquerda}>
          <Text style={styles.nome}>{nomePet}</Text>
          {mostrarTipoServico ? (
            <View style={styles.linhaIndicador}>
              <Text
                style={[styles.etiqueta, ehPacote ? styles.etiquetaPacote : styles.etiquetaAvulso]}
              >
                {rotuloTipoServico}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.preco}>R$ {preco}</Text>
      </View>

      <Text style={styles.servico}>Servico: {servico}</Text>
      <Text style={styles.lamina}>Lamina: {lamina}</Text>
      <Text style={styles.data}>Data: {data}</Text>
    </TouchableOpacity>
  );
}

export default CardHistorico;
