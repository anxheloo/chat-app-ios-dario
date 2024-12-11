import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainNavigation from './src/navigation/MainNavigation';
import {PortalProvider} from '@gorhom/portal';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar hidden />
        <PortalProvider>
          <MainNavigation />
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
