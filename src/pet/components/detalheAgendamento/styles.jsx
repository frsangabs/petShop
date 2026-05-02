import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 15,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,

    borderLeftWidth: 5,
    borderLeftColor: "#2196F3",
  },

  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    color: "#777",
  },

  valor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  porte: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "bold",
  },

  portePequeno: {
    color: "#4CAF50",
  },

  porteMédio: {
    color: "#FF9800",
  },

  porteGrande: {
    color: "#F44336",
  },

  bonzinho: {
    color: "#4CAF50",
  },

  naoBonzinho: {
    color: "#F44336",
  },

  observacoesBox: {
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
  },

  observacoes: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
  },
});