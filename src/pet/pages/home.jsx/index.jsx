import { useRouter } from "expo-router";
import { View } from "react-native";
import Agenda from "../../components/agenda";
import Menu from "../../components/navbar";
import { usePetShop } from "../../context/PetShopContext";
import { gerarHorarios } from "../../utils/gerarHorarios";
import { styles } from "./styles";

function Home() {
  const router = useRouter();
  const { agendamentos, obterPet } = usePetShop();
  const horarios = gerarHorarios(9, 18, 30);

  function abrirAgendamento({ data, horario }) {
    router.push({
      pathname: "/novo-agendamento",
      params: { data, horario },
    });
  }

  return (
    <View style={styles.container}>
      <Menu />
      <Agenda
        horarios={horarios}
        agendamentos={agendamentos}
        obterPet={obterPet}
        onSelecionarHorario={abrirAgendamento}
        onAbrirAgendamento={(id) => router.push(`/detalhe-agendamento/${id}`)}
        onAbrirHorarioOcupado={() => router.push("/agendamentos")}
      />
    </View>
  );
}

export default Home;
