import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { styles } from "./styles";

function SearchBar({ valor, onChangeText, placeholder }) {
  const temBusca = Boolean(valor);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#777" style={styles.icone} />
      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        accessibilityLabel={placeholder}
        returnKeyType="search"
      />
      {temBusca ? (
        <Pressable
          style={styles.limpar}
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color="#555" />
        </Pressable>
      ) : null}
    </View>
  );
}

export default SearchBar;
