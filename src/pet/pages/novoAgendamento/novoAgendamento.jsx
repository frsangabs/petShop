import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Menu from "../../components/navbar";
import { usePetShop } from "../../context/PetShopContext";
import { formatarHorario, formatarPreco } from "../../utils/formatadores";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { opcoesServicos } from "../../utils/servicos";
import { styles } from "./styles";

function dataHoje() {
  return new Date().toLocaleDateString("pt-BR");
}

function NovoAgendamento() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pets, obterDono, criarPet, criarAgendamento, criarPacoteBanhos } =
    usePetShop();

  const [petId, setPetId] = useState("");
  const [petBusca, setPetBusca] = useState("");
  const [novoDono, setNovoDono] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novaRaca, setNovaRaca] = useState("");
  const [novoPorte, setNovoPorte] = useState("Pequeno");
  const [servico, setServico] = useState("Banho");
  const [data, setData] = useState(params.data ?? dataHoje());
  const [horario, setHorario] = useState(params.horario ?? "");
  const [preco, setPreco] = useState("");
  const [lamina, setLamina] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [pago, setPago] = useState(false);
  const [imagemUri, setImagemUri] = useState("");
  const [pacote, setPacote] = useState(false);
  const [quantidadeBanhos, setQuantidadeBanhos] = useState(4);
  const sugestoesPets = useMemo(() => {
    const termo = petBusca.trim().toLowerCase();

    if (!termo || petId) {
      return [];
    }

    return pets
      .filter((pet) => {
        const dono = obterDono(pet.donoId);

        return [pet.nome, dono?.nome, dono?.telefone].some((valor) =>
          String(valor ?? "").toLowerCase().includes(termo)
        );
      })
      .slice(0, 5);
  }, [obterDono, petBusca, petId, pets]);
  const [bonusServico, setBonusServico] = useState("Tosa Higiênica");

  async function escolherImagem() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setImagemUri(uri);
    }
  }

  function alterarBuscaPet(valor) {
    setPetBusca(valor);
    setPetId("");
  }

  function selecionarPet(pet) {
    const dono = obterDono(pet.donoId);

    setPetId(pet.id);
    setPetBusca(
      `${pet.nome} - ${dono?.nome ?? "Sem dono"} - ${dono?.telefone ?? ""}`
    );
    setNovoDono("");
    setNovoTelefone("");
  }

  async function obterOuCriarPetId() {
    if (petId) {
      return petId;
    }

    const nomePet = petBusca.trim();

    if (!nomePet || !novoDono.trim() || !novoTelefone.trim()) {
      return "";
    }

    const resultado = await criarPet({
      nome: nomePet,
      raca: novaRaca.trim() || "Nao informada",
      porte: novoPorte,
      dono: novoDono,
      telefone: novoTelefone,
      foto: "",
      donoId: null,
    });

    return resultado?.pet?.id ?? "";
  }

  async function salvar() {
    if (!servico.trim() || !data.trim() || !horario.trim()) {
      Alert.alert(
        "Campos obrigatorios",
        "Preencha servico, data e horario."
      );
      return;
    }

    const petSelecionadoId = await obterOuCriarPetId();

    if (!petSelecionadoId) {
      Alert.alert(
        "Dados do pet",
        "Selecione um pet existente ou preencha nome do pet, dono e telefone."
      );
      return;
    }

    const dados = {
      petId: petSelecionadoId,
      servico: pacote ? "Banho" : servico,
      data,
      horario: formatarHorario(horario),
      preco: formatarPreco(preco),
      lamina,
      observacoes,
      pago,
      imagemUri,
      bonusServico,
    };

    if (pacote) {
      criarPacoteBanhos({ ...dados, quantidadeBanhos });
    } else {
      criarAgendamento(dados);
    }

    Alert.alert(
      "Agendamento salvo",
      pacote
        ? "O pacote foi criado e os banhos semanais foram agendados."
        : "O agendamento foi criado com sucesso."
    );
    router.replace("/agendamentos");
  }

  return (
    <View style={styles.tela}>
      <Menu />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Novo agendamento</Text>

          <Text style={styles.label}>Pet</Text>
          <TextInput
            placeholder="Digite o nome do pet, dono ou telefone"
            value={petBusca}
            onChangeText={alterarBuscaPet}
            style={styles.input}
            placeholderTextColor="#999"
          />

          {sugestoesPets.length ? (
            <View style={styles.sugestoes}>
              {sugestoesPets.map((pet) => {
                const dono = obterDono(pet.donoId);

                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={styles.sugestaoItem}
                    onPress={() => selecionarPet(pet)}
                  >
                    <Text style={styles.sugestaoTitulo}>{pet.nome}</Text>
                    <Text style={styles.sugestaoTexto}>
                      {dono?.nome ?? "Sem dono"} - {dono?.telefone ?? "Sem telefone"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {!petId && petBusca.trim() ? (
            <View style={styles.campoNovoPet}>
              <Text style={styles.ajuda}>
                Se nao selecionar um pet existente, este pet sera cadastrado junto
                com o dono.
              </Text>
              <TextInput
                placeholder="Nome do dono"
                value={novoDono}
                onChangeText={setNovoDono}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Telefone do dono"
                value={novoTelefone}
                onChangeText={setNovoTelefone}
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Raca do pet (opcional)"
                value={novaRaca}
                onChangeText={setNovaRaca}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <Text style={styles.label}>Porte do pet</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={novoPorte} onValueChange={setNovoPorte}>
                  <Picker.Item label="Pequeno" value="Pequeno" />
                  <Picker.Item label="Medio" value="Medio" />
                  <Picker.Item label="Grande" value="Grande" />
                </Picker>
              </View>
            </View>
          ) : null}

          <Text style={styles.label}>
            {pacote ? "Servico do pacote" : "Servico"}
          </Text>
          {pacote ? (
            <View style={styles.pickerContainer}>
              <Text style={styles.valorFixo}>Banho</Text>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker selectedValue={servico} onValueChange={(value) => setServico(value)}>
                {opcoesServicos.map((opcao) => (
                  <Picker.Item
                    key={opcao.value}
                    label={opcao.label}
                    value={opcao.value}
                  />
                ))}
              </Picker>
            </View>
          )}

          <TextInput
            placeholder="Data"
            value={data}
            onChangeText={setData}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Horario"
            value={horario}
            onChangeText={setHorario}
            onBlur={() => setHorario(formatarHorario(horario))}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Preco (opcional)"
            value={preco}
            onChangeText={setPreco}
            onBlur={() => setPreco(formatarPreco(preco))}
            keyboardType="decimal-pad"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Lamina (opcional)"
            value={lamina}
            onChangeText={setLamina}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Observacoes (opcional)"
            value={observacoes}
            onChangeText={setObservacoes}
            style={[styles.input, styles.textarea]}
            multiline
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.toggle, pacote && styles.toggleAtivo]}
            onPress={() => setPacote((atual) => !atual)}
          >
            <Text style={[styles.toggleTexto, pacote && styles.toggleTextoAtivo]}>
              {pacote ? "Pacote de banhos ativo" : "Agendamento avulso"}
            </Text>
          </TouchableOpacity>

          {pacote ? (
            <View style={styles.campo}>
              <Text style={styles.label}>Quantidade de banhos no pacote</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={quantidadeBanhos}
                  onValueChange={(value) => setQuantidadeBanhos(value)}
                >
                  <Picker.Item label="1 banho" value={1} />
                  <Picker.Item label="2 banhos" value={2} />
                  <Picker.Item label="3 banhos" value={3} />
                  <Picker.Item label="4 banhos" value={4} />
                </Picker>
              </View>
              <Text style={styles.ajuda}>
                A partir da data do primeiro banho, os proximos serao criados com 7 dias de diferenca.
              </Text>
              <Text style={styles.ajuda}>
                Pacotes sempre geram banhos. Outros servicos entram como agendamento avulso.
              </Text>
              <Text style={styles.label}>Servico bonus do pacote</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={bonusServico}
                  onValueChange={(value) => setBonusServico(value)}
                >
                  {opcoesServicos.map((opcao) => (
                    <Picker.Item
                      key={opcao.value}
                      label={opcao.label}
                      value={opcao.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.toggle, pago && styles.toggleAtivo]}
            onPress={() => setPago((atual) => !atual)}
          >
            <Text style={[styles.toggleTexto, pago && styles.toggleTextoAtivo]}>
              {pago ? "Pagamento marcado como pago" : "Pagamento pendente"}
            </Text>
          </TouchableOpacity>

          <View style={styles.imagemBox}>
            <Text style={styles.label}>Imagem do atendimento (opcional)</Text>
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={styles.preview} />
            ) : (
              <View style={styles.semImagem}>
                <Text style={styles.semImagemTexto}>Nenhuma imagem selecionada</Text>
              </View>
            )}

            <View style={styles.linhaBotoes}>
              <TouchableOpacity style={styles.botaoImagem} onPress={escolherImagem}>
                <Text style={styles.textoImagem}>
                  {imagemUri ? "Trocar imagem" : "Escolher da galeria"}
                </Text>
              </TouchableOpacity>

              {imagemUri ? (
                <TouchableOpacity
                  style={styles.botaoRemover}
                  onPress={() => setImagemUri("")}
                >
                  <Text style={styles.textoRemover}>Remover</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <TouchableOpacity style={styles.botao} onPress={salvar}>
            <Text style={styles.textoBotao}>Salvar agendamento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default NovoAgendamento;
