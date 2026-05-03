import { Picker } from "@react-native-picker/picker";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

function DetalhesModal({
  visivel,
  titulo,
  linhas,
  onFechar,
  acoes,
  editando,
  campos = [],
  onEditar,
  onSalvar,
  onCancelarEdicao,
  extra,
  editExtra,
}) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.topo}>
            <Text style={styles.titulo}>{titulo}</Text>
            {onEditar && !editando ? (
              <TouchableOpacity style={styles.editar} onPress={onEditar}>
                <Text style={styles.editarTexto}>Editar</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.fechar} onPress={onFechar}>
              <Text style={styles.fecharTexto}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {editando
              ? campos.map((campo) => (
                  <View key={campo.label} style={styles.linha}>
                  <Text style={styles.label}>{campo.label}</Text>
                  {campo.tipo === "select" ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={campo.valor}
                        onValueChange={campo.onChangeText}
                      >
                        {campo.opcoes.map((opcao) => (
                          <Picker.Item
                            key={opcao.value}
                            label={opcao.label}
                            value={opcao.value}
                          />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <TextInput
                      value={campo.valor}
                      onChangeText={campo.onChangeText}
                      style={[styles.input, campo.multiline && styles.textarea]}
                      multiline={campo.multiline}
                      keyboardType={campo.keyboardType}
                      placeholder={campo.placeholder ?? campo.label}
                      placeholderTextColor="#999"
                    />
                  )}
                </View>
              ))
              : linhas.map((linha) => (
                  <View key={linha.label} style={styles.linha}>
                    <Text style={styles.label}>{linha.label}</Text>
                    <Text style={styles.valor}>{linha.valor || "-"}</Text>
                  </View>
                ))}

            {!editando && extra ? <View style={styles.extra}>{extra}</View> : null}
            {editando && editExtra ? <View style={styles.extra}>{editExtra}</View> : null}

            {editando ? (
              <View style={styles.acoes}>
                <TouchableOpacity style={styles.botaoSalvar} onPress={onSalvar}>
                  <Text style={styles.textoBotao}>Salvar alteracoes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoCancelar} onPress={onCancelarEdicao}>
                  <Text style={styles.textoCancelar}>Cancelar edicao</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {!editando && acoes ? <View style={styles.acoes}>{acoes}</View> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default DetalhesModal;
