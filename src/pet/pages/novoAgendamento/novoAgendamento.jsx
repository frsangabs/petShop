import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AppScreen from "../../components/appScreen";
import DateInput from "../../components/dateInput";
import Menu from "../../components/navbar";
import { usePetShop } from "../../context/PetShopContext";
import {
  dataValidaBR,
  formatarDataDigitada,
  formatarHorario,
  formatarHorarioMascara,
  formatarPreco,
  horarioValido,
} from "../../utils/formatadores";
import { confirmarSairSemSalvar } from "../../utils/confirmarFechar";
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
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
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
    const digitos = String(valor ?? "").replace(/\D/g, "");
    return digitos.length >= 10;
  }

  function validarFormulario() {
    const novosErros = {};

    if (!servico.trim()) {
      novosErros.servico = "Selecione um serviço.";
    }

    if (!data.trim()) {
      novosErros.data = "Informe a data.";
    } else if (!dataValidaBR(data)) {
      novosErros.data = "Use uma data válida no formato dd/mm/aaaa.";
    }

    if (!horario.trim()) {
      novosErros.horario = "Informe o horário.";
    } else if (!horarioValido(horario)) {
      novosErros.horario = "Use um horário válido, como 09:30.";
    }

    if (!petId && !petBusca.trim()) {
      novosErros.pet = "Selecione ou informe o nome do pet.";
    }

    if (!petId && petBusca.trim()) {
      if (!novoDono.trim()) {
        novosErros.dono = "Informe o nome do dono.";
      }

      if (!telefoneValido(novoTelefone)) {
        novosErros.telefone = "Informe um telefone com DDD.";
      }
    }

    return novosErros;
  }

  async function escolherImagem() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setImagemUri(uri);
    }
  }

  function alterarBuscaPet(valor) {
    setPetBusca(valor);
    setPetId("");
    limparErro("pet");
  }

  function selecionarPet(pet) {
    const dono = obterDono(pet.donoId);

    setPetId(pet.id);
    setPetBusca(
      `${pet.nome} - ${dono?.nome ?? "Sem dono"} - ${dono?.telefone ?? ""}`
    );
    setNovoDono("");
    setNovoTelefone("");
    limparErro("pet");
    limparErro("dono");
    limparErro("telefone");
  }

  function sairDoFormulario() {
    if (router.canGoBack?.()) {
      router.back();
      return;
    }

    router.replace("/agendamentos");
  }

  function voltarParaAgenda() {
    confirmarSairSemSalvar(sairDoFormulario);
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
    const errosValidacao = validarFormulario();
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length) {
      return;
    }

    setSalvando(true);

    const petSelecionadoId = await obterOuCriarPetId();

    if (!petSelecionadoId) {
      setErros({
        pet: "Selecione um pet existente ou preencha os dados para cadastrar um novo pet.",
      });
      setSalvando(false);
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

    const resultado = pacote
      ? await criarPacoteBanhos({ ...dados, quantidadeBanhos })
      : await criarAgendamento(dados);

    Alert.alert(
      "Agendamento salvo",
      resultado?.offline
        ? "O atendimento ficou salvo neste aparelho. Quando a conexão voltar, confira se ele aparece nos outros aparelhos."
        : pacote
          ? "O pacote foi criado e os banhos semanais foram agendados."
          : "O agendamento foi criado com sucesso."
    );
    setSalvando(false);
    router.replace("/agendamentos");
  }

  return (
    <AppScreen style={styles.tela} avoidKeyboard>
      <Menu />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Novo agendamento</Text>
            <View style={styles.cabecalhoAcoes}>
              <TouchableOpacity
                style={styles.botaoFechar}
                onPress={voltarParaAgenda}
                accessibilityRole="button"
                accessibilityLabel="Fechar novo agendamento"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.botaoFecharTexto}>X</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Pet</Text>
          <TextInput
            placeholder="Digite o nome do pet, dono ou telefone"
            value={petBusca}
            onChangeText={alterarBuscaPet}
            style={styles.input}
            placeholderTextColor="#999"
            accessibilityLabel="Buscar ou cadastrar pet"
            returnKeyType="next"
          />
          {erros.pet ? <Text style={styles.erroCampo}>{erros.pet}</Text> : null}

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
                onChangeText={(valor) => {
                  setNovoDono(valor);
                  limparErro("dono");
                }}
                style={styles.input}
                placeholderTextColor="#999"
                accessibilityLabel="Nome do dono"
              />
              {erros.dono ? <Text style={styles.erroCampo}>{erros.dono}</Text> : null}
              <TextInput
                placeholder="Telefone do dono"
                value={novoTelefone}
                onChangeText={(valor) => {
                  setNovoTelefone(valor);
                  limparErro("telefone");
                }}
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#999"
                accessibilityLabel="Telefone do dono"
              />
              {erros.telefone ? (
                <Text style={styles.erroCampo}>{erros.telefone}</Text>
              ) : null}
              <TextInput
                placeholder="Raca do pet (opcional)"
                value={novaRaca}
                onChangeText={setNovaRaca}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <Text style={styles.label}>Porte do pet</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={novoPorte}
                  onValueChange={setNovoPorte}
                  style={styles.picker}
                  dropdownIconColor="#333"
                >
                  <Picker.Item label="Pequeno" value="Pequeno" color="#333" />
                  <Picker.Item label="Medio" value="Medio" color="#333" />
                  <Picker.Item label="Grande" value="Grande" color="#333" />
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
              <Picker
                selectedValue={servico}
                onValueChange={(value) => setServico(value)}
                style={styles.picker}
                dropdownIconColor="#333"
              >
                {opcoesServicos.map((opcao) => (
                  <Picker.Item
                    key={opcao.value}
                    label={opcao.label}
                    value={opcao.value}
                    color="#333"
                  />
                ))}
              </Picker>
            </View>
          )}

          <DateInput
            label="Data"
            value={data}
            onChange={(valor) => {
              setData(formatarDataDigitada(valor));
              limparErro("data");
            }}
            erro={erros.data}
            accessibilityLabel="Data do agendamento"
          />

          <TextInput
            placeholder="Horario"
            value={horario}
            onChangeText={(valor) => {
              setHorario(formatarHorarioMascara(valor));
              limparErro("horario");
            }}
            onBlur={() => setHorario(formatarHorario(horario))}
            style={styles.input}
            placeholderTextColor="#999"
            accessibilityLabel="Horário do agendamento"
            keyboardType="number-pad"
          />
          {erros.horario ? <Text style={styles.erroCampo}>{erros.horario}</Text> : null}

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

          <Pressable
            style={[styles.toggle, pacote && styles.toggleAtivo]}
            onPress={() => setPacote((atual) => !atual)}
            accessibilityRole="switch"
            accessibilityState={{ checked: pacote }}
          >
            <Text style={[styles.toggleTexto, pacote && styles.toggleTextoAtivo]}>
              {pacote ? "Pacote de banhos ativo" : "Agendamento avulso"}
            </Text>
          </Pressable>

          {pacote ? (
            <View style={styles.campo}>
              <Text style={styles.label}>Quantidade de banhos no pacote</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={quantidadeBanhos}
                  onValueChange={(value) => setQuantidadeBanhos(value)}
                  style={styles.picker}
                  dropdownIconColor="#333"
                >
                  <Picker.Item label="1 banho" value={1} color="#333" />
                  <Picker.Item label="2 banhos" value={2} color="#333" />
                  <Picker.Item label="3 banhos" value={3} color="#333" />
                  <Picker.Item label="4 banhos" value={4} color="#333" />
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
                  style={styles.picker}
                  dropdownIconColor="#333"
                >
                  {opcoesServicos.map((opcao) => (
                    <Picker.Item
                      key={opcao.value}
                      label={opcao.label}
                      value={opcao.value}
                      color="#333"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ) : null}

          <Pressable
            style={[styles.toggle, pago && styles.toggleAtivo]}
            onPress={() => setPago((atual) => !atual)}
            accessibilityRole="switch"
            accessibilityState={{ checked: pago }}
          >
            <Text style={[styles.toggleTexto, pago && styles.toggleTextoAtivo]}>
              {pago ? "Pagamento marcado como pago" : "Pagamento pendente"}
            </Text>
          </Pressable>

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

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={salvar}
            disabled={salvando}
            accessibilityRole="button"
            accessibilityState={{ disabled: salvando }}
          >
            <Text style={styles.textoBotao}>
              {salvando ? "Salvando..." : "Salvar agendamento"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

export default NovoAgendamento;
