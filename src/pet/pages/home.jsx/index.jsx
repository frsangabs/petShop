import { useRouter } from "expo-router";
import Agenda from "../../components/agenda";
import AppScreen from "../../components/appScreen";
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
    <AppScreen style={styles.container}>
      <Menu />
      <Agenda
        horarios={horarios}
        agendamentos={agendamentos}
        obterPet={obterPet}
        onSelecionarHorario={abrirAgendamento}
        onAbrirAgendamento={(id) => router.push(`/detalhe-agendamento/${id}`)}
        onAbrirHorarioOcupado={({ data }) =>
          router.push({ pathname: "/agendamentos", params: { busca: data } })
        }
      />
    </AppScreen>
  );
}

export default Home;
