import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import MessageItem from './MessageItem';
import moment from 'moment';

const ChatContainer = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const updateKeys = useAppStore(state => state.updateKeys);
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const token = useAppStore(state => state.token);
  const flatListRef = useRef<FlatList>(null);
  // const loading = useAppStore(state => state.loading);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  console.log('This is selected Chat Data:', selectedChatData);

  // Get all messages function
  const getAllMessages = async () => {
    if (isLoading || !hasMore) return;
    // if (loading || !hasMore) return;

    setIsLoading(true);
    // updateKeys({loading: true});

    try {
      const response = await apiClient.post(
        GET_ALL_MESSAGES,
        {id: selectedChatData?._id, page},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const {messages, hasMore: updatedHasMore} = response.data;

        if (messages.length > 0) {
          updateFuncChat({
            selectedChatMessages: [...messages, ...selectedChatMessages],
          });
          setPage(prev => prev + 1);
        }
        setHasMore(updatedHasMore);
      }
    } catch (error) {
      // updateKeys({message: 'Something went wrong!', loading: false});
      setIsLoading(false);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        // updateKeys({loading: false});
      }, 2000);
    }
  };

  // Get all messages the moment we mount
  useEffect(() => {
    if (selectedChatData?._id) {
      getAllMessages();
    }
  }, [selectedChatData]);

  // Scroll to end
  useEffect(() => {
    if (flatListRef.current && selectedChatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 500); // Add a slight delay to ensure the layout is finalized
    }
  }, [selectedChatMessages]);

  // Preprocess messages to include date labels
  const preprocessMessages = () => {
    let lastMessageDate: string | null = null;

    return selectedChatMessages.map(message => {
      // const currentMessageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const currentMessageDate = moment(message.createdAt).format('YYYY-MM-DD');
      const showDate = currentMessageDate !== lastMessageDate;
      lastMessageDate = currentMessageDate;

      return {
        ...message,
        showDate,
      };
    });
  };
  const processedMessages = preprocessMessages();

  // Render message item
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

  // Render loader on scroll up to show other messages
  const renderLoader = () => {
    return isLoading ? (
      // return loading ? (
      <View>
        <ActivityIndicator size={'small'} color={'black'} />
      </View>
    ) : null;
  };

  // Load more items on scroll up
  const loadMoreItem = () => {
    if (!isLoading && hasMore) {
      // if (!loading && hasMore) {
      getAllMessages();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.chatContainer}
        data={processedMessages}
        renderItem={renderMessageItem}
        keyExtractor={item => item._id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
        // onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
        initialNumToRender={20}
        ListHeaderComponent={renderLoader}
        onStartReachedThreshold={0.5}
        onStartReached={loadMoreItem}
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
});

export default ChatContainer;
