import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#f4f7f5",
  },

  conteudo: {
    padding: 15,
    paddingBottom: 140,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },

  campo: {
    marginBottom: 10,
  },

  ajuda: {
    color: "#777",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },

  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },

  picker: {
    color: "#333",
    minHeight: 48,
  },

  valorFixo: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
    padding: 14,
  },

  sugestoes: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 10,
    marginTop: -4,
    marginBottom: 10,
    overflow: "hidden",
  },

  sugestaoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  sugestaoTitulo: {
    color: "#333",
    fontSize: 14,
    fontWeight: "800",
  },

  sugestaoTexto: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  campoNovoPet: {
    backgroundColor: "#f8faf9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    minHeight: 48,
  },

  erroCampo: {
    color: "#F44336",
    fontSize: 12,
    fontWeight: "700",
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },

  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  toggle: {
    backgroundColor: "#fff4e5",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  toggleAtivo: {
    backgroundColor: "#e8f5e9",
  },

  toggleTexto: {
    color: "#d97800",
    fontWeight: "700",
  },

  toggleTextoAtivo: {
    color: "#4CAF50",
  },

  imagemBox: {
    marginBottom: 10,
  },

  preview: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    alignSelf: "center",
  },

  semImagem: {
    height: 110,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  semImagemTexto: {
    color: "#777",
    fontWeight: "600",
  },

  linhaBotoes: {
    flexDirection: "row",
    gap: 8,
  },

  botaoImagem: {
    flex: 1,
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  textoImagem: {
    color: "#2f80ed",
    fontWeight: "700",
  },

  botaoRemover: {
    backgroundColor: "#fff1f0",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  textoRemover: {
    color: "#F44336",
    fontWeight: "700",
  },

  botao: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },

  botaoDesabilitado: {
    opacity: 0.65,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
