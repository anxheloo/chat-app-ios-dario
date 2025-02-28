import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import MainNavigation from './src/navigation/MainNavigation';
import InternetPopup from './src/components/Internet/InternetPopup';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from './src/components/BottomSheet/CustomBottomSheetModal';
const App = () => {
  /* {Platform.OS === 'ios' ? (
          <CustomStatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          />
          ) : (
            <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle={'dark-content'}
            />
            )} */

  console.log('THis is app.js:');

  return (
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
  );
};

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    flex: 1,
  },
});

export default App;
