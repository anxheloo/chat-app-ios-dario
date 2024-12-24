import React, {useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        // keyboardVerticalOffset={-10}
      >
        <View style={styles.container}>
          <ChatHeader />
          <ChatContainer />
          <ChatFooter />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Chat;
