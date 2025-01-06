import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CreatePersona from '../screens/Persona/CreatePersona';
import CreatePin from '../screens/Persona/CreatePin';
import BottomTabNavigation from './BottomTabNavigation';
import Login from '../screens/Login/Login';
import Chat from '../screens/Chat/Chat';
import ScannerScreen from '../screens/Scanner/ScannerScreen';

const MainNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={{flex: 1}}>
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
            name="BottomTabNavigation"
            component={BottomTabNavigation}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default MainNavigation;
