import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import CreatePersona from '../screens/Persona/CreatePersona';
import CreatePin from '../screens/Persona/CreatePin';
import BottomTabNavigation from './BottomTabNavigation';
import Login from '../screens/Login/Login';
import Chat from '../screens/Chat/Chat';
import ScannerScreen from '../screens/Scanner/ScannerScreen';
import ScannedUser from '../screens/Scanner/ScannedUser';
import {RootStackParamList} from '../utils/types';
import FullScreenMedia from '../screens/FullScreenMedia/FullScreenMedia';

const MainNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreatePersona"
          component={CreatePersona}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreatePin"
          component={CreatePin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FullScreenMedia"
          component={FullScreenMedia}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScannedUser"
          component={ScannedUser}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default MainNavigation;
