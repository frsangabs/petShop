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
    borderLeftColor: "#4CAF50",
  },

  // 🔥 destaque se tem busca
  cardBusca: {
    borderLeftColor: "#FF9800",
    backgroundColor: "#fffaf3",
  },

  info: {
    gap: 4,
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  telefone: {
    fontSize: 14,
    color: "#666",
  },

  pets: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  status: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  statusBusca: {
    color: "#FF9800",
  },
});