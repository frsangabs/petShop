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
    borderLeftColor: "#F44336", // vermelho = pendente
  },

  cardPago: {
    borderLeftColor: "#4CAF50",
    backgroundColor: "#f1f8f5",
  },

  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  status: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F44336",
  },

  statusPago: {
    color: "#4CAF50",
  },

  raca: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  servico: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },

  data: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  porte: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "bold",
  },

  // 🔥 cores por porte
  portePequeno: {
    color: "#4CAF50",
  },

  porteMédio: {
    color: "#FF9800",
  },

  porteGrande: {
    color: "#F44336",
  },
});