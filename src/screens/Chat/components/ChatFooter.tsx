import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReusableInput from '../../../components/ReusableInput';
import AddIcon from '../../../assets/icons/Chat/AddIcon';

const ChatFooter = () => {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.footerContainer}>
      <ReusableInput
        placeholder="Write"
        value={message}
        onChange={setMessage}
        icon2={<AddIcon width={21.5} height={21.5} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default ChatFooter;
