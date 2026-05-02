import { View } from "react-native";
import DetalhesAgendamento from "../../components/detalheAgendamento";

function DetalhesPage() {
  const dados = {
    nomePet: "Rex",
    raca: "Golden Retriever",
    porte: "Grande",
    preco: "80,00",
    lamina: "3",
    comportamento: true,
    observacoes:
      "Pet muito tranquilo, aceitou bem o banho e a tosa. Não apresentou resistência.",
  };

  return (
    <View>
      <DetalhesAgendamento
        nomePet={dados.nomePet}
        raca={dados.raca}
        porte={dados.porte}
        preco={dados.preco}
        lamina={dados.lamina}
        comportamento={dados.comportamento}
        observacoes={dados.observacoes}
      />
    </View>
  );
}

export default DetalhesPage;