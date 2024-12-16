import React from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import ChatHeader from './components/ChatHeader';
import ChatContainer from '../Messages/ChatContainer';
import ChatFooter from './components/ChatFooter';

const Chat = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Chat;
