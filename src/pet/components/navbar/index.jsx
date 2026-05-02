import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function Menu() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Pets")}>
          <Text style={styles.icone}>🐶</Text>
          <Text style={styles.titulo}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Donos")}>
          <Text style={styles.icone}>👤</Text>
          <Text style={styles.titulo}>Donos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Agendamentos")}>
          <Text style={styles.icone}>📅</Text>
          <Text style={styles.titulo}>Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Historico")}>
          <Text style={styles.icone}>📜</Text>
          <Text style={styles.titulo}>Histórico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Menu;
