import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
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
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const updateKeys = useAppStore(state => state.updateKeys);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const token = useAppStore(state => state.token);
  const flatListRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // get all messages
  const getAllMessages = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const response = await apiClient.post(
        GET_ALL_MESSAGES,
        {id: selectedChatData?._id, page: page},
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
      updateKeys({message: 'Something went wrong!'});
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // get all messages
  useEffect(() => {
    if (selectedChatData?._id) {
      getAllMessages();
    }
  }, [selectedChatData]);

  // scroll to end
  useEffect(() => {
    if (flatListRef.current && selectedChatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 200); // Add a slight delay to ensure the layout is finalized
    }
  }, [selectedChatMessages]);

  // preprocess messages
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

  // render loader on scroll up to show other messages
  const renderLoader = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator size={'small'} color={'black'} />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    if (!isLoading && hasMore) {
      getAllMessages();
    }
  };

  return (
    // <SafeAreaView style={{flex: 1}}>
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
    // </SafeAreaView>
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
