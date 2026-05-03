import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { styles } from "./styles";

function dataHoje() {
  return new Date().toLocaleDateString("pt-BR");
}

function NovoAgendamento() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pets, obterDono, criarAgendamento, criarPacoteBanhos } = usePetShop();

  const [petId, setPetId] = useState(pets[0]?.id ?? "");
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

  async function escolherImagem() {
    const uri = await selecionarImagemLeve();

    if (uri) {
      setImagemUri(uri);
    }
  }

  function salvar() {
    if (!petId || !servico.trim() || !data.trim() || !horario.trim()) {
      Alert.alert(
        "Campos obrigatorios",
        "Escolha o pet e preencha servico, data e horario."
      );
      return;
    }

    const dados = {
      petId,
      servico,
      data,
      horario,
      preco,
      lamina,
      observacoes,
      pago,
      imagemUri,
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
          <View style={styles.pickerContainer}>
            <Picker selectedValue={petId} onValueChange={(value) => setPetId(value)}>
              {pets.length === 0 && (
                <Picker.Item label="Cadastre um pet primeiro" value="" />
              )}
              {pets.map((pet) => (
                <Picker.Item
                  key={pet.id}
                  label={`${pet.nome} - ${obterDono(pet.donoId)?.nome ?? "Sem dono"}`}
                  value={pet.id}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Servico"
            value={servico}
            onChangeText={setServico}
            style={styles.input}
            placeholderTextColor="#999"
          />

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
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Preco (opcional)"
            value={preco}
            onChangeText={setPreco}
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
