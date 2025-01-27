import React, {useEffect} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';
import {useAppStore} from '../../store';
import {SafeAreaView} from 'react-native-safe-area-context';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import DeleteMsg from '../../components/modals/DeleteMsg';

const Chat = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const loading = useAppStore(state => state.loading);

  useEffect(() => {
    return () => {
      updateFuncChat({selectedChatMessages: [], selectedChatData: null});
    };
  }, [updateFuncChat]);

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

        {loading && <FullScreenLoader version="absolute" />}
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
