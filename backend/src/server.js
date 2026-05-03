import http from "node:http";
import { novoId } from "./db.js";
import {
  atualizarAgendamento,
  atualizarDono,
  atualizarHistorico,
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

function encontrarDono(donos, nome, telefone) {
  return donos.find(
    (dono) =>
      dono.nome.trim().toLowerCase() === String(nome).trim().toLowerCase() ||
      dono.telefone.trim() === String(telefone).trim()
  );
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

    if (req.method === "POST" && url.pathname === "/pets") {
      const body = await lerBody(req);
      const dados = await carregarDados();
      let donoId = body.donoId;
      let novoDono = null;

      if (!donoId) {
        const donoExistente = encontrarDono(dados.donos, body.dono, body.telefone);
        donoId = donoExistente?.id ?? novoId("dono");

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
        id: novoId("pet"),
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
        id: novoId("ag"),
        petId: body.petId,
        servico: String(body.servico ?? "").trim(),
        data: String(body.data ?? "").trim(),
        horario: String(body.horario ?? "").trim(),
        pago: Boolean(body.pago),
        preco: String(body.preco ?? "").trim() || "0,00",
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
      const pacoteId = novoId("pacote");
      const pacote = {
        id: pacoteId,
        petId: body.petId,
        quantidadeBanhos: quantidade,
        dataPrimeiroBanho: String(body.data ?? "").trim(),
        horario: String(body.horario ?? "").trim(),
        servico: String(body.servico ?? "Banho").trim()
      };
      const agendamentos = Array.from({ length: quantidade }, (_, index) => ({
        id: novoId("ag"),
        petId: body.petId,
        servico: pacote.servico,
        data: adicionarDias(pacote.dataPrimeiroBanho, index * 7),
        horario: pacote.horario,
        pago: Boolean(body.pago),
        preco: String(body.preco ?? "").trim() || "0,00",
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
        dados: await atualizarAgendamento(partes[1], await lerBody(req))
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
      const dados = await concluirAgendamento(
        partes[1],
        new Date().toLocaleDateString("pt-BR")
      );

      if (!dados) {
        enviarJson(res, 404, { error: "Agendamento nao encontrado" });
        return;
      }

      enviarJson(res, 200, { dados });
      return;
    }

    if (req.method === "PATCH" && partes[0] === "historico" && partes[1]) {
      enviarJson(res, 200, {
        dados: await atualizarHistorico(partes[1], await lerBody(req))
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
