import React, {useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';
import {useAppStore} from '../../store';

const Chat = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  useEffect(() => {
    return () => {
      console.log('unmounting');
      updateFuncChat({selectedChatMessages: []});
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{flex: 1}}
      keyboardVerticalOffset={50}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ChatHeader />
          <ChatContainer />
          <ChatFooter />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Chat;
