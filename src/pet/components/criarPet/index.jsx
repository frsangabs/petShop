import { Picker } from "@react-native-picker/picker";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  donos,
  donoId,
  setDonoId,
  usarDonoExistente,
  setUsarDonoExistente,
  foto,
  onEscolherFoto,
  onRemoverFoto,
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
        placeholder="Raca"
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
            <Picker.Item label="Pequeno" value="Pequeno" color="#999" />
            <Picker.Item label="Medio" value="Medio" color="#999" />
            <Picker.Item label="Grande" value="Grande" color="#999" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.toggle, usarDonoExistente && styles.toggleAtivo]}
        onPress={() => setUsarDonoExistente((atual) => !atual)}
      >
        <Text style={[styles.toggleTexto, usarDonoExistente && styles.toggleTextoAtivo]}>
          {usarDonoExistente ? "Selecionar dono existente" : "Cadastrar novo dono"}
        </Text>
      </TouchableOpacity>

      {usarDonoExistente ? (
        <View style={styles.campo}>
          <Text style={styles.label}>Dono existente</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={donoId} onValueChange={(value) => setDonoId(value)}>
              <Picker.Item label="Selecione um dono" value="" color="#999" />
              {donos.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={`${item.nome} - ${item.telefone}`}
                  value={item.id}
                />
              ))}
            </Picker>
          </View>
        </View>
      ) : (
        <>
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
        </>
      )}

      <View style={styles.campo}>
        <Text style={styles.label}>Foto do pet (opcional)</Text>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.preview} />
        ) : (
          <View style={styles.semImagem}>
            <Text style={styles.semImagemTexto}>Nenhuma foto selecionada</Text>
          </View>
        )}

        <View style={styles.linhaBotoes}>
          <TouchableOpacity style={styles.botaoFoto} onPress={onEscolherFoto}>
            <Text style={styles.textoFoto}>
              {foto ? "Trocar foto" : "Escolher da galeria"}
            </Text>
          </TouchableOpacity>

          {foto ? (
            <TouchableOpacity style={styles.botaoRemover} onPress={onRemoverFoto}>
              <Text style={styles.textoRemover}>Remover</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.botao} onPress={onSalvar}>
        <Text style={styles.textoBotao}>Salvar Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CardCriarPet;
