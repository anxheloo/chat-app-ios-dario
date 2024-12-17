import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {apiClient} from '../../../api/apiClient';
import {GET_ALL_MESSAGES} from '../../../api/apis';
import {useAppStore} from '../../../store';
import {getToken} from '../../../utils/TokenStorage';
import MessageItem from './MessageItem';

const ChatContainer = () => {
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const updateKeys = useAppStore(state => state.updateKeys);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const flatListRef = useRef<FlatList>(null);

  // get all messages
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const token = await getToken();

        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          {id: selectedChatData?._id},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          updateFuncChat({selectedChatMessages: response.data.messages});
          console.log('These are messages:', response.data.messages);
        }
      } catch (error) {
        updateKeys({message: 'Something went wrong!'});
      }
    };

    if (selectedChatData?._id) {
      getAllMessages();
    }
  }, [selectedChatData]);

  // scroll to end
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [selectedChatMessages]);

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.chatContainer}
        data={selectedChatMessages}
        renderItem={({item}) => <MessageItem message={item} />}
        keyExtractor={item => item._id}
        initialNumToRender={10}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 20,
    gap: 10,
  },

  // dateContainer: {
  //   textAlign: 'center',
  //   color: 'gray',
  //   marginVertical: 10,
  // },
});

export default ChatContainer;
