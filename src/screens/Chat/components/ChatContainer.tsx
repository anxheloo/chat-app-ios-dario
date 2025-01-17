import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {apiClient} from '../../../api/apiClient';
import {GET_ALL_MESSAGES} from '../../../api/apis';
import {useAppStore} from '../../../store';
import MessageItem from './MessageComponent/MessageItem';
import {preprocessMessages} from '../../../utils/helpers';

const ChatContainer = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const token = useAppStore(state => state.token);
  const flatListRef = useRef<FlatList>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Get all messages function
  const getAllMessages = async () => {
    if (isLoading || !hasMore) return;

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
          // const existingMessageIds = new Set(
          //   selectedChatMessages.map(msg => msg._id),
          // );

          // const uniqueMessages = [
          //   ...messages.filter((msg: any) => !existingMessageIds.has(msg._id)),
          //   ...selectedChatMessages,
          // ];

          const uniqueMessages = [
            ...messages,
            ...selectedChatMessages.filter(
              msg => !messages.some((m: any) => m._id === msg._id),
            ),
          ];

          updateFuncChat({
            selectedChatMessages: uniqueMessages,
          });

          setPage(prev => prev + 1);
        }
        setHasMore(updatedHasMore);
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
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
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 500); // Add a slight delay to ensure the layout is finalized
    }
  }, []);

  //  Messages to render
  const messagesData = useMemo(
    () => preprocessMessages(selectedChatMessages),
    [selectedChatMessages],
  );

  // Load more items on scroll up
  const loadMoreItem = () => {
    if (!isLoading && hasMore) {
      getAllMessages();
    }
  };

  const renderLoader = () => {
    return isLoading ? (
      <ActivityIndicator size={'small'} color={'black'} />
    ) : null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlatList
        refreshing={isLoading}
        onRefresh={loadMoreItem}
        ref={flatListRef}
        contentContainerStyle={styles.chatContainer}
        data={messagesData}
        renderItem={({item}) => <MessageItem message={item} />}
        keyExtractor={item => item._id}
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
});

export default ChatContainer;
