import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function Menu() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        
        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.icone}>🐶</Text>
          <Text style={styles.titulo}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.icone}>👤</Text>
          <Text style={styles.titulo}>Donos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.icone}>📅</Text>
          <Text style={styles.titulo}>Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.icone}>📜</Text>
          <Text style={styles.titulo}>Histórico</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

export default Menu;