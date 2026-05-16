import { Alert } from "react-native";

export function confirmarDescarteEdicao(onConfirmar) {
  Alert.alert(
    "Descartar alterações?",
    "As alterações não salvas serão perdidas.",
    [
      { text: "Continuar editando", style: "cancel" },
      { text: "Descartar", style: "destructive", onPress: onConfirmar },
    ]
  );
}

export function confirmarSairSemSalvar(onConfirmar) {
  Alert.alert("Sair sem salvar?", "As informações preenchidas não serão salvas.", [
    { text: "Continuar editando", style: "cancel" },
    { text: "Sair", style: "destructive", onPress: onConfirmar },
  ]);
}
