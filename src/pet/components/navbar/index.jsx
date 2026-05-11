import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { usePetShop } from "../../context/PetShopContext";
import { styles } from "./styles";

const itensPrincipais = [
  { label: "Início", icon: "home", path: "/" },
  { label: "Pets", icon: "paw", path: "/pets" },
  { label: "Agenda", icon: "calendar", path: "/agendamentos" },
];

const itensMais = [
  { label: "Donos", icon: "person", path: "/donos" },
  { label: "Histórico", icon: "document-text", path: "/historico" },
  { label: "Dashboard", icon: "bar-chart", path: "/dashboard" },
];

function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { backendOnline, carregandoDados, sincronizando } = usePetShop();
  const [maisAberto, setMaisAberto] = useState(false);
  const maisAtivo = itensMais.some((item) => pathname === item.path);

  const alturaBarra = 74 + Math.max(insets.bottom, 8);

  function abrirRota(path) {
    if (pathname !== path) {
      router.replace(path);
    }
    setMaisAberto(false);
  }

  const statusTexto = carregandoDados
    ? "Carregando dados"
    : sincronizando
      ? "Salvando alterações"
      : backendOnline
        ? ""
        : "Sem conexão com os outros aparelhos";

  return (
    <View style={[styles.container, { height: alturaBarra, paddingBottom: Math.max(insets.bottom, 8) }]}>
      {statusTexto ? (
        <View
          style={[
            styles.status,
            backendOnline || carregandoDados || sincronizando
              ? styles.statusNeutro
              : styles.statusOffline,
          ]}
          accessibilityRole="text"
        >
          <Ionicons
            name={backendOnline || carregandoDados || sincronizando ? "cloud-done" : "cloud-offline"}
            size={14}
            color={backendOnline || carregandoDados || sincronizando ? "#2f80ed" : "#d97800"}
          />
          <Text
            style={[
              styles.statusTexto,
              backendOnline || carregandoDados || sincronizando
                ? styles.statusTextoNeutro
                : styles.statusTextoOffline,
            ]}
          >
            {statusTexto}
          </Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {itensPrincipais.map((item) => {
          const ativo = pathname === item.path;

          return (
            <Pressable
              key={item.path}
              style={({ pressed }) => [
                styles.card,
                ativo && styles.cardAtivo,
                pressed && styles.cardPressionado,
              ]}
              onPress={() => abrirRota(item.path)}
              accessibilityRole="tab"
              accessibilityLabel={`Abrir ${item.label}`}
              accessibilityState={{ selected: ativo }}
              hitSlop={8}
            >
              <Ionicons
                name={item.icon}
                size={23}
                color={ativo ? "#2f80ed" : "#333"}
              />
              <Text style={[styles.titulo, ativo && styles.tituloAtivo]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          style={({ pressed }) => [
            styles.card,
            maisAtivo && styles.cardAtivo,
            pressed && styles.cardPressionado,
          ]}
          onPress={() => setMaisAberto(true)}
          accessibilityRole="tab"
          accessibilityLabel="Abrir mais opções"
          accessibilityState={{ selected: maisAtivo, expanded: maisAberto }}
          hitSlop={8}
        >
          <Ionicons name="menu" size={23} color={maisAtivo ? "#2f80ed" : "#333"} />
          <Text style={[styles.titulo, maisAtivo && styles.tituloAtivo]}>Mais</Text>
        </Pressable>
      </View>

      <Modal
        visible={maisAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setMaisAberto(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setMaisAberto(false)}
            accessibilityRole="button"
            accessibilityLabel="Fechar menu de mais opções"
          />
          <View style={[styles.maisCard, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.maisCabecalho}>
              <Text style={styles.maisTitulo}>Mais opções</Text>
              <Pressable
                style={styles.fecharMais}
                onPress={() => setMaisAberto(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar menu"
                hitSlop={8}
              >
                <Text style={styles.fecharMaisTexto}>X</Text>
              </Pressable>
            </View>

            {itensMais.map((item) => {
              const ativo = pathname === item.path;

              return (
                <Pressable
                  key={item.path}
                  style={({ pressed }) => [
                    styles.maisItem,
                    ativo && styles.maisItemAtivo,
                    pressed && styles.cardPressionado,
                  ]}
                  onPress={() => abrirRota(item.path)}
                  accessibilityRole="menuitem"
                  accessibilityLabel={`Abrir ${item.label}`}
                  accessibilityState={{ selected: ativo }}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={ativo ? "#2f80ed" : "#333"}
                  />
                  <Text style={[styles.maisTexto, ativo && styles.tituloAtivo]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Menu;
