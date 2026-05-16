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

  vazio: {
    color: "#777",
    textAlign: "center",
    marginTop: 30,
  },

  secaoCabecalho: {
    paddingTop: 16,
    paddingBottom: 8,
  },

  secaoTitulo: {
    color: "#2f5d3a",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  botaoSecundario: {
    flex: 1,
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

  textoSecundario: {
    color: "#2f80ed",
    fontSize: 15,
    fontWeight: "700",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
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
});
