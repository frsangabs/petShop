import { Picker } from "@react-native-picker/picker";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateInput from "../dateInput";
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
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View
          style={styles.card}
          accessibilityLabel={titulo}
        >
          <View style={styles.topo}>
            <Text style={styles.titulo}>{titulo}</Text>
            {onEditar && !editando ? (
              <TouchableOpacity
                style={styles.editar}
                onPress={onEditar}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${titulo}`}
              >
                <Text style={styles.editarTexto}>Editar</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.fechar}
              onPress={onFechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar detalhes"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.fecharTexto}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {editando
              ? campos.map((campo) => (
                  <View key={campo.label} style={styles.linha}>
                  <Text style={styles.label}>{campo.label}</Text>
                  {campo.tipo === "date" ? (
                    <DateInput
                      value={campo.valor}
                      onChange={campo.onChangeText}
                      erro={campo.erro}
                      accessibilityLabel={campo.accessibilityLabel ?? campo.label}
                    />
                  ) : campo.tipo === "select" ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={campo.valor}
                        onValueChange={campo.onChangeText}
                        style={styles.picker}
                        dropdownIconColor="#333"
                      >
                        {campo.opcoes.map((opcao) => (
                          <Picker.Item
                            key={opcao.value}
                            label={opcao.label}
                            value={opcao.value}
                            color={opcao.color ?? "#333"}
                          />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <TextInput
                      value={campo.valor}
                      onChangeText={campo.onChangeText}
                      onBlur={campo.onBlur}
                      style={[
                        styles.input,
                        campo.erro && styles.inputErro,
                        campo.multiline && styles.textarea,
                      ]}
                      multiline={campo.multiline}
                      keyboardType={campo.keyboardType}
                      placeholder={campo.placeholder ?? campo.label}
                      placeholderTextColor="#999"
                    />
                  )}
                  {campo.erro && campo.tipo !== "date" ? (
                    <Text style={styles.erroCampo}>{campo.erro}</Text>
                  ) : null}
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
                <TouchableOpacity
                  style={styles.botaoSalvar}
                  onPress={onSalvar}
                  accessibilityRole="button"
                  accessibilityLabel="Salvar alterações"
                >
                  <Text style={styles.textoBotao}>Salvar alteracoes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={onCancelarEdicao}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar edição"
                >
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
