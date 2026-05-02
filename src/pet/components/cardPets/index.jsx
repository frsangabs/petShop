import { Image, Text, View } from "react-native";
import { styles } from "./styles";

function CardPet({ nome, raca, dono, foto }) {
  return (
    <View style={styles.card}>
      
      {/* FOTO (opcional) */}
      {foto ? (
        <Image source={{ uri: foto }} style={styles.foto} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.emoji}>🐾</Text>
        </View>
      )}

      {/* INFORMAÇÕES */}
      <View style={styles.info}>
        <Text style={styles.nome}>{nome}</Text>

        <Text style={styles.detalhes}>
          {raca}
        </Text>

        <Text style={styles.dono}>
          Dono: {dono}
        </Text>
      </View>
    </View>
  );
}

export default CardPet;