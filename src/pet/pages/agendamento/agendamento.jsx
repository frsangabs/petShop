import { FlatList, View } from "react-native";
import CardAgendamento from "../../components/cardAgendamento";
import Menu from "../../components/navbar";
import { styles } from "./styles";

function Agendamentos() {
  const agendamentos = [
    {
      id: "1",
      nomePet: "Rex",
      raca: "Golden Retriever",
      servico: "Banho e Tosa",
      data: "12/04 - 10:00",
      pago: true,
      porte: "Grande",
    },
    {
      id: "2",
      nomePet: "Mia",
      raca: "Persa",
      servico: "Banho",
      data: "13/04 - 14:30",
      pago: false,
      porte: "Pequeno",
    },
    {
      id: "3",
      nomePet: "Thor",
      raca: "Pitbull",
      servico: "Tosa higiênica",
      data: "14/04 - 09:00",
      pago: true,
      porte: "Grande",
    },
    {
      id: "4",
      nomePet: "Luna",
      raca: "Shih Tzu",
      servico: "Banho",
      data: "15/04 - 11:30",
      pago: false,
      porte: "Pequeno",
    },
    {
      id: "5",
      nomePet: "Bob",
      raca: "Bulldog",
      servico: "Banho e Tosa",
      data: "16/04 - 16:00",
      pago: true,
      porte: "Médio",
    },
  ];

  return (
    <View style={styles.container}>
        <Menu />
        <FlatList
            data={agendamentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <CardAgendamento
                nomePet={item.nomePet}
                raca={item.raca}
                servico={item.servico}
                data={item.data}
                pago={item.pago}
                porte={item.porte}
            />
            )}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
        />
    </View>
  );
}

export default Agendamentos;