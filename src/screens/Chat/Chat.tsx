import React, {useEffect} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';
import {useAppStore} from '../../store';
import {SafeAreaView} from 'react-native-safe-area-context';

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
      keyboardVerticalOffset={-30}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
