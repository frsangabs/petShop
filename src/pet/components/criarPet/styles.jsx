import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },

  titulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 15,
  },

  cabecalhoAcoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  botaoFechar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoFecharTexto: {
    color: "#333",
    fontSize: 18,
    fontWeight: "800",
  },

  botaoSair: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "#fff1f0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  textoSair: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "800",
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

  botao: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  botaoDesabilitado: {
    opacity: 0.65,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  campo: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
    marginLeft: 5,
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

  preview: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    marginBottom: 10,
    backgroundColor: "#eee",
  },

  semImagem: {
    height: 90,
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

  botaoFoto: {
    flex: 1,
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  textoFoto: {
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
});
