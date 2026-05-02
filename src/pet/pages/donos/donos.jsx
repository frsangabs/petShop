import { FlatList, View } from "react-native";
import CardDono from "../../components/cardDonos";
import Menu from "../../components/navbar";
import { styles } from "./styles";

function Donos() {
  const donos = [
    {
      id: "1",
      nome: "João Silva",
      telefone: "(11) 99999-9999",
      pets: ["Rex", "Mia"],
      busca: true,
    },
    {
      id: "2",
      nome: "Ana Souza",
      telefone: "(11) 98888-8888",
      pets: ["Luna"],
      busca: false,
    },
    {
      id: "3",
      nome: "Carlos Pereira",
      telefone: "(11) 97777-7777",
      pets: ["Thor", "Bob"],
      busca: true,
    },
    {
      id: "4",
      nome: "Marina Costa",
      telefone: "(11) 96666-6666",
      pets: ["Mel"],
      busca: false,
    },
    {
      id: "5",
      nome: "Ricardo Alves",
      telefone: "(11) 95555-5555",
      pets: ["Spike", "Nina"],
      busca: true,
    },
  ];

  return (
    <View style={styles.container}>

        <Menu />
        <FlatList
            data={donos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <CardDono
                nome={item.nome}
                telefone={item.telefone}
                pets={item.pets}
                busca={item.busca}
            />
            )}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
        />
    </View>
  );
}

export default Donos;