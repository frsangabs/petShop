import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
    paddingTop: 20,
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 15,
    padding: 20,
  },

  titulo: {
    color: "#333",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  acoes: {
    paddingHorizontal: 15,
    gap: 10,
  },

  botao: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  botaoSecundario: {
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  botaoPerigo: {
    backgroundColor: "#F44336",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  textoSecundario: {
    color: "#2f80ed",
    fontSize: 15,
    fontWeight: "700",
  },
});
