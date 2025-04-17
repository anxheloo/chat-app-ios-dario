import React, {useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppStore} from '../../store';

import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import DeleteMsg from '../../components/modals/DeleteMsg';

import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';

import {stopAndClearRecorder} from '../../utils/voiceMessage';
import {updateCurrentConversation} from '../../utils/message';
import {getPrivateKey} from '../../utils/keys';

const Chat = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const setUserPersona = useAppStore(state => state.setUserPersona);

  useEffect(() => {
    console.log('✅ ChatContainer Mounted');

    updateCurrentConversation();
    getPrivateKey().then(key => {
      key && setUserPersona({privateKey: key});
    });

    return () => {
      console.log('❌ ChatContainer Unmounted');
      updateFuncChat({selectedChatMessages: [], selectedChatData: null});
      stopAndClearRecorder();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        // keyboardVerticalOffset={-30}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <ChatHeader />
              <ChatContainer />
            </>
          </TouchableWithoutFeedback>
          <ChatFooter />
        </View>
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
