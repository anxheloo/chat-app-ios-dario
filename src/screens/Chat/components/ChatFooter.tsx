import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import ReusableInput from '../../../components/ReusableInput';
import AddIcon from '../../../assets/icons/Chat/AddIcon';
import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';
import {useAppStore} from '../../../store';

const ChatFooter = () => {
  const socket = useAppStore(state => state.socket);
  const id = useAppStore(state => state.id);
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    console.log('INside contact sendMessage');

    if (message.trim() === '') return;

    socket.emit('sendMessage', {
      sender: id,
      content: message,
      recipient: selectedChatData?._id,
      messageType: 'text',
      fileUrl: undefined,
    });

    setMessage('');
  };

  return (
    <View style={styles.footerContainer}>
      <View style={{flex: 1}}>
        <ReusableInput
          placeholder="Write"
          value={message}
          onChange={setMessage}
          icon2={<AddIcon width={21.5} height={21.5} />}
          onSubmitEditing={sendMessage}
        />
      </View>

      <TouchableOpacity>
        <MicrophoneIcon width={24} height={24} />
      </TouchableOpacity>
      <TouchableOpacity>
        <CameraIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 12,
  },
});

export default ChatFooter;
