import React, {useEffect, useRef} from 'react';
import {Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';
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
// import { NavigationProps } from '../../utils/types';

type Props = {
  children: React.ReactNode;
  navigation: any;
};

const Layout: React.FC<Props> = ({children, navigation}) => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const bottomSheetType = useAppStore(state => state.bottomSheetType);
  const updateKeys = useAppStore(state => state.updateKeys);
  const {cancel, updateProfilePic} = useProfile(navigation);

  useEffect(() => {
    if (bottomSheetRef.current) {
      updateKeys({bottomSheetRef: bottomSheetRef.current});
    }
  }, [updateKeys]);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeAreaStyles}>
          <Header />
          {children}
        </SafeAreaView>
      </TouchableWithoutFeedback>

      {bottomSheetType !== null && bottomSheetType?.length > 0 && (
        <BottomSheetWrapper ref={bottomSheetRef}>
          {bottomSheetType === 'PersonasList' && (
            <PersonasList cancel={cancel} navigation={navigation} />
          )}
          {bottomSheetType === 'username' && <ChangeUsername cancel={cancel} />}
          {bottomSheetType === 'avatar' && (
            <SelectAvatar cancel={cancel} setFunc={updateProfilePic} />
          )}
          {bottomSheetType === 'pin' && <UpdatePin cancel={cancel} />}
          {bottomSheetType === 'clock' && <UpdateDissapear cancel={cancel} />}
          {bottomSheetType === 'qr-code' && <QRCodeModal cancel={cancel} />}
        </BottomSheetWrapper>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaStyles: {backgroundColor: 'white', flex: 1},
});

export default Layout;
