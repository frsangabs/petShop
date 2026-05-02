import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  lista: {
    padding: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },

  cardSelecionado: {
    backgroundColor: "#4CAF50",
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  icone: {
    fontSize: 20,
  },

  horario: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  status: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
  },

  statusAtivo: {
    color: "#fff",
  },

  barraDias: {
    maxHeight: 90,
    marginBottom: 10,
    paddingLeft: 10,
  },

  dia: {
    width: 65,
    height: 75,
    borderRadius: 18,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  diaAtivo: {
    backgroundColor: "#4CAF50",
  },

  textoDia: {
    color: "#333",
    fontWeight: "bold",
  },

  textoDiaAtivo: {
    color: "#fff",
  },

  semana: {
    fontSize: 12,
    color: "#555",
    textTransform: "capitalize",
  },

  numero: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  textoAtivo: {
    color: "#fff",
  },
});
