import React, {useEffect} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppStore} from '../../store';

import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import DeleteMsg from '../../components/modals/DeleteMsg';

import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';
import {getAudioPlayer} from '../../utils/voiceMessage';

const Chat = () => {
  const updateMicSlice = useAppStore(state => state.updateMicSlice);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  useEffect(() => {
    console.log('✅ ChatContainer Mounted');

    return () => {
      console.log('❌ ChatContainer Unmounted');
      updateFuncChat({selectedChatMessages: [], selectedChatData: null});

      // Stop the audio player if it's still playing
      const audioPlayer = getAudioPlayer();
      audioPlayer.stopPlayer();
      audioPlayer.removePlayBackListener();
      updateMicSlice({
        playingAudioId: null,
        isPlaying: false,
        recordSecs: 0,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={-30}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <ChatHeader />
          <ChatContainer />
          <ChatFooter />
        </View>
        <FullScreenLoader version={'absolute'} />
      </SafeAreaView>
      <DeleteMsg />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: 'white'},

  container: {
    flex: 1,
  },
});

export default Chat;
