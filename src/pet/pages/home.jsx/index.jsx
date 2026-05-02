import { View } from "react-native";
import Agenda from "../../components/agenda";
import Menu from "../../components/navbar";
import { gerarHorarios } from "../../utils/gerarHorarios";

function Home() {
  const horarios = gerarHorarios(9, 18, 30);

  return (
    <View style={{ flex: 1, paddingBottom: 90 }}>
      <Menu />
      <Agenda horarios={horarios} />
    </View>
  );
}

export default Home;