/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../Header/Header';
import BottomSheetWrapper from '../BottomSheet/BottomSheetWrapper';
import PersonasList from '../BottomSheet/PersonasList';
import BottomSheet from '@gorhom/bottom-sheet';
import {useAppStore} from '../../store';
import useProfile from '../../utils/hooks/useProfile';
import ChangeUsername from '../BottomSheet/ChangeUsername';
import SelectAvatar from '../BottomSheet/SelectAvatar';
import UpdatePin from '../BottomSheet/UpdatePin';
import UpdateDissapear from '../BottomSheet/UpdateDissapear';
import QRCodeModal from '../BottomSheet/QRCodeModal';
import CustomBottomSheetModal from '../BottomSheet/CustomBottomSheetModal';
import {useNavigation} from '@react-navigation/native';
// import { NavigationProps } from '../../utils/types';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({children}) => {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaStyles}>
        <Header />
        {children}
        <CustomBottomSheetModal navigation={navigation} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeAreaStyles: {backgroundColor: 'white', flex: 1},
});

export default Layout;
