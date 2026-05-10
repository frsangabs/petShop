import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import CardAgendamento from "../../components/cardAgendamento";
import DetalhesModal from "../../components/detalhesModal";
import Menu from "../../components/navbar";
import SearchBar from "../../components/searchBar";
import { usePetShop } from "../../context/PetShopContext";
import {
  dataHoraParaTempo,
  formatarHorario,
  formatarPreco,
} from "../../utils/formatadores";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { opcoesServicos } from "../../utils/servicos";
import { styles } from "./styles";

function Agendamentos() {
  const router = useRouter();
  const {
    agendamentos,
    pets,
    donos,
    obterPet,
    alternarPagamento,
    cancelarAgendamento,
    concluirAgendamento,
    atualizarAgendamento,
    obterDono,
  } = usePetShop();
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    servico: "",
    data: "",
    horario: "",
    preco: "",
    lamina: "",
    observacoes: "",
    imagemUri: "",
  });
  const [busca, setBusca] = useState("");

  const agendamentoSelecionado = useMemo(
    () => agendamentos.find((ag) => ag.id === idSelecionado) ?? null,
    [agendamentos, idSelecionado]
  );

  const agendamentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return agendamentos
      .filter((agendamento) => {
        if (!termo) return true;
        const pet = pets.find((p) => p.id === agendamento.petId);
        const dono = pet ? donos.find((d) => d.id === pet.donoId) : null;
        return [
          pet?.nome, pet?.raca, dono?.nome, dono?.telefone,
          agendamento.servico, agendamento.data, agendamento.horario,
        ].some((valor) => String(valor ?? "").toLowerCase().includes(termo));
      })
      .sort((a, b) => dataHoraParaTempo(a) - dataHoraParaTempo(b));
  }, [agendamentos, busca, pets, donos]);

  const listaAgrupada = useMemo(
    () =>
      agendamentosFiltrados.flatMap((agendamento, index) => {
        const anterior = agendamentosFiltrados[index - 1];
        const itens = [];

        if (!anterior || anterior.data !== agendamento.data) {
          itens.push({ tipo: "dia", id: `dia-${agendamento.data}`, data: agendamento.data });
        }

        itens.push({ tipo: "agendamento", ...agendamento });
        return itens;
      }),
    [agendamentosFiltrados]
  );

  function abrirAgendamento(agendamento) {
    setIdSelecionado(agendamento.id);
    setEditando(false);
    setForm({
      servico: agendamento.servico,
      data: agendamento.data,
      horario: agendamento.horario,
      preco: agendamento.preco,
      lamina: agendamento.lamina,
      observacoes: agendamento.observacoes,
      imagemUri: agendamento.imagemUri ?? "",
    });
  }

  async function escolherImagem() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setForm((atual) => ({ ...atual, imagemUri: uri }));
    }
  }

  function cancelar(id) {
    Alert.alert(
      "Cancelar agendamento",
      "Tem certeza que deseja cancelar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => {
            cancelarAgendamento(id);
            setIdSelecionado(null);
            setEditando(false);
          },
        },
      ]
    );
  }

  function concluir(id) {
    const agendamento = agendamentos.find((item) => item.id === id);

    if (!agendamento?.pago) {
      Alert.alert(
        "Pagamento pendente",
        "Marque o pagamento como pago antes de concluir o atendimento."
      );
      return;
    }

    Alert.alert(
      "Concluir atendimento",
      "Deseja marcar este atendimento como concluído?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, concluir",
          onPress: () => {
            concluirAgendamento(id);
            setIdSelecionado(null);
            setEditando(false);
          },
        },
      ]
    );
  }

  function fecharModal() {
    setIdSelecionado(null);
    setEditando(false);
  }

  function salvarAgendamento() {
    if (!agendamentoSelecionado) {
      return;
    }

    const dados = {
      servico: form.servico.trim(),
      data: form.data.trim(),
      horario: formatarHorario(form.horario),
      preco: formatarPreco(form.preco) || "0,00",
      lamina: form.lamina.trim() || "-",
      observacoes: form.observacoes.trim() || "Sem observacoes.",
      imagemUri: form.imagemUri,
    };

    atualizarAgendamento(agendamentoSelecionado.id, dados);
    setEditando(false);
  }

  const petSelecionado = agendamentoSelecionado
    ? obterPet(agendamentoSelecionado.petId)
    : null;

  return (
    <View style={styles.container}>
      <Menu />

      <FlatList
        data={listaAgrupada}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.botaoPrimario}
              onPress={() => router.push("/novo-agendamento")}
            >
              <Text style={styles.textoBotao}>Novo agendamento</Text>
            </TouchableOpacity>
            <SearchBar
              valor={busca}
              onChangeText={setBusca}
              placeholder="Buscar por pet, dono, telefone ou servico"
            />
          </>
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum agendamento em aberto.</Text>
        }
        renderItem={({ item }) => {
          if (item.tipo === "dia") {
            return <Text style={styles.tituloDia}>{item.data}</Text>;
          }

          const pet = obterPet(item.petId);

          return (
            <CardAgendamento
              nomePet={pet?.nome ?? "Pet removido"}
              raca={pet?.raca ?? "-"}
              servico={item.servico}
              data={`${item.data} - ${item.horario}`}
              pago={item.pago}
              porte={pet?.porte ?? "Pequeno"}

              onPress={() => abrirAgendamento(item)}
              onTogglePago={() => alternarPagamento(item.id)}
              onConcluir={() => concluir(item.id)}
              onCancelar={() => cancelar(item.id)}
            />
          );
        }}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />

      <DetalhesModal
        visivel={Boolean(agendamentoSelecionado)}
        titulo={petSelecionado?.nome ?? "Agendamento"}
        onFechar={fecharModal}
        linhas={[
          { label: "Pet", valor: petSelecionado?.nome },
          { label: "Raca", valor: petSelecionado?.raca },
          { label: "Porte", valor: petSelecionado?.porte },
          { label: "Servico", valor: agendamentoSelecionado?.servico },
          {
            label: "Data e horario",
            valor: agendamentoSelecionado
              ? `${agendamentoSelecionado.data} - ${agendamentoSelecionado.horario}`
              : "",
          },
          {
            label: "Pagamento",
            valor: agendamentoSelecionado?.pago ? "Pago" : "Pendente",
          },
          { label: "Pago em", valor: agendamentoSelecionado?.pagoEm },
          { label: "Preco", valor: `R$ ${agendamentoSelecionado?.preco ?? "0,00"}` },
          { label: "Lamina", valor: agendamentoSelecionado?.lamina },
          { label: "Observacoes", valor: agendamentoSelecionado?.observacoes },
          { label: "Imagem", valor: agendamentoSelecionado?.imagemUri ? "Adicionada" : "Sem imagem" },
        ]}
        editando={editando}
        onEditar={() => setEditando(true)}
        onCancelarEdicao={() => setEditando(false)}
        onSalvar={salvarAgendamento}
        campos={[
          {
            label: "Servico",
            valor: form.servico,
            tipo: "select",
            opcoes: opcoesServicos,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, servico: valor })),
          },
          {
            label: "Data",
            valor: form.data,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, data: valor })),
          },
          {
            label: "Horario",
            valor: form.horario,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, horario: valor })),
            onBlur: () =>
              setForm((atual) => ({
                ...atual,
                horario: formatarHorario(atual.horario),
              })),
          },
          {
            label: "Preco",
            valor: form.preco,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, preco: valor })),
            onBlur: () =>
              setForm((atual) => ({
                ...atual,
                preco: formatarPreco(atual.preco),
              })),
            keyboardType: "decimal-pad",
          },
          {
            label: "Lamina",
            valor: form.lamina,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, lamina: valor })),
          },
          {
            label: "Observacoes",
            valor: form.observacoes,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, observacoes: valor })),
            multiline: true,
          },
        ]}
        extra={
          agendamentoSelecionado?.imagemUri ? (
            <View>
              <Text style={styles.modalTitulo}>Imagem do atendimento</Text>
              <Image
                source={{ uri: agendamentoSelecionado.imagemUri }}
                style={styles.imagemModal}
              />
            </View>
          ) : null
        }
        editExtra={
          <View style={styles.imagemEditor}>
            <Text style={styles.modalTitulo}>Imagem do atendimento</Text>
            {form.imagemUri ? (
              <Image source={{ uri: form.imagemUri }} style={styles.imagemModal} />
            ) : (
              <Text style={styles.modalTexto}>Nenhuma imagem selecionada.</Text>
            )}
            <View style={styles.linhaBotoesImagem}>
              <TouchableOpacity style={styles.botaoSecundario} onPress={escolherImagem}>
                <Text style={styles.textoSecundario}>
                  {form.imagemUri ? "Trocar imagem" : "Escolher da galeria"}
                </Text>
              </TouchableOpacity>
              {form.imagemUri ? (
                <TouchableOpacity
                  style={styles.botaoPerigo}
                  onPress={() => setForm((atual) => ({ ...atual, imagemUri: "" }))}
                >
                  <Text style={styles.textoBotao}>Remover</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        }
        acoes={
          agendamentoSelecionado ? (
            <>
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => alternarPagamento(agendamentoSelecionado.id)}
              >
                <Text style={styles.textoSecundario}>
                  {agendamentoSelecionado.pago ? "Marcar pendente" : "Marcar pago"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoPrimario}
                onPress={() => concluir(agendamentoSelecionado.id)}
              >
                <Text style={styles.textoBotao}>Concluir atendimento</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoPerigo}
                onPress={() => cancelar(agendamentoSelecionado.id)}
              >
                <Text style={styles.textoBotao}>Cancelar agendamento</Text>
              </TouchableOpacity>
            </>
          ) : null
        }
      />
    </View>
  );
}

export default Agendamentos;
