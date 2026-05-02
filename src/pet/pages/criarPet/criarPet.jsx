import { useState } from "react";
import { View } from "react-native";
import CardCriarPet from "../../components/criarPet";

function CriarPet() {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [porte, setPorte] = useState("");
  const [dono, setDono] = useState("");
  const [telefone, setTelefone] = useState("");

  function salvarPet() {
    const novoPet = {
      nome,
      raca,
      porte,
      dono,
      telefone,
    };

    console.log("Pet criado:", novoPet);

    setNome("");
    setRaca("");
    setPorte("");
    setDono("");
    setTelefone("");
  }

  return (
    <View>
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
        onSalvar={salvarPet}
      />
    </View>
  );
}

export default CriarPet;