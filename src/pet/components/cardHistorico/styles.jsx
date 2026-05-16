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
    alignItems: "flex-start",
    gap: 10,
  },

  topoEsquerda: {
    flex: 1,
    minWidth: 0,
  },

  linhaIndicador: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  etiqueta: {
    alignSelf: "flex-start",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: "hidden",
  },

  etiquetaAvulso: {
    backgroundColor: "#eceff1",
    color: "#546e7a",
  },

  etiquetaPacote: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
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
