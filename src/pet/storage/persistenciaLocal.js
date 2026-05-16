import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "petshop-mvp-dados-v2";
export const PENDING_STORAGE_KEY = "petshop-mvp-pendencias-v1";

export function montarSnapshot(dados) {
  return {
    donos: dados.donos ?? [],
    pets: dados.pets ?? [],
    agendamentos: dados.agendamentos ?? [],
    historico: dados.historico ?? [],
    pacotes: dados.pacotes ?? [],
  };
}

export async function carregarDadosLocais() {
  try {
    const salvo = await AsyncStorage.getItem(STORAGE_KEY);

    if (!salvo) {
      return null;
    }

    return montarSnapshot(JSON.parse(salvo));
  } catch (error) {
    if (__DEV__) {
      console.warn("[persistencia] Falha ao carregar dados locais:", error);
    }
    return null;
  }
}

export async function salvarDadosLocais(dados) {
  try {
    const serializado = JSON.stringify(montarSnapshot(dados));
    await AsyncStorage.setItem(STORAGE_KEY, serializado);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn("[persistencia] Falha ao salvar dados locais:", error);
    }
    return false;
  }
}

export async function carregarPendenciasLocais() {
  try {
    const salvo = await AsyncStorage.getItem(PENDING_STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : [];
  } catch (error) {
    if (__DEV__) {
      console.warn("[persistencia] Falha ao carregar pendencias:", error);
    }
    return [];
  }
}

export async function salvarPendenciasLocais(pendencias) {
  try {
    const serializado = JSON.stringify(pendencias);
    await AsyncStorage.setItem(PENDING_STORAGE_KEY, serializado);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn("[persistencia] Falha ao salvar pendencias:", error);
    }
    return false;
  }
}
