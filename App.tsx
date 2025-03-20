import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import MainNavigation from './src/navigation/MainNavigation';
import InternetPopup from './src/components/Internet/InternetPopup';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from './src/components/BottomSheet/CustomBottomSheetModal';
import {AnimationProvider} from './src/store/HeaderAnimationContext';

const App = () => {
  return (
    <AnimationProvider>
      <GestureHandlerRootView style={styles.gestureHandlerContainer}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <StatusBar backgroundColor="white" barStyle={'dark-content'} />
            <MainNavigation />
            <InternetPopup />
            <CustomBottomSheetModal />
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </AnimationProvider>
  );
};

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    flex: 1,
  },
});

export default App;
