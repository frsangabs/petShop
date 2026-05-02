import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Agendamentos from './src/pet/pages/agendamento/agendamento';
import Donos from './src/pet/pages/donos/donos';
import Historico from './src/pet/pages/historico/historico';
import Home from './src/pet/pages/home.jsx';
import Pets from './src/pet/pages/pets/pets';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Pets" component={Pets} />
        <Stack.Screen name="Donos" component={Donos} />
        <Stack.Screen name="Agendamentos" component={Agendamentos} />
        <Stack.Screen name="Historico" component={Historico} options={{ title: 'Histórico' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
