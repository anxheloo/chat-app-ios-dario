import React, {useCallback} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Avatar from '../../components/Persona/Avatar';
import {COLORS} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';
import BtnGroup from './components/BtnGroup';
import {useAppStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../utils/types';

const OutgoingCallScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const {selectedChatData, updateCallState, socket, id} =
    useAppStore.getState();

  const cancelCall = useCallback(() => {
    updateCallState({
      isCalling: false,
      callAccepted: false,
      callRejected: false,
    });

    socket.emit('cancelCall', {
      recipientId: selectedChatData?._id,
      callerId: id,
    });
    navigation.goBack();
  }, [id, navigation, selectedChatData?._id, socket, updateCallState]);

  return (
    <SafeAreaView style={styles.content}>
      <StatusBar hidden />

      <View style={styles.container}>
        <Avatar
          backgroundColor={COLORS.LightGray2}
          width={70}
          height={70}
          avatarWidth={52.5}
          avatarHeight={52.5}
          src={Number(selectedChatData?.avatar)}
        />
        <ReusableText fontSize={26} fontWeight={700} color="white">
          @{selectedChatData?.username}
        </ReusableText>
      </View>

      <View style={styles.container}>
        <ReusableText fontSize={14} fontWeight={400} color="white">
          Calling...
        </ReusableText>
        <BtnGroup onMiddlePress={cancelCall} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // alignItems: 'center',
    gap: 20,
    padding: 20,
  },

  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 30,
  },
});

export default OutgoingCallScreen;
