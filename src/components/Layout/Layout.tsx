import React, {memo} from 'react';

import {
  // Keyboard,
  StyleSheet,
  // TouchableWithoutFeedback,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Header from '../Header/Header';
import {COLORS} from '../../theme/theme';
import FullScreenLoader from '../Loading/FullScreenLoader';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = memo(({children}) => {
  const insets = useSafeAreaInsets();

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={[styles.safeAreaStyles, {paddingTop: insets.top}]}>
      <Header />
      {children}
      <FullScreenLoader version={'absolute'} />
    </View>
    /* </TouchableWithoutFeedback> */
  );
});

const styles = StyleSheet.create({
  safeAreaStyles: {backgroundColor: COLORS.White, flex: 1},
});

export default Layout;
