import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#F44336",
  },

  cardPago: {
    borderLeftColor: "#4CAF50",
    backgroundColor: "#f1f8f5",
  },

  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  nome: {
    flex: 1,
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

  portePequeno: {
    color: "#4CAF50",
  },

  porteMedio: {
    color: "#FF9800",
  },

  porteGrande: {
    color: "#F44336",
  },

  acoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  botaoSecundario: {
    backgroundColor: "#eef4ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
  },

  botaoConcluir: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
  },

  botaoCancelar: {
    backgroundColor: "#F44336",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
  },

  textoSecundario: {
    color: "#2f80ed",
    fontSize: 12,
    fontWeight: "700",
  },

  textoAcao: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
