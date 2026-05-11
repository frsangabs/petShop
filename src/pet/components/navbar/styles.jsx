import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 10,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  grid: {
    flexDirection: "row",
    width: "100%",
    height: 66,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  card: {
    flex: 1,
    minHeight: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  cardAtivo: {
    backgroundColor: "#eef4ff",
  },

  cardPressionado: {
    opacity: 0.72,
  },

  titulo: {
    fontSize: 11,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },

  tituloAtivo: {
    color: "#2f80ed",
    fontWeight: "800",
  },

  status: {
    position: "absolute",
    left: 12,
    right: 12,
    top: -36,
    minHeight: 28,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
  },

  statusNeutro: {
    backgroundColor: "#eef4ff",
    borderColor: "#dbe8ff",
  },

  statusOffline: {
    backgroundColor: "#fff4e5",
    borderColor: "#ffe0ad",
  },

  statusTexto: {
    fontSize: 12,
    fontWeight: "800",
  },

  statusTextoNeutro: {
    color: "#2f80ed",
  },

  statusTextoOffline: {
    color: "#d97800",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  maisCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    gap: 8,
  },

  maisCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  maisTitulo: {
    color: "#333",
    fontSize: 18,
    fontWeight: "800",
  },

  fecharMais: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  fecharMaisTexto: {
    color: "#555",
    fontWeight: "800",
  },

  maisItem: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  maisItemAtivo: {
    backgroundColor: "#eef4ff",
  },

  maisTexto: {
    color: "#333",
    fontSize: 15,
    fontWeight: "700",
  },
});
