import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
    paddingTop: 20,
  },

  lista: {
    padding: 15,
    paddingBottom: 100,
  },

  botaoPrimario: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  vazio: {
    color: "#777",
    textAlign: "center",
    marginTop: 30,
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
    marginBottom: 6,
  },

  banhosGrid: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  banhosColuna: {
    flex: 1,
    backgroundColor: "#f7f9fa",
    borderRadius: 10,
    padding: 10,
  },

  banhoItem: {
    borderTopWidth: 1,
    borderTopColor: "#e7ecef",
    paddingTop: 8,
    marginTop: 8,
  },

  banhoTopo: {
    gap: 6,
  },

  banhoServico: {
    color: "#333",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  etiquetaBanho: {
    alignSelf: "flex-start",
    backgroundColor: "#eef4ff",
    borderRadius: 8,
    color: "#2f80ed",
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: "hidden",
  },

  etiquetaPacote: {
    backgroundColor: "#e8f5e9",
    color: "#4CAF50",
  },

  fotoModal: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#eee",
    alignSelf: "center",
    marginBottom: 14,
  },

  linhaBotoes: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  botaoSecundario: {
    flex: 1,
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  textoSecundario: {
    color: "#2f80ed",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoPerigo: {
    backgroundColor: "#F44336",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

});
