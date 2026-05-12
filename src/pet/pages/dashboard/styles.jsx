import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
  },

  conteudo: {
    padding: 15,
    paddingBottom: 140,
  },

  titulo: {
    color: "#333",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
  },

  filtros: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },

  filtroData: {
    flex: 1,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    fontSize: 14,
  },

  erroFiltro: {
    color: "#F44336",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  atalhosFiltro: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  atalhoFiltro: {
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: "#eef4ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  atalhoFiltroTexto: {
    color: "#2f80ed",
    fontSize: 13,
    fontWeight: "800",
  },

  resumoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  resumoCard: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },

  resumoValor: {
    color: "#333",
    fontSize: 17,
    fontWeight: "800",
  },

  resumoLabel: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#e9eef0",
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },

  tabAtiva: {
    backgroundColor: "#fff",
  },

  tabTexto: {
    color: "#667",
    fontSize: 13,
    fontWeight: "700",
  },

  tabTextoAtivo: {
    color: "#2f80ed",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  cardTitulo: {
    color: "#333",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },

  barraLinha: {
    marginBottom: 10,
  },

  barraTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 4,
  },

  barraLabel: {
    flex: 1,
    color: "#444",
    fontSize: 13,
    fontWeight: "700",
  },

  barraValor: {
    color: "#2f80ed",
    fontSize: 13,
    fontWeight: "800",
  },

  barraTrilho: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#eef4ff",
    overflow: "hidden",
  },

  barraPreenchida: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#2f80ed",
  },

  petLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 12,
    gap: 10,
  },

  petLinhaConteudo: {
    flex: 1,
  },

  petNome: {
    color: "#333",
    fontSize: 15,
    fontWeight: "800",
  },

  petResumo: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  petTotal: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "800",
  },

  progressoTrilho: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#eaf1ec",
    marginTop: 8,
    overflow: "hidden",
  },

  progressoPreenchido: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },

  dica: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  vazio: {
    color: "#777",
    fontSize: 14,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    maxHeight: "82%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },

  modalTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  modalTitulo: {
    flex: 1,
    color: "#333",
    fontSize: 18,
    fontWeight: "800",
  },

  fechar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  fecharTexto: {
    color: "#555",
    fontWeight: "800",
  },

  modalResumo: {
    color: "#333",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },

  modalLinha: {
    color: "#555",
    fontSize: 13,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 9,
  },

  modalSubtitulo: {
    color: "#333",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },

  botaoBonus: {
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },

  botaoBonusTexto: {
    color: "#2f80ed",
    fontSize: 14,
    fontWeight: "800",
  },

  banhoLinha: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },

  banhoTitulo: {
    color: "#333",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 3,
  },

  banhoTexto: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
});
