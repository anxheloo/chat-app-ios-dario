import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainNavigation from './src/navigation/MainNavigation';
import InternetPopup from './src/components/Internet/InternetPopup';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  // const CustomStatusBar = ({
  //   backgroundColor,
  //   barStyle,
  // }: {
  //   backgroundColor: string;
  //   barStyle: StatusBarStyle;
  // }) => {
  //   const insets = useSafeAreaInsets();

  //   return (
  //     <View
  //       style={{
  //         backgroundColor: backgroundColor,
  //         height: insets.top,
  //       }}>
  //       <StatusBar
  //         animated={true}
  //         backgroundColor={backgroundColor}
  //         barStyle={barStyle}
  //       />
  //     </View>
  //   );
  // };

  return (
    <GestureHandlerRootView style={styles.gestureHandlerContainer}>
      {/* <PortalProvider> */}
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          {/* {Platform.OS === 'ios' ? (
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
            )} */}

          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle={'dark-content'}
          />

          <MainNavigation />
          <InternetPopup />
        </SafeAreaProvider>
      </BottomSheetModalProvider>
      {/* </PortalProvider> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    flex: 1,
  },
});

export default App;
