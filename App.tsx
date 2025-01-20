import React from 'react';
import {StatusBar, StatusBarStyle, View} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainNavigation from './src/navigation/MainNavigation';
import {PortalProvider} from '@gorhom/portal';
import InternetPopup from './src/components/Internet/InternetPopup';

const App = () => {
  const CustomStatusBar = ({
    backgroundColor,
    barStyle,
  }: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  }) => {
    const insets = useSafeAreaInsets();

    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          height: insets.top,
        }}>
        <StatusBar
          animated={true}
          backgroundColor={backgroundColor}
          barStyle={barStyle}
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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

        <PortalProvider>
          <MainNavigation />
        </PortalProvider>
        {/* <InternetPopup /> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
