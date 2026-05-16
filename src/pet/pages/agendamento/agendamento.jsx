import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "../../components/appScreen";
import CardAgendamento from "../../components/cardAgendamento";
import DetalhesModal from "../../components/detalhesModal";
import Menu from "../../components/navbar";
import SearchBar from "../../components/searchBar";
import { usePetShop } from "../../context/PetShopContext";
import {
  dataHoraParaTempo,
  dataValidaBR,
  formatarDataDigitada,
  formatarHorario,
  formatarHorarioMascara,
  formatarPreco,
  horarioValido,
} from "../../utils/formatadores";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { confirmarDescarteEdicao } from "../../utils/confirmarFechar";
import { textoIndicadorPacote } from "../../utils/indicadorPacote";
import { opcoesServicos } from "../../utils/servicos";
import { styles } from "./styles";

function Agendamentos() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    agendamentos,
    pets,
    donos,
    obterPet,
    alternarPagamento,
    cancelarAgendamento,
    concluirAgendamento,
    atualizarAgendamento,
    carregandoDados,
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
  const [formErros, setFormErros] = useState({});
  const [busca, setBusca] = useState(String(params.busca ?? ""));

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
    setFormErros({});
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

  function restaurarFormularioAgendamento() {
    if (!agendamentoSelecionado) {
      return;
    }

    setFormErros({});
    setForm({
      servico: agendamentoSelecionado.servico,
      data: agendamentoSelecionado.data,
      horario: agendamentoSelecionado.horario,
      preco: agendamentoSelecionado.preco,
      lamina: agendamentoSelecionado.lamina,
      observacoes: agendamentoSelecionado.observacoes,
      imagemUri: agendamentoSelecionado.imagemUri ?? "",
    });
  }

  function cancelarEdicao() {
    confirmarDescarteEdicao(() => {
      restaurarFormularioAgendamento();
      setEditando(false);
    });
  }

  function fecharModal() {
    setIdSelecionado(null);
    setEditando(false);
    setFormErros({});
  }

  function salvarAgendamento() {
    if (!agendamentoSelecionado) {
      return;
    }

    const erros = {};

    if (!dataValidaBR(form.data)) {
      erros.data = "Informe uma data valida.";
    }

    if (!horarioValido(form.horario)) {
      erros.horario = "Informe um horario valido.";
    }

    setFormErros(erros);

    if (Object.keys(erros).length) {
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
    <AppScreen style={styles.container}>
      <Menu />

      <FlatList
        data={listaAgrupada}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.botaoPrimario}
              onPress={() => router.push("/novo-agendamento")}
              accessibilityRole="button"
              accessibilityLabel="Criar novo agendamento"
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
          <View style={styles.estadoVazio}>
            <Text style={styles.vazioTitulo}>
              {carregandoDados ? "Carregando agendamentos..." : "Nenhum agendamento em aberto"}
            </Text>
            {!carregandoDados ? (
              <>
                <Text style={styles.vazioTexto}>
                  Crie um novo horário para começar a organizar a agenda do dia.
                </Text>
                <TouchableOpacity
                  style={styles.botaoVazio}
                  onPress={() => router.push("/novo-agendamento")}
                  accessibilityRole="button"
                  accessibilityLabel="Criar novo agendamento"
                >
                  <Text style={styles.textoBotao}>Novo agendamento</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
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
              rotuloTipoServico={textoIndicadorPacote(item)}
              ehPacote={Boolean(item.pacoteId)}

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
            label: "Tipo",
            valor: agendamentoSelecionado
              ? textoIndicadorPacote(agendamentoSelecionado)
              : "",
          },
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
        onCancelarEdicao={cancelarEdicao}
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
            tipo: "date",
            erro: formErros.data,
            onChangeText: (valor) =>
              {
                setForm((atual) => ({
                  ...atual,
                  data: formatarDataDigitada(valor),
                }));
                setFormErros((atuais) => ({ ...atuais, data: "" }));
              },
            keyboardType: "number-pad",
          },
          {
            label: "Horario",
            valor: form.horario,
            erro: formErros.horario,
            onChangeText: (valor) =>
              {
                setForm((atual) => ({
                  ...atual,
                  horario: formatarHorarioMascara(valor),
                }));
                setFormErros((atuais) => ({ ...atuais, horario: "" }));
              },
            onBlur: () =>
              setForm((atual) => ({
                ...atual,
                horario: formatarHorario(atual.horario),
              })),
            keyboardType: "number-pad",
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
    </AppScreen>
  );
}

export default Agendamentos;
