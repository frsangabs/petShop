import http from "node:http";
import { novoId } from "./db.js";
import { gerarDashboard } from "./dashboard.js";
import {
  formatarDataHoraAtual,
  formatarHorario,
  formatarPreco
} from "./formatadores.js";
import {
  atualizarAgendamento,
  atualizarDono,
  atualizarHistorico,
  atualizarPacote,
  atualizarPet,
  carregarDados,
  concluirAgendamento,
  criarAgendamento,
  criarPacoteComAgendamentos,
  removerAgendamento,
  salvarPetComDono,
  usandoPostgres
} from "./repository.js";

const port = Number(process.env.PORT ?? 3333);

function enviarJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

async function lerBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function parseDataBR(valor) {
  const [dia, mes, ano] = String(valor).split("/").map(Number);
  return new Date(ano, mes - 1, dia);
}

function adicionarDias(dataBR, dias) {
  const data = parseDataBR(dataBR);
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString("pt-BR");
}

function encontrarDonoPorTelefone(donos, telefone) {
  return donos.find(
    (dono) => dono.telefone.trim() === String(telefone).trim()
  );
}

function normalizarAtendimento(body) {
  return {
    ...body,
    ...(body.horario !== undefined ? { horario: formatarHorario(body.horario) } : {}),
    ...(body.preco !== undefined ? { preco: formatarPreco(body.preco) || "0,00" } : {}),
    ...(body.pago === true && !body.pagoEm ? { pagoEm: formatarDataHoraAtual() } : {}),
    ...(body.pago === false ? { pagoEm: "" } : {})
  };
}

function normalizarPacote(body) {
  return {
    ...body,
    ...(body.bonusConcluido === true && !body.bonusConcluidoEm
      ? { bonusConcluidoEm: formatarDataHoraAtual() }
      : {}),
    ...(body.bonusConcluido === false ? { bonusConcluidoEm: "" } : {})
  };
}

async function roteador(req, res) {
  if (req.method === "OPTIONS") {
    enviarJson(res, 200, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const partes = url.pathname.split("/").filter(Boolean);

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      enviarJson(res, 200, { ok: true, postgres: usandoPostgres() });
      return;
    }

    if (req.method === "GET" && url.pathname === "/dados") {
      enviarJson(res, 200, await carregarDados());
      return;
    }

    if (req.method === "GET" && url.pathname === "/dashboard") {
      enviarJson(
        res,
        200,
        gerarDashboard(await carregarDados(), {
          inicio: url.searchParams.get("inicio"),
          fim: url.searchParams.get("fim")
        })
      );
      return;
    }

    if (req.method === "POST" && url.pathname === "/pets") {
      const body = await lerBody(req);
      const dados = await carregarDados();
      let donoId = body.donoId;
      let novoDono = null;

      if (!donoId) {
        const donoExistente = encontrarDonoPorTelefone(dados.donos, body.telefone);
        donoId = donoExistente?.id ?? body.novoDonoId ?? novoId("dono");

        if (!donoExistente) {
          novoDono = {
            id: donoId,
            nome: String(body.dono ?? "").trim(),
            telefone: String(body.telefone ?? "").trim(),
            busca: false
          };
        }
      }

      const pet = {
        id: body.id ?? novoId("pet"),
        nome: String(body.nome ?? "").trim(),
        raca: String(body.raca ?? "").trim(),
        porte: body.porte,
        donoId,
        foto: body.foto ?? ""
      };

      enviarJson(res, 201, { dados: await salvarPetComDono(pet, novoDono), pet });
      return;
    }

    if (req.method === "PATCH" && partes[0] === "pets" && partes[1]) {
      enviarJson(res, 200, { dados: await atualizarPet(partes[1], await lerBody(req)) });
      return;
    }

    if (req.method === "PATCH" && partes[0] === "donos" && partes[1]) {
      enviarJson(res, 200, { dados: await atualizarDono(partes[1], await lerBody(req)) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/agendamentos") {
      const body = await lerBody(req);
      const agendamento = {
        id: body.id ?? novoId("ag"),
        petId: body.petId,
        servico: String(body.servico ?? "").trim(),
        data: String(body.data ?? "").trim(),
        horario: formatarHorario(body.horario),
        pago: Boolean(body.pago),
        pagoEm: body.pago ? formatarDataHoraAtual() : "",
        preco: formatarPreco(body.preco) || "0,00",
        lamina: String(body.lamina ?? "").trim() || "-",
        observacoes: String(body.observacoes ?? "").trim() || "Sem observacoes.",
        imagemUri: body.imagemUri ?? "",
        pacoteId: null,
        numeroBanho: null
      };

      enviarJson(res, 201, {
        dados: await criarAgendamento(agendamento),
        agendamento
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/pacotes") {
      const body = await lerBody(req);
      const quantidade = Math.min(Math.max(Number(body.quantidadeBanhos), 1), 4);
      const pacoteId = body.id ?? body.pacoteId ?? novoId("pacote");
      const pacote = {
        id: pacoteId,
        petId: body.petId,
        quantidadeBanhos: quantidade,
        dataPrimeiroBanho: String(body.data ?? "").trim(),
        horario: formatarHorario(body.horario),
        servico: "Banho",
        bonusServico: String(body.bonusServico ?? "Tosa Higiênica").trim(),
        bonusConcluido: false,
        bonusConcluidoEm: "",
        criadoEm: body.criadoEm ?? new Date().toISOString()
      };
      const agendamentos = Array.from({ length: quantidade }, (_, index) => ({
        id: body.agendamentoIds?.[index] ?? novoId("ag"),
        petId: body.petId,
        servico: pacote.servico,
        data: adicionarDias(pacote.dataPrimeiroBanho, index * 7),
        horario: pacote.horario,
        pago: Boolean(body.pago),
        pagoEm: body.pago ? formatarDataHoraAtual() : "",
        preco: formatarPreco(body.preco) || "0,00",
        lamina: String(body.lamina ?? "").trim() || "-",
        observacoes:
          index === 0
            ? String(body.observacoes ?? "").trim() || "Pacote de banhos."
            : "Banho gerado pelo pacote.",
        imagemUri: index === 0 ? body.imagemUri ?? "" : "",
        pacoteId,
        numeroBanho: index + 1
      }));

      enviarJson(res, 201, {
        dados: await criarPacoteComAgendamentos(pacote, agendamentos),
        pacote,
        agendamentos
      });
      return;
    }

    if (req.method === "PATCH" && partes[0] === "agendamentos" && partes[1]) {
      enviarJson(res, 200, {
        dados: await atualizarAgendamento(
          partes[1],
          normalizarAtendimento(await lerBody(req))
        )
      });
      return;
    }

    if (req.method === "PATCH" && partes[0] === "pacotes" && partes[1]) {
      enviarJson(res, 200, {
        dados: await atualizarPacote(partes[1], normalizarPacote(await lerBody(req)))
      });
      return;
    }

    if (req.method === "DELETE" && partes[0] === "agendamentos" && partes[1]) {
      enviarJson(res, 200, { dados: await removerAgendamento(partes[1]) });
      return;
    }

    if (
      req.method === "POST" &&
      partes[0] === "agendamentos" &&
      partes[1] &&
      partes[2] === "concluir"
    ) {
      const resultado = await concluirAgendamento(
        partes[1],
        new Date().toLocaleDateString("pt-BR")
      );

      if (!resultado) {
        enviarJson(res, 404, { error: "Agendamento nao encontrado" });
        return;
      }

      if (resultado.pagamentoPendente) {
        enviarJson(res, 409, { error: "Pagamento pendente" });
        return;
      }

      enviarJson(res, 200, { dados: resultado });
      return;
    }

    if (req.method === "PATCH" && partes[0] === "historico" && partes[1]) {
      enviarJson(res, 200, {
        dados: await atualizarHistorico(
          partes[1],
          normalizarAtendimento(await lerBody(req))
        )
      });
      return;
    }

    enviarJson(res, 404, { error: "Rota nao encontrada" });
  } catch (error) {
    enviarJson(res, 500, { error: error.message });
  }
}

http.createServer(roteador).listen(port, () => {
  const modo = usandoPostgres() ? "PostgreSQL" : "JSON local";
  console.log(`Petshop backend rodando em http://localhost:${port} (${modo})`);
});
