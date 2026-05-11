import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardDono({ nome, telefone, pets, busca, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, busca && styles.cardBusca]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${nome}, telefone ${telefone}, ${busca ? "demora a buscar" : "busca rápido"}`}
    >
      <View style={styles.info}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.telefone}>{telefone}</Text>
        <Text style={styles.pets}>Pets: {pets.length ? pets.join(", ") : "-"}</Text>
        <Text style={[styles.status, busca && styles.statusBusca]}>
          {busca ? "Demora a buscar" : "Busca rapido"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default CardDono;
