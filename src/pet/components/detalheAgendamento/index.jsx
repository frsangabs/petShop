import { Image, Text, View } from "react-native";
import { styles } from "./styles";

function DetalhesAgendamento({
  nomePet,
  raca,
  porte,
  preco,
  lamina,
  comportamento,
  observacoes,
  imagemUri,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Relatorio do Atendimento</Text>

      <Text style={styles.nome}>{nomePet}</Text>
      <Text style={styles.info}>{raca}</Text>

      <Text style={[styles.porte, styles[`porte${porte}`]]}>Porte: {porte}</Text>

      <View style={styles.linha}>
        <Text style={styles.label}>Preco:</Text>
        <Text style={styles.valor}>R$ {preco}</Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.label}>Lamina:</Text>
        <Text style={styles.valor}>{lamina}</Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.label}>Pagamento:</Text>
        <Text
          style={[
            styles.valor,
            comportamento ? styles.bonzinho : styles.naoBonzinho,
          ]}
        >
          {comportamento ? "Pago" : "Pendente"}
        </Text>
      </View>

      <View style={styles.observacoesBox}>
        <Text style={styles.label}>Observacoes:</Text>
        <Text style={styles.observacoes}>{observacoes}</Text>
      </View>

      {imagemUri ? (
        <View style={styles.observacoesBox}>
          <Text style={styles.label}>Imagem:</Text>
          <Image source={{ uri: imagemUri }} style={styles.imagem} />
        </View>
      ) : null}
    </View>
  );
}

export default DetalhesAgendamento;
