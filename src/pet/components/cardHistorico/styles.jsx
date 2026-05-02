import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,

    borderLeftWidth: 5,
    borderLeftColor: "#2196F3", // azul = histórico
  },

  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  servico: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },

  lamina: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  data: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});