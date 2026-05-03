import { TextInput, View } from "react-native";
import { styles } from "./styles";

function SearchBar({ valor, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>
  );
}

export default SearchBar;
