import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AppScreen({ children, style, avoidKeyboard = false }) {
  const conteudo = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    children
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[{ flex: 1 }, style]}>
      {conteudo}
    </SafeAreaView>
  );
}

export default AppScreen;
