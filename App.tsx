import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreatePersona from './src/screens/Persona/CreatePersona';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BottomSheet from './src/screens/Persona/BottomSheet';
import SelectAvatar from './src/screens/Persona/SelectAvatar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {COLORS} from './src/theme/theme';
import TestScreen from './src/screens/Persona/TestScreen';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: COLORS.LightGray2}}>
      <SafeAreaProvider>
        <StatusBar hidden />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="CreatePersona"
              // component={SelectAvatar}
              component={CreatePersona}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />  */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
