import { useMemo, useState } from "react";
import { Image, SectionList, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "../../components/appScreen";
import CardHistorico from "../../components/cardHistorico";
import DetalhesModal from "../../components/detalhesModal";
import Menu from "../../components/navbar";
import SearchBar from "../../components/searchBar";
import { usePetShop } from "../../context/PetShopContext";
import {
  dataBRParaDate,
  dataHoraParaTempo,
  dataHoraTextoParaTempo,
  dataValidaBR,
  formatarDataDigitada,
  formatarHorario,
  formatarPreco,
  horarioValido,
} from "../../utils/formatadores";
import { selecionarImagemLeve } from "../../utils/selecionarImagem";
import { textoIndicadorPacote } from "../../utils/indicadorPacote";
import { opcoesServicos } from "../../utils/servicos";
import { styles } from "./styles";

function tituloDiaServico(dataBR) {
  const data = dataBRParaDate(dataBR);

  if (!data) {
    return dataBR;
  }

  const semana = data.toLocaleDateString("pt-BR", { weekday: "long" });
  return `${semana}, ${dataBR}`;
}

function agruparHistoricoPorDia(registros) {
  const porDia = new Map();

  for (const registro of registros) {
    const dia = registro.data?.trim() || "Sem data";
    const lista = porDia.get(dia) ?? [];
    lista.push(registro);
    porDia.set(dia, lista);
  }

  return Array.from(porDia.entries())
    .sort(
      (a, b) =>
        dataHoraParaTempo({ data: b[0], horario: "00:00" }) -
        dataHoraParaTempo({ data: a[0], horario: "00:00" })
    )
    .map(([dia, itens]) => ({
      title: tituloDiaServico(dia),
      data: itens,
    }));
}

function Historico() {
  const { historico, obterPet, obterDono, atualizarHistorico, carregandoDados } = usePetShop();
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
  const [formErros, setFormErros] = useState({});
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

  const historicoFiltrado = historico
    .filter((registro) => {
      const pet = obterPet(registro.petId);
      const dono = pet ? obterDono(pet.donoId) : null;
      return contemBusca(
        pet?.nome,
        dono?.nome,
        dono?.telefone,
        registro.servico,
        registro.data,
        registro.concluidoEm,
        registro.pagoEm
      );
    })
    .sort((a, b) => {
      const concluidoB = b.concluidoEm
        ? dataHoraTextoParaTempo(`${b.concluidoEm} ${b.horario}`)
        : dataHoraParaTempo(b);
      const concluidoA = a.concluidoEm
        ? dataHoraTextoParaTempo(`${a.concluidoEm} ${a.horario}`)
        : dataHoraParaTempo(a);

      return concluidoB - concluidoA;
    });

  const historicoAgrupado = useMemo(
    () => agruparHistoricoPorDia(historicoFiltrado),
    [historicoFiltrado]
  );

  function abrirRegistro(registro) {
    setRegistroSelecionado(registro);
    setEditando(false);
    setFormErros({});
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
    setFormErros({});
  }

  function salvarRegistro() {
    if (!registroSelecionado) {
      return;
    }

    const erros = {};

    if (!dataValidaBR(form.data)) {
      erros.data = "Informe uma data agendada valida.";
    }

    if (form.concluidoEm && !dataValidaBR(form.concluidoEm)) {
      erros.concluidoEm = "Informe uma data de conclusao valida.";
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
      concluidoEm: form.concluidoEm.trim(),
      preco: formatarPreco(form.preco) || "0,00",
      lamina: form.lamina.trim() || "-",
      observacoes: form.observacoes.trim() || "Sem observacoes.",
      imagemUri: form.imagemUri,
    };

    atualizarHistorico(registroSelecionado.id, dados);
    setRegistroSelecionado((atual) => (atual ? { ...atual, ...dados } : atual));
    setEditando(false);
  }

  return (
    <AppScreen style={styles.container}>
      <Menu />

      <SectionList
        sections={historicoAgrupado}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <SearchBar
            valor={busca}
            onChangeText={setBusca}
            placeholder="Buscar por pet, dono, telefone ou servico"
          />
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregandoDados
              ? "Carregando histórico..."
              : "Nenhum atendimento concluído ainda."}
          </Text>
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.secaoCabecalho}>
            <Text style={styles.secaoTitulo}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const pet = obterPet(item.petId);

          return (
            <CardHistorico
              nomePet={pet?.nome ?? "Pet removido"}
              servico={item.servico}
              lamina={item.lamina}
              preco={item.preco}
              data={item.concluidoEm ?? item.data}
              rotuloTipoServico={textoIndicadorPacote(item)}
              ehPacote={Boolean(item.pacoteId)}
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
            label: "Tipo",
            valor: registroSelecionado
              ? textoIndicadorPacote(registroSelecionado)
              : "",
          },
          {
            label: "Data agendada",
            valor: registroSelecionado
              ? `${registroSelecionado.data} - ${registroSelecionado.horario}`
              : "",
          },
          { label: "Concluido em", valor: registroSelecionado?.concluidoEm },
          { label: "Pago em", valor: registroSelecionado?.pagoEm },
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
            tipo: "select",
            opcoes: opcoesServicos,
            onChangeText: (valor) =>
              setForm((atual) => ({ ...atual, servico: valor })),
          },
          {
            label: "Data agendada",
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
                setForm((atual) => ({ ...atual, horario: valor }));
                setFormErros((atuais) => ({ ...atuais, horario: "" }));
              },
            onBlur: () =>
              setForm((atual) => ({
                ...atual,
                horario: formatarHorario(atual.horario),
              })),
          },
          {
            label: "Concluido em",
            valor: form.concluidoEm,
            tipo: "date",
            erro: formErros.concluidoEm,
            onChangeText: (valor) =>
              {
                setForm((atual) => ({
                  ...atual,
                  concluidoEm: formatarDataDigitada(valor),
                }));
                setFormErros((atuais) => ({ ...atuais, concluidoEm: "" }));
              },
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
    </AppScreen>
  );
}

export default Historico;
