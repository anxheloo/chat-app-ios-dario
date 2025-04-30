import './src/types/pollyfills';

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import useCheckToken from './src/utils/hooks/useCheckToken';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import MainNavigation from './src/navigation/MainNavigation';
import InternetPopup from './src/components/Internet/InternetPopup';
import PinModal from './src/components/modals/PinModal';
import ConfirmationModal from './src/components/modals/ConfirmationModal';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from './src/components/BottomSheet/CustomBottomSheetModal';

import SplashScreen from 'react-native-splash-screen';

const App = () => {
  // Get the token from Async Storage and update the state in memory for later use.
  useCheckToken();

  // When the app is opened, the splash screen will be shown until the app is ready
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
      <PinModal />
      <ConfirmationModal />
    </GestureHandlerRootView>
  );
};

export default App;
