import React from 'react';
import {navigationRef} from './navigationRef';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabNavigation from './BottomTabNavigation';

import {RootStackParamList} from '../utils/types';

import CreatePersona from '../screens/Persona/CreatePersona';
import CreatePin from '../screens/Persona/CreatePin';
import Login from '../screens/Login/Login';
import Chat from '../screens/Chat/Chat';
import ScannerScreen from '../screens/Scanner/ScannerScreen';
import ScannedUser from '../screens/Scanner/ScannedUser';
import FullScreenMedia from '../screens/FullScreenMedia/FullScreenMedia';
import JoinScreen from '../screens/Calls/JoinScreen';
import {useSocket} from '../utils/useSocket';

const MainNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  useSocket();

  console.log('Inside MainNavigation');

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          animation: 'fade',
        }}>
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
        <Stack.Screen
          name="JoinScreen"
          component={JoinScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
