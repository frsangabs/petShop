import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import CardHistorico from "../../components/cardHistorico";
import DetalhesModal from "../../components/detalhesModal";
import Menu from "../../components/navbar";
import SearchBar from "../../components/searchBar";
import { usePetShop } from "../../context/PetShopContext";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { styles } from "./styles";

function Historico() {
  const { historico, obterPet, obterDono, atualizarHistorico } = usePetShop();
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    servico: "",
    data: "",
    horario: "",
    concluidoEm: "",
    preco: "",
    lamina: "",
    observacoes: "",
    imagemUri: "",
  });
  const [busca, setBusca] = useState("");
  const petSelecionado = registroSelecionado
    ? obterPet(registroSelecionado.petId)
    : null;

  function contemBusca(...valores) {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return true;
    }
    return valores.some((valor) => String(valor ?? "").toLowerCase().includes(termo));
  }

  const historicoFiltrado = historico.filter((registro) => {
    const pet = obterPet(registro.petId);
    const dono = pet ? obterDono(pet.donoId) : null;
    return contemBusca(
      pet?.nome,
      dono?.nome,
      dono?.telefone,
      registro.servico,
      registro.data,
      registro.concluidoEm
    );
  });

  function abrirRegistro(registro) {
    setRegistroSelecionado(registro);
    setEditando(false);
    setForm({
      servico: registro.servico,
      data: registro.data,
      horario: registro.horario,
      concluidoEm: registro.concluidoEm ?? "",
      preco: registro.preco,
      lamina: registro.lamina,
      observacoes: registro.observacoes,
      imagemUri: registro.imagemUri ?? "",
    });
  }

  async function escolherImagem() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setForm((atual) => ({ ...atual, imagemUri: uri }));
    }
  }

  function fecharModal() {
    setRegistroSelecionado(null);
    setEditando(false);
  }

  function salvarRegistro() {
    if (!registroSelecionado) {
      return;
    }

    const dados = {
      servico: form.servico.trim(),
      data: form.data.trim(),
      horario: form.horario.trim(),
      concluidoEm: form.concluidoEm.trim(),
      preco: form.preco.trim() || "0,00",
      lamina: form.lamina.trim() || "-",
      observacoes: form.observacoes.trim() || "Sem observacoes.",
      imagemUri: form.imagemUri,
    };

    atualizarHistorico(registroSelecionado.id, dados);
    setRegistroSelecionado((atual) => (atual ? { ...atual, ...dados } : atual));
    setEditando(false);
  }

  return (
    <View style={styles.container}>
      <Menu />

      <FlatList
        data={historicoFiltrado}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <SearchBar
            valor={busca}
            onChangeText={setBusca}
            placeholder="Buscar por pet, dono, telefone ou servico"
          />
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum atendimento concluido ainda.</Text>
        }
        renderItem={({ item }) => {
          const pet = obterPet(item.petId);

          return (
            <CardHistorico
              nomePet={pet?.nome ?? "Pet removido"}
              servico={item.servico}
              lamina={item.lamina}
              preco={item.preco}
              data={item.concluidoEm ?? item.data}
              imagemUri={item.imagemUri}
              onPress={() => abrirRegistro(item)}
            />
          );
        }}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />

      <DetalhesModal
        visivel={Boolean(registroSelecionado)}
        titulo={petSelecionado?.nome ?? "Historico"}
        onFechar={fecharModal}
        linhas={[
          { label: "Pet", valor: petSelecionado?.nome },
          { label: "Servico", valor: registroSelecionado?.servico },
          {
            label: "Data agendada",
            valor: registroSelecionado
              ? `${registroSelecionado.data} - ${registroSelecionado.horario}`
              : "",
          },
          { label: "Concluido em", valor: registroSelecionado?.concluidoEm },
          { label: "Preco", valor: `R$ ${registroSelecionado?.preco ?? "0,00"}` },
          { label: "Lamina", valor: registroSelecionado?.lamina },
          { label: "Pagamento", valor: registroSelecionado?.pago ? "Pago" : "Pendente" },
          { label: "Observacoes", valor: registroSelecionado?.observacoes },
          { label: "Imagem", valor: registroSelecionado?.imagemUri ? "Adicionada" : "Sem imagem" },
        ]}
        editando={editando}
        onEditar={() => setEditando(true)}
        onCancelarEdicao={() => setEditando(false)}
        onSalvar={salvarRegistro}
        campos={[
          {
            label: "Servico",
            valor: form.servico,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, servico: valor })),
          },
          {
            label: "Data agendada",
            valor: form.data,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, data: valor })),
          },
          {
            label: "Horario",
            valor: form.horario,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, horario: valor })),
          },
          {
            label: "Concluido em",
            valor: form.concluidoEm,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, concluidoEm: valor })),
          },
          {
            label: "Preco",
            valor: form.preco,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, preco: valor })),
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
          registroSelecionado?.imagemUri ? (
            <View>
              <Text style={styles.modalTitulo}>Imagem do atendimento</Text>
              <Image
                source={{ uri: registroSelecionado.imagemUri }}
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
      />
    </View>
  );
}

export default Historico;
