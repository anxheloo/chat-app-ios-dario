import 'react-native-get-random-values';

if (typeof global.crypto === 'undefined') {
  global.crypto = {} as Crypto;
}

if (typeof global.crypto.getRandomValues === 'undefined') {
  global.crypto.getRandomValues =
    require('react-native-get-random-values').getRandomValues;
}

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import MainNavigation from './src/navigation/MainNavigation';
import InternetPopup from './src/components/Internet/InternetPopup';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from './src/components/BottomSheet/CustomBottomSheetModal';

import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <StatusBar backgroundColor="white" barStyle={'dark-content'} />
          <MainNavigation />
          <InternetPopup />
          <CustomBottomSheetModal />
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
