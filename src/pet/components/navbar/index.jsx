import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const items = [
  { label: "Home", icon: "home", path: "/" },
  { label: "Pets", icon: "paw", path: "/pets" },
  { label: "Donos", icon: "person", path: "/donos" },
  { label: "Agendamentos", icon: "calendar", path: "/agendamentos" },
  { label: "Historico", icon: "document-text", path: "/historico" },
  { label: "Dashboard", icon: "bar-chart", path: "/dashboard" },
];

function Menu() {
  const router = useRouter();
  const pathname = usePathname();

  function abrirRota(path) {
    if (pathname !== path) {
      router.push(path);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {items.map((item) => {
          const ativo = pathname === item.path;

          return (
            <TouchableOpacity
              key={item.path}
              style={styles.card}
              onPress={() => abrirRota(item.path)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={ativo ? "#2f80ed" : "#333"}
              />
              <Text style={[styles.titulo, ativo && styles.tituloAtivo]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default Menu;
