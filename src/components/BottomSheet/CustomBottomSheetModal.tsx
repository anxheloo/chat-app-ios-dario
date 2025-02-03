import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme/theme';
import {useAppStore} from '../../store';
import PersonasList from './PersonasList';
import QRCodeModal from './QRCodeModal';
import UpdatePin from './UpdatePin';
import UpdateDissapear from './UpdateDissapear';
import ChangeUsername from './ChangeUsername';
import SelectAvatar from './SelectAvatar';
import useProfile from '../../utils/hooks/useProfile';
import {NavigationProps} from '../../utils/types';

const CustomBottomSheetModal = ({
  navigation,
}: {
  navigation: NavigationProps;
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {updateProfilePic} = useProfile(navigation);
  const bottomSheetType = useAppStore(state => state.bottomSheetType);
  const updateKeys = useAppStore(state => state.updateKeys);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  useEffect(() => {
    if (bottomSheetType && bottomSheetRef?.current) {
      bottomSheetRef.current?.present();
    } else if (bottomSheetRef?.current) {
      bottomSheetRef.current?.dismiss();
    }
  }, [bottomSheetType]);

  const closeBottomSheet = useCallback(() => {
    updateKeys({bottomSheetType: null});
    bottomSheetRef.current?.dismiss();
  }, [updateKeys]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={0}
        {...props}
      />
    ),
    [],
  );

  const renderContent = () => {
    switch (bottomSheetType) {
      case 'username':
        return <ChangeUsername cancel={closeBottomSheet} />;
      case 'qr-code':
        return <QRCodeModal cancel={closeBottomSheet} />;
      case 'pin':
        return <UpdatePin cancel={closeBottomSheet} />;
      case 'clock':
        return <UpdateDissapear cancel={closeBottomSheet} />;
      case 'avatar':
        return (
          <SelectAvatar cancel={closeBottomSheet} setFunc={updateProfilePic} />
        );
      case 'start-conversation':
        return (
          <PersonasList cancel={closeBottomSheet} navigation={navigation} />
        );
      default:
        return null;
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onDismiss={closeBottomSheet}
      index={3}
      handleIndicatorStyle={styles.handleIndicator}
      handleStyle={styles.indicatorContainer}>
      <BottomSheetView style={styles.contentContainer}>
        {renderContent()}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.LightGray2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },

  indicatorContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.LightGray2,
  },

  handleIndicator: {
    backgroundColor: COLORS.LightGray,
  },
});

export default CustomBottomSheetModal;
