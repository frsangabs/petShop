import { Text, View } from "react-native";
import { styles } from "./styles";

function CardDono({ nome, telefone, pets, busca }) {
  return (
    <View style={[styles.card, busca && styles.cardBusca]}>
      
      {/* INFORMAÇÕES */}
      <View style={styles.info}>
        <Text style={styles.nome}>{nome}</Text>

        <Text style={styles.telefone}>{telefone}</Text>

        <Text style={styles.pets}>
          Pets: {pets.join(", ")}
        </Text>

        <Text style={[styles.status, busca && styles.statusBusca]}>
          {busca ?  "Demora a buscar" : "Busca rápido"}
        </Text>
      </View>
    </View>
  );
}

export default CardDono;