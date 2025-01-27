import React, {useCallback, useRef} from 'react';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import PersonasList from '../../components/BottomSheet/PersonasList';
import BottomSheet from '@gorhom/bottom-sheet';
import Content from './Content';
import {NavigationProps} from '../../utils/types';
// import useConversations from '../../utils/hooks/useConversations';
import {useSocket} from '../../utils/useSocket';

type MessagesScreenProps = {
  navigation: NavigationProps;
};

const Messages: React.FC<MessagesScreenProps> = ({navigation}) => {
  useSocket();
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
      <Content openBottomSheet={openBottomSheet} navigation={navigation} />
      <BottomSheetWrapper ref={bottomSheetRef}>
        <PersonasList cancel={closeBottomSheet} navigation={navigation} />
      </BottomSheetWrapper>
    </>
  );
};

export default Messages;
