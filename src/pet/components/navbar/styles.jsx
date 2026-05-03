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
    zIndex: 10,
  },

  grid: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },

  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  titulo: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
  },

  tituloAtivo: {
    color: "#2f80ed",
    fontWeight: "700",
  },
});
