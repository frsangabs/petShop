import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "../../components/appScreen";
import DetalhesAgendamento from "../../components/detalheAgendamento";
import Menu from "../../components/navbar";
import { usePetShop } from "../../context/PetShopContext";
import { styles } from "./styles";

function DetalhesPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    obterAgendamento,
    obterPet,
    alternarPagamento,
    cancelarAgendamento,
    concluirAgendamento,
  } = usePetShop();
  const agendamento = obterAgendamento(id);
  const pet = agendamento ? obterPet(agendamento.petId) : null;

  if (!agendamento || !pet) {
    return (
      <AppScreen style={styles.container}>
        <Menu />
        <View style={styles.card}>
          <Text style={styles.titulo}>Agendamento nao encontrado</Text>
          <TouchableOpacity style={styles.botao} onPress={() => router.replace("/agendamentos")}>
            <Text style={styles.textoBotao}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </AppScreen>
    );
  }

  function concluir() {
    if (!agendamento.pago) {
      Alert.alert(
        "Pagamento pendente",
        "Marque o pagamento como pago antes de concluir o atendimento."
      );
      return;
    }

    Alert.alert(
      "Concluir atendimento",
      "Deseja marcar este atendimento como concluído e mover para o histórico?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, concluir",
          onPress: () => {
            concluirAgendamento(agendamento.id);
            router.replace("/historico");
          },
        },
      ]
    );
  }

  function cancelar() {
    Alert.alert(
      "Cancelar agendamento",
      "Tem certeza que deseja cancelar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => {
            cancelarAgendamento(agendamento.id);
            router.replace("/agendamentos");
          },
        },
      ]
    );
  }

  return (
    <AppScreen style={styles.container}>
      <Menu />
      <DetalhesAgendamento
        nomePet={pet.nome}
        raca={`${pet.raca} - ${agendamento.data} ${agendamento.horario}`}
        porte={pet.porte}
        preco={agendamento.preco}
        lamina={agendamento.lamina}
        comportamento={agendamento.pago}
        pagoEm={agendamento.pagoEm}
        observacoes={agendamento.observacoes || "Sem observacoes."}
        imagemUri={agendamento.imagemUri}
      />

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => alternarPagamento(agendamento.id)}
        >
          <Text style={styles.textoSecundario}>
            {agendamento.pago ? "Marcar pendente" : "Marcar pago"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={concluir}>
          <Text style={styles.textoBotao}>Concluir atendimento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoPerigo} onPress={cancelar}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

export default DetalhesPage;
