import { FlatList, View } from "react-native";
import CardHistorico from "../../components/cardHistorico";
import Menu from "../../components/navbar";
import { styles } from "./styles";

function Historico() {
  const historico = [
    {
      id: "1",
      nomePet: "Rex",
      servico: "Banho e Tosa",
      lamina: "3",
      preco: "80,00",
      data: "10/04",
    },
    {
      id: "2",
      nomePet: "Mia",
      servico: "Tosa higiênica",
      lamina: "7",
      preco: "50,00",
      data: "08/04",
    },
    {
      id: "3",
      nomePet: "Thor",
      servico: "Banho",
      lamina: "-",
      preco: "40,00",
      data: "07/04",
    },
    {
      id: "4",
      nomePet: "Luna",
      servico: "Banho e Tosa",
      lamina: "5",
      preco: "70,00",
      data: "05/04",
    },
    {
      id: "5",
      nomePet: "Bob",
      servico: "Tosa higiênica",
      lamina: "10",
      preco: "60,00",
      data: "03/04",
    },
  ];

  return (
    <View style={styles.container}>
        <Menu />
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardHistorico
            nomePet={item.nomePet}
            servico={item.servico}
            lamina={item.lamina}
            preco={item.preco}
            data={item.data}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default Historico;