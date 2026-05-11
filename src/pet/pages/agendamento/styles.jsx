import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
    paddingTop: 20,
  },

  lista: {
    padding: 15,
    paddingBottom: 130,
  },

  botaoPrimario: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: "700",
  },

  textoSecundario: {
    color: "#2f80ed",
    fontSize: 16,
    fontWeight: "700",
  },

  modalTitulo: {
    color: "#333",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  modalTexto: {
    color: "#555",
    fontSize: 14,
    marginBottom: 8,
  },

  imagemModal: {
    width: 240,
    height: 240,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 10,
    alignSelf: "center",
  },

  imagemEditor: {
    alignItems: "center",
  },

  linhaBotoes: {
    flexDirection: "row",
    gap: 8,
  },

  linhaBotoesImagem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  vazio: {
    color: "#777",
    textAlign: "center",
  },

  estadoVazio: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  vazioTitulo: {
    color: "#333",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  vazioTexto: {
    color: "#777",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 14,
  },

  botaoVazio: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
  },

  tituloDia: {
    color: "#333",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 8,
  },
});
