import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { PetShopProvider } from '@/src/pet/context/PetShopContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PetShopProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pets" options={{ headerShown: false }} />
          <Stack.Screen name="donos" options={{ headerShown: false }} />
          <Stack.Screen name="agendamentos" options={{ headerShown: false }} />
          <Stack.Screen name="historico" options={{ headerShown: false }} />
          <Stack.Screen name="criar-pet" options={{ headerShown: false }} />
          <Stack.Screen name="novo-agendamento" options={{ headerShown: false }} />
          <Stack.Screen name="detalhe-agendamento/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </PetShopProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
