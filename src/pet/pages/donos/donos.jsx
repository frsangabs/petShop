import { useState } from "react";
import { FlatList, Text } from "react-native";
import { confirmarDescarteEdicao } from "../../utils/confirmarFechar";
import AppScreen from "../../components/appScreen";
import CardDono from "../../components/cardDonos";
import DetalhesModal from "../../components/detalhesModal";
import Menu from "../../components/navbar";
import SearchBar from "../../components/searchBar";
import { usePetShop } from "../../context/PetShopContext";
import { styles } from "./styles";

function Donos() {
  const { donos, pets, atualizarDono, carregandoDados } = usePetShop();
  const [donoSelecionado, setDonoSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", busca: "" });
  const [busca, setBusca] = useState("");

  function petsDoDono(donoId) {
    return pets.filter((pet) => pet.donoId === donoId).map((pet) => pet.nome);
  }

  function contemBusca(...valores) {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return true;
    }
    return valores.some((valor) => String(valor ?? "").toLowerCase().includes(termo));
  }

  const donosFiltrados = donos.filter((dono) =>
    contemBusca(dono.nome, dono.telefone, petsDoDono(dono.id).join(" "))
  );

  function abrirDono(dono) {
    setDonoSelecionado(dono);
    setEditando(false);
    setForm({
      nome: dono.nome,
      telefone: dono.telefone,
      busca: dono.busca ? "sim" : "nao",
    });
  }

  function restaurarFormularioDono() {
    if (!donoSelecionado) {
      return;
    }

    setForm({
      nome: donoSelecionado.nome,
      telefone: donoSelecionado.telefone,
      busca: donoSelecionado.busca ? "sim" : "nao",
    });
  }

  function cancelarEdicao() {
    confirmarDescarteEdicao(() => {
      restaurarFormularioDono();
      setEditando(false);
    });
  }

  function fecharModal() {
    setDonoSelecionado(null);
    setEditando(false);
  }

  function salvarDono() {
    if (!donoSelecionado) {
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      busca: form.busca.trim().toLowerCase() === "sim",
    };

    atualizarDono(donoSelecionado.id, dados);
    setDonoSelecionado((atual) => (atual ? { ...atual, ...dados } : atual));
    setEditando(false);
  }

  return (
    <AppScreen style={styles.container}>
      <Menu />

      <FlatList
        data={donosFiltrados}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <SearchBar
            valor={busca}
            onChangeText={setBusca}
            placeholder="Buscar por dono, telefone ou pet"
          />
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregandoDados ? "Carregando donos..." : "Nenhum dono cadastrado."}
          </Text>
        }
        renderItem={({ item }) => (
          <CardDono
            nome={item.nome}
            telefone={item.telefone}
            pets={petsDoDono(item.id)}
            busca={item.busca}
            onPress={() => abrirDono(item)}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />

      <DetalhesModal
        visivel={Boolean(donoSelecionado)}
        titulo={donoSelecionado?.nome ?? "Dono"}
        onFechar={fecharModal}
        linhas={[
          { label: "Nome", valor: donoSelecionado?.nome },
          { label: "Telefone", valor: donoSelecionado?.telefone },
          {
            label: "Pets",
            valor: donoSelecionado
              ? petsDoDono(donoSelecionado.id).join(", ")
              : "",
          },
          {
            label: "Busca",
            valor: donoSelecionado?.busca ? "Demora a buscar" : "Busca rapido",
          },
        ]}
        editando={editando}
        onEditar={() => setEditando(true)}
        onCancelarEdicao={cancelarEdicao}
        onSalvar={salvarDono}
        campos={[
          {
            label: "Nome",
            valor: form.nome,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, nome: valor })),
          },
          {
            label: "Telefone",
            valor: form.telefone,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, telefone: valor })),
          },
          {
            label: "Demora a buscar? (sim/nao)",
            valor: form.busca,
            onChangeText: (valor) => setForm((atual) => ({ ...atual, busca: valor })),
          },
        ]}
      />
    </AppScreen>
  );
}

export default Donos;
