import React from 'react';
import Content from './Content';
import {NavigationProps} from '../../utils/types';
import {useSocket} from '../../utils/useSocket';
import useProfile from '../../utils/hooks/useProfile';

type MessagesScreenProps = {
  navigation: NavigationProps;
};

const Messages: React.FC<MessagesScreenProps> = ({navigation}) => {
  useSocket();
  const {handleSettingClick} = useProfile(navigation);

  const openBottomSheet = () => {
    handleSettingClick('PersonasList');
  };

  return (
    <>
      <Content openBottomSheet={openBottomSheet} navigation={navigation} />

      {/* {bottomSheetType !== null && bottomSheetType?.length > 0 && (
        <BottomSheetWrapper ref={bottomSheetRef}>
          {bottomSheetType === 'PersonasList' && (
            <PersonasList cancel={cancel} navigation={navigation} />
          )}
        </BottomSheetWrapper>
      )} */}
    </>
  );
};

export default Messages;
