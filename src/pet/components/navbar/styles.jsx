import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,

    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    elevation: 10,
    zIndex: 10, // 🔥 garante que fique na frente
  },

  grid: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },

  card: {
    alignItems: "center",
    justifyContent: "center",
  },

  icone: {
    fontSize: 22,
    marginBottom: 2,
  },

  titulo: {
    fontSize: 12,
    color: "#333",
  },
});