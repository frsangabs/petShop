import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: "#555",
    fontWeight: "700",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    color: "#333",
    fontSize: 14,
    minHeight: 48,
    padding: 12,
  },

  inputErro: {
    borderColor: "#F44336",
  },

  legenda: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
    textTransform: "capitalize",
  },

  erro: {
    color: "#F44336",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  atalhos: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  atalho: {
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  atalhoTexto: {
    color: "#2f80ed",
    fontSize: 13,
    fontWeight: "800",
  },
});
