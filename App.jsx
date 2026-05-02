import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Agendamentos from './src/pages/Agendamentos';
import Donos from './src/pages/Donos';
import Historico from './src/pages/Historico';
import Home from './src/pet/pages/home.jsx';
import Pets from './src/pet/pages/pets.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Pets" component={Pets} />
        <Stack.Screen name="Donos" component={Donos} />
        <Stack.Screen name="Agendamentos" component={Agendamentos} />
        <Stack.Screen name="Historico" component={Historico} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}