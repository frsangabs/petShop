import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
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

  async function escolherFoto() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setFoto(uri);
    }
  }

  function salvarPet() {
    if (
      !nome.trim() ||
      !raca.trim() ||
      !porte ||
      (usarDonoExistente ? !donoId : !dono.trim() || !telefone.trim())
    ) {
      Alert.alert("Campos obrigatorios", "Preencha os dados do pet e do dono.");
      return;
    }

    criarPet({
      nome,
      raca,
      porte,
      dono,
      telefone,
      foto,
      donoId: usarDonoExistente ? donoId : null,
    });
    Alert.alert("Pet salvo", "O pet foi cadastrado com sucesso.");
    router.replace("/pets");
  }

  return (
    <View style={styles.container}>
      <Menu />
      <CardCriarPet
        nome={nome}
        setNome={setNome}
        raca={raca}
        setRaca={setRaca}
        porte={porte}
        setPorte={setPorte}
        dono={dono}
        setDono={setDono}
        telefone={telefone}
        setTelefone={setTelefone}
        donos={donos}
        donoId={donoId}
        setDonoId={setDonoId}
        usarDonoExistente={usarDonoExistente}
        setUsarDonoExistente={setUsarDonoExistente}
        foto={foto}
        onEscolherFoto={escolherFoto}
        onRemoverFoto={() => setFoto("")}
        onSalvar={salvarPet}
      />
    </View>
  );
}

export default CriarPet;
