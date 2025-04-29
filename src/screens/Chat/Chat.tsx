import React, {useEffect} from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import DeleteMsg from '../../components/modals/DeleteMsg';

import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';

import {stopAndClearRecorder} from '../../utils/voiceMessage';
import {
  clearCacheAndChatData,
  updateCurrentConversation,
} from '../../utils/message';

const Chat = () => {
  useEffect(() => {
    console.log('✅ ChatContainer Mounted');

    updateCurrentConversation();
    return () => {
      console.log('❌ ChatContainer Unmounted');
      clearCacheAndChatData();
      stopAndClearRecorder();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ChatHeader />
        <ChatContainer />
        <ChatFooter />
      </KeyboardAvoidingView>
      <FullScreenLoader version={'absolute'} />
      <DeleteMsg />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: 'white'},

  container: {
    flex: 1,
  },
});

export default Chat;
