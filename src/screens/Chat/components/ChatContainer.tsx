import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {apiClient} from '../../../api/apiClient';
import {GET_ALL_MESSAGES} from '../../../api/apis';
import {useAppStore} from '../../../store';
import {getToken} from '../../../utils/TokenStorage';
import MessageItem from './MessageItem';
import moment from 'moment';

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

  const preprocessMessages = () => {
    let lastMessageDate: string | null = null;

    return selectedChatMessages.map(message => {
      const currentMessageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = currentMessageDate !== lastMessageDate;
      lastMessageDate = currentMessageDate;

      return {
        ...message,
        showDate, // Flag for showing the date label
      };
    });
  };

  const processedMessages = preprocessMessages();

  const renderMessageItem = ({item}: {item: any}) => (
    <View>
      {item.showDate && (
        <Text style={styles.dateLabel}>
          {moment(item.timestamp).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'MMM Do, YYYY',
          })}
        </Text>
      )}
      <MessageItem message={item} />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.chatContainer}
        // data={selectedChatMessages}
        // renderItem={({item}) => <MessageItem message={item} />}
        data={processedMessages} // Use preprocessed messages
        renderItem={renderMessageItem}
        keyExtractor={item => item._id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
        onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
        initialNumToRender={20}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 10,
  },

  dateLabel: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
    fontSize: 12,
  },

  // dateContainer: {
  //   textAlign: 'center',
  //   color: 'gray',
  //   marginVertical: 10,
  // },
});

export default ChatContainer;
