import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  adicionarDiasDataBR,
  dataBRParaDate,
  formatarDataBR,
  formatarDataDigitada,
} from "../../utils/formatadores";
import { styles } from "./styles";

function DateInput({
  label,
  value,
  onChange,
  erro,
  placeholder = "dd/mm/aaaa",
  accessibilityLabel,
  mostrarAtalhos = true,
  style,
}) {
  function alterarTexto(texto) {
    onChange(formatarDataDigitada(texto));
  }

  function definirHoje() {
    onChange(formatarDataBR(new Date()));
  }

  function ajustarDia(dias) {
    onChange(adicionarDiasDataBR(value, dias));
  }

  const dataAtual = dataBRParaDate(value);
  const dataLegivel = dataAtual
    ? dataAtual.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "";

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={alterarTexto}
        style={[styles.input, erro && styles.inputErro]}
        placeholderTextColor="#777"
        accessibilityLabel={accessibilityLabel ?? label ?? "Data"}
        keyboardType="number-pad"
        maxLength={10}
      />
      {dataLegivel ? <Text style={styles.legenda}>{dataLegivel}</Text> : null}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {mostrarAtalhos ? (
        <View style={styles.atalhos}>
          <TouchableOpacity
            style={styles.atalho}
            onPress={definirHoje}
            accessibilityRole="button"
            accessibilityLabel="Usar a data de hoje"
          >
            <Text style={styles.atalhoTexto}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.atalho}
            onPress={() => ajustarDia(-1)}
            accessibilityRole="button"
            accessibilityLabel="Voltar um dia"
          >
            <Text style={styles.atalhoTexto}>-1 dia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.atalho}
            onPress={() => ajustarDia(1)}
            accessibilityRole="button"
            accessibilityLabel="Avancar um dia"
          >
            <Text style={styles.atalhoTexto}>+1 dia</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default DateInput;
