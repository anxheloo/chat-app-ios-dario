import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const ChatContainer = () => {
  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View style={styles.chatContainer}>
        <Text>asdfadsf</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
});

export default ChatContainer;
