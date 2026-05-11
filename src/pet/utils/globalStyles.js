import { StyleSheet } from "react-native";

// ── Paleta de cores ──
export const cores = {
  primario: "#4CAF50",
  primarioClaro: "#e8f5e9",
  secundario: "#2f80ed",
  secundarioClaro: "#eef4ff",
  perigo: "#F44336",
  perigoClaro: "#fff1f0",
  aviso: "#FF9800",
  avisoClaro: "#fff4e5",
  historico: "#2196F3",
  historicoClaro: "#eef6ff",

  fundo: "#f4f7f5",
  card: "#fff",
  borda: "#e6e6e6",
  bordaClara: "#eee",
  input: "#f5f5f5",

  texto: "#333",
  textoSecundario: "#555",
  textoTerciario: "#777",
  textoPlaceholder: "#999",
  textoBranco: "#fff",
};

// ── Espaçamentos ──
export const espacamento = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ── Border Radius ──
export const raio = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  redondo: 999,
};

// ── Tipografia ──
export const tipografia = {
  titulo: { fontSize: 20, fontWeight: "700", color: cores.texto },
  tituloGrande: { fontSize: 24, fontWeight: "800", color: cores.texto },
  subtitulo: { fontSize: 16, fontWeight: "700", color: cores.texto },
  corpo: { fontSize: 14, color: cores.textoSecundario },
  legenda: { fontSize: 12, color: cores.textoTerciario },
  label: { fontSize: 13, color: cores.textoTerciario },
  botao: { fontSize: 16, fontWeight: "700", color: cores.textoBranco },
};

// ── Estilos reutilizáveis ──
export const estilosGlobais = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  lista: {
    padding: espacamento.lg,
    paddingBottom: 100,
  },

  botaoPrimario: {
    backgroundColor: cores.primario,
    borderRadius: raio.md,
    padding: espacamento.md + 2,
    alignItems: "center",
    marginBottom: espacamento.md,
  },

  botaoSecundario: {
    backgroundColor: cores.secundarioClaro,
    borderRadius: raio.md,
    padding: espacamento.md + 2,
    alignItems: "center",
  },

  botaoPerigo: {
    backgroundColor: cores.perigo,
    borderRadius: raio.md,
    padding: espacamento.md + 2,
    alignItems: "center",
  },

  textoBotao: {
    color: cores.textoBranco,
    fontSize: 16,
    fontWeight: "700",
  },

  textoSecundario: {
    color: cores.secundario,
    fontSize: 16,
    fontWeight: "700",
  },

  vazio: {
    color: cores.textoTerciario,
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
  },

  input: {
    backgroundColor: cores.input,
    borderRadius: raio.md,
    padding: espacamento.md,
    marginBottom: espacamento.md,
    fontSize: 14,
    color: cores.texto,
  },

  inputErro: {
    borderWidth: 1.5,
    borderColor: cores.perigo,
  },

  textoErro: {
    color: cores.perigo,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});
