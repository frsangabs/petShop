import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import AppScreen from "../../components/appScreen";
import CardCriarPet from "../../components/criarPet";
import Menu from "../../components/navbar";
import { usePetShop } from "../../context/PetShopContext";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { styles } from "./styles";

function CriarPet() {
  const router = useRouter();
  const { criarPet, donos } = usePetShop();
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [porte, setPorte] = useState("");
  const [dono, setDono] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [usarDonoExistente, setUsarDonoExistente] = useState(false);
  const [donoId, setDonoId] = useState("");
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  function limparErro(campo) {
    setErros((atuais) => {
      if (!atuais[campo]) {
        return atuais;
      }

      const novos = { ...atuais };
      delete novos[campo];
      return novos;
    });
  }

  function telefoneValido(valor) {
    return String(valor ?? "").replace(/\D/g, "").length >= 10;
  }

  function validarFormulario() {
    const novosErros = {};

    if (!nome.trim()) {
      novosErros.nome = "Informe o nome do pet.";
    }

    if (!raca.trim()) {
      novosErros.raca = "Informe a raça do pet.";
    }

    if (!porte) {
      novosErros.porte = "Selecione o porte.";
    }

    if (usarDonoExistente) {
      if (!donoId) {
        novosErros.donoId = "Selecione um dono.";
      }
    } else {
      if (!dono.trim()) {
        novosErros.dono = "Informe o nome do dono.";
      }

      if (!telefoneValido(telefone)) {
        novosErros.telefone = "Informe um telefone com DDD.";
      }
    }

    return novosErros;
  }

  async function escolherFoto() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setFoto(uri);
    }
  }

  async function salvarPet() {
    const errosValidacao = validarFormulario();
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length) {
      return;
    }

    setSalvando(true);
    const resultado = await criarPet({
      nome,
      raca,
      porte,
      dono,
      telefone,
      foto,
      donoId: usarDonoExistente ? donoId : null,
    });
    setSalvando(false);
    Alert.alert(
      resultado?.offline ? "Pet salvo" : "Pet salvo",
      resultado?.offline
        ? "O pet ficou salvo neste aparelho. Quando a conexão voltar, confira se ele aparece nos outros aparelhos."
        : "O pet foi cadastrado com sucesso."
    );
    router.replace("/pets");
  }

  function cancelarCadastro() {
    Alert.alert("Sair sem salvar?", "As informacoes preenchidas nao serao salvas.", [
      { text: "Continuar editando", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          if (router.canGoBack?.()) {
            router.back();
            return;
          }

          router.replace("/pets");
        },
      },
    ]);
  }

  return (
    <AppScreen style={styles.container} avoidKeyboard>
      <Menu />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CardCriarPet
          nome={nome}
          setNome={(valor) => {
            setNome(valor);
            limparErro("nome");
          }}
          raca={raca}
          setRaca={(valor) => {
            setRaca(valor);
            limparErro("raca");
          }}
          porte={porte}
          setPorte={(valor) => {
            setPorte(valor);
            limparErro("porte");
          }}
          dono={dono}
          setDono={(valor) => {
            setDono(valor);
            limparErro("dono");
          }}
          telefone={telefone}
          setTelefone={(valor) => {
            setTelefone(valor);
            limparErro("telefone");
          }}
          donos={donos}
          donoId={donoId}
          setDonoId={(valor) => {
            setDonoId(valor);
            limparErro("donoId");
          }}
          usarDonoExistente={usarDonoExistente}
          setUsarDonoExistente={setUsarDonoExistente}
          foto={foto}
          erros={erros}
          salvando={salvando}
          onEscolherFoto={escolherFoto}
          onRemoverFoto={() => setFoto("")}
          onSalvar={salvarPet}
          onCancelar={cancelarCadastro}
        />
      </ScrollView>
    </AppScreen>
  );
}

export default CriarPet;
