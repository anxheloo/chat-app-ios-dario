import React, {useCallback, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import PersonasList from '../../components/BottomSheet/PersonasList';
import CallList from './CallList';
import {NavigationProps} from '../../utils/types';

type Props = {
  navigation: NavigationProps;
};

const Calls: React.FC<Props> = ({navigation}) => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const openBottomSheet = useCallback(
    () => bottomSheetRef.current?.expand(),
    [bottomSheetRef],
  );
  const closeBottomSheet = useCallback(
    () => bottomSheetRef.current?.close(),
    [bottomSheetRef],
  );

  return (
    <>
      <CallList openBottomSheet={openBottomSheet} navigation={navigation} />
      <BottomSheetWrapper ref={bottomSheetRef}>
        <PersonasList cancel={closeBottomSheet} />
      </BottomSheetWrapper>
    </>
  );
};

export default Calls;
