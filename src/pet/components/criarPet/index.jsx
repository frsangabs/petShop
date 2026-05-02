import { Picker } from "@react-native-picker/picker";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function CardCriarPet({
  nome,
  setNome,
  raca,
  setRaca,
  porte,
  setPorte,
  dono,
  setDono,
  telefone,
  setTelefone,
  onSalvar,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Novo Pet</Text>

      <TextInput
        placeholder="Nome do pet"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Raça"
        value={raca}
        onChangeText={setRaca}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <View style={styles.campo}>
        <Text style={styles.label}>Porte</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={porte}
            onValueChange={(itemValue) => setPorte(itemValue)}
          >
            <Picker.Item label="Selecione o porte" value="" color="#999" />
            <Picker.Item label="Pequeno" value="Pequeno"  color="#999"/>
            <Picker.Item label="Médio" value="Médio" color="#999"/>
            <Picker.Item label="Grande" value="Grande" color="#999"/>
          </Picker>
        </View>
      </View>

      <TextInput
        placeholder="Nome do dono"
        value={dono}
        onChangeText={setDono}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
        placeholderTextColor="#999"
      />

      {/* 🔥 BOTÃO */}
      <TouchableOpacity style={styles.botao} onPress={onSalvar}>
        <Text style={styles.textoBotao}>Salvar Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CardCriarPet;