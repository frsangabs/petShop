import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import CardPet from "../../components/cardPets";
import DetalhesModal from "../../components/detalhesModal";
import Menu from "../../components/navbar";
import SearchBar from "../../components/searchBar";
import { usePetShop } from "../../context/PetShopContext";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { styles } from "./styles";

function Pets() {
  const router = useRouter();
  const {
    pets,
    agendamentos,
    historico,
    obterDono,
    atualizarPet,
    atualizarDono,
  } = usePetShop();
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    raca: "",
    porte: "",
    dono: "",
    telefone: "",
    foto: "",
  });
  const donoSelecionado = petSelecionado
    ? obterDono(petSelecionado.donoId)
    : null;
  const [busca, setBusca] = useState("");

  function contemBusca(...valores) {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return true;
    }
    return valores.some((valor) => String(valor ?? "").toLowerCase().includes(termo));
  }

  const petsFiltrados = pets.filter((pet) => {
    const dono = obterDono(pet.donoId);
    return contemBusca(pet.nome, pet.raca, pet.porte, dono?.nome, dono?.telefone);
  });

  function abrirPet(pet) {
    const dono = obterDono(pet.donoId);
    setPetSelecionado(pet);
    setEditando(false);
    setForm({
      nome: pet.nome,
      raca: pet.raca,
      porte: pet.porte,
      dono: dono?.nome ?? "",
      telefone: dono?.telefone ?? "",
      foto: pet.foto ?? "",
    });
  }

  async function escolherFoto() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setForm((atual) => ({ ...atual, foto: uri }));
    }
  }

  function fecharModal() {
    setPetSelecionado(null);
    setEditando(false);
  }

  function salvarPet() {
    if (!petSelecionado) {
      return;
    }

    atualizarPet(petSelecionado.id, {
      nome: form.nome.trim(),
      raca: form.raca.trim(),
      porte: form.porte.trim(),
      foto: form.foto,
    });

    if (petSelecionado.donoId) {
      atualizarDono(petSelecionado.donoId, {
        nome: form.dono.trim(),
        telefone: form.telefone.trim(),
      });
    }

    setPetSelecionado((atual) =>
      atual
        ? {
            ...atual,
            nome: form.nome.trim(),
            raca: form.raca.trim(),
            porte: form.porte.trim(),
            foto: form.foto,
          }
        : atual
    );
    setEditando(false);
  }

  const ultimosAgendamentos = petSelecionado
    ? [...agendamentos, ...historico]
        .filter((item) => item.petId === petSelecionado.id)
        .slice(-3)
        .reverse()
    : [];

  return (
    <View style={styles.container}>
      <Menu />

      <FlatList
        data={petsFiltrados}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.botaoPrimario}
              onPress={() => router.push("/criar-pet")}
            >
              <Text style={styles.textoBotao}>Novo pet</Text>
            </TouchableOpacity>
            <SearchBar
              valor={busca}
              onChangeText={setBusca}
              placeholder="Buscar por pet, dono ou telefone"
            />
          </>
        }
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum pet cadastrado.</Text>}
        renderItem={({ item }) => (
          <CardPet
            nome={item.nome}
            raca={item.raca}
            dono={obterDono(item.donoId)?.nome ?? "Sem dono"}
            foto={item.foto}
            onPress={() => abrirPet(item)}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />

      <DetalhesModal
        visivel={Boolean(petSelecionado)}
        titulo={petSelecionado?.nome ?? "Pet"}
        onFechar={fecharModal}
        linhas={[
          { label: "Nome", valor: petSelecionado?.nome },
          { label: "Raca", valor: petSelecionado?.raca },
          { label: "Porte", valor: petSelecionado?.porte },
          { label: "Dono", valor: donoSelecionado?.nome },
          { label: "Telefone", valor: donoSelecionado?.telefone },
          { label: "Foto", valor: petSelecionado?.foto ? "Adicionada" : "Sem foto" },
        ]}
        editando={editando}
        onEditar={() => setEditando(true)}
        onCancelarEdicao={() => setEditando(false)}
        onSalvar={salvarPet}
        campos={[
          {
            label: "Nome",
            valor: form.nome,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, nome: valor })),
          },
          {
            label: "Raca",
            valor: form.raca,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, raca: valor })),
          },
          {
            label: "Porte",
            valor: form.porte,
            tipo: "select",
            opcoes: [
              { label: "Pequeno", value: "Pequeno" },
              { label: "Medio", value: "Medio" },
              { label: "Grande", value: "Grande" },
            ],
            onChangeText: (valor) => setForm((atual) => ({ ...atual, porte: valor })),
          },
          {
            label: "Dono",
            valor: form.dono,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, dono: valor })),
          },
          {
            label: "Telefone",
            valor: form.telefone,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, telefone: valor })),
          },
        ]}
        extra={
          <View>
            {petSelecionado?.foto ? (
              <>
                <Text style={styles.modalTitulo}>Foto do pet</Text>
                <Image source={{ uri: petSelecionado.foto }} style={styles.fotoModal} />
              </>
            ) : null}
            <Text style={styles.modalTitulo}>Ultimos agendamentos</Text>
            {ultimosAgendamentos.length ? (
              ultimosAgendamentos.map((item) => (
                <Text key={`${item.id}-${item.concluidoEm ?? "aberto"}`} style={styles.modalTexto}>
                  {item.data} {item.horario} - {item.servico}
                  {item.concluidoEm ? " (concluido)" : " (em aberto)"}
                </Text>
              ))
            ) : (
              <Text style={styles.modalTexto}>Nenhum agendamento encontrado.</Text>
            )}
          </View>
        }
        editExtra={
          <View>
            <Text style={styles.modalTitulo}>Foto do pet</Text>
            {form.foto ? (
              <Image source={{ uri: form.foto }} style={styles.fotoModal} />
            ) : (
              <Text style={styles.modalTexto}>Nenhuma foto selecionada.</Text>
            )}
            <View style={styles.linhaBotoes}>
              <TouchableOpacity style={styles.botaoSecundario} onPress={escolherFoto}>
                <Text style={styles.textoSecundario}>
                  {form.foto ? "Trocar foto" : "Escolher da galeria"}
                </Text>
              </TouchableOpacity>
              {form.foto ? (
                <TouchableOpacity
                  style={styles.botaoPerigo}
                  onPress={() => setForm((atual) => ({ ...atual, foto: "" }))}
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

export default Pets;
