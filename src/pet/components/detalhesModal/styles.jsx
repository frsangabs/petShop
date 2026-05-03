import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    maxHeight: "88%",
  },

  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  titulo: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },

  fechar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  editar: {
    backgroundColor: "#eef4ff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },

  editarTexto: {
    color: "#2f80ed",
    fontWeight: "700",
  },

  fecharTexto: {
    color: "#555",
    fontWeight: "700",
  },

  linha: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },

  label: {
    fontSize: 12,
    color: "#777",
    marginBottom: 2,
  },

  valor: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
  },

  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },

  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  extra: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 4,
  },

  extraTitulo: {
    color: "#333",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  extraTexto: {
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
  },

  botaoSalvar: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  botaoCancelar: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  textoCancelar: {
    color: "#555",
    fontSize: 15,
    fontWeight: "700",
  },

  acoes: {
    gap: 10,
    marginTop: 14,
  },
});
