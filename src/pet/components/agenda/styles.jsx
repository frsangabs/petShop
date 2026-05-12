import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  lista: {
    padding: 15,
  },

  controleMes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  botaoMes: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  botaoMesTexto: {
    color: "#333",
    fontSize: 20,
    fontWeight: "900",
  },

  mesCentro: {
    flex: 1,
    alignItems: "center",
  },

  mesTitulo: {
    color: "#333",
    fontSize: 17,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  botaoHoje: {
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    paddingHorizontal: 14,
    marginTop: 6,
  },

  botaoHojeTexto: {
    color: "#2f80ed",
    fontSize: 12,
    fontWeight: "800",
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

  cardOcupado: {
    borderLeftColor: "#2196F3",
    backgroundColor: "#eef6ff",
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  etiqueta: {
    minWidth: 64,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    overflow: "hidden",
  },

  etiquetaLivre: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },

  etiquetaOcupado: {
    backgroundColor: "#eef4ff",
    color: "#2f80ed",
  },

  horario: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  status: {
    flex: 1,
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "right",
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
