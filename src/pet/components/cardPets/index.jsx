import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardPet({ nome, raca, dono, foto, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${nome}, ${raca}, dono ${dono}`}
    >
      {foto ? (
        <Image source={{ uri: foto }} style={styles.foto} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.emoji}>+</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.detalhes}>{raca}</Text>
        <Text style={styles.dono}>Dono: {dono}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default CardPet;
