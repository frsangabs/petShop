import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 12,
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 42,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    minHeight: 48,
  },

  icone: {
    position: "absolute",
    left: 13,
    zIndex: 1,
  },

  limpar: {
    position: "absolute",
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
});
