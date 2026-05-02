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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    
  },

  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },

  botao: {
  backgroundColor: "#4CAF50",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 10,
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
},
});