import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,

    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,

    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },

  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },

  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e8f5e9",

    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  emoji: {
    fontSize: 28,
  },

  info: {
    flex: 1,
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  detalhes: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  dono: {
    fontSize: 13,
    color: "#4CAF50",
    marginTop: 4,
    fontWeight: "bold",
  },
});