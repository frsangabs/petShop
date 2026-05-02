import { FlatList, View } from "react-native";
import CardPet from "../../components/cardPets";
import Menu from "../../components/navbar";
import { styles } from "./styles";

function Pets() {

   const pets = [
    {
      id: "1",
      nome: "Rex",
      raca: "Golden Retriever",
      dono: "João",
      foto: "https://placedog.net/200/200?id=1",
    },
    {
      id: "2",
      nome: "Mia",
      raca: "Persa",
      dono: "Ana",
    },
    {
      id: "3",
      nome: "Thor",
      raca: "Pitbull",
      dono: "Carlos",
      foto: "https://placedog.net/200/200?id=2",
    },
    {
      id: "4",
      nome: "Luna",
      raca: "Shih Tzu",
      dono: "Marina",
    },
    {
      id: "5",
      nome: "Bob",
      raca: "Bulldog",
      dono: "Ricardo",
      foto: "https://placedog.net/200/200?id=3",
    },
  ];

   return (
    <View style={styles.container}>

      <Menu />

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPet
            nome={item.nome}
            raca={item.raca}
            dono={item.dono}
            foto={item.foto}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default Pets;