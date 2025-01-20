import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {apiClient} from '../../../api/apiClient';
import {GET_ALL_MESSAGES} from '../../../api/apis';
import {useAppStore} from '../../../store';
import MessageItem from './MessageComponent/MessageItem';
import {preprocessMessages} from '../../../utils/helpers';
import ScrollToBottom from './ScrollToBottom';

const ChatContainer = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const token = useAppStore(state => state.token);
  const flatListRef = useRef<FlatList>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

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
          // Remove duplicate messages
          const uniqueMessages = [
            ...messages,
            ...selectedChatMessages.filter(
              msg => !messages.some((m: any) => m._id === msg._id),
            ),
          ];

          updateFuncChat({
            selectedChatMessages: uniqueMessages,
          });

          setIsLoading(false);
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

  // Scroll to end function
  const scrollToBottom = useCallback((time: number = 0) => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, time);
    }
  }, []);

  // Scroll to end on mount
  useEffect(() => {
    scrollToBottom(1000);
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

  // Check if user is near the bottom of the list
  const handleScroll = (event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);

    // Update the `isNearBottom` flag based on scroll position
    setTimeout(() => {
      setIsNearBottom(distanceFromBottom < 200);
    }, 200);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshing={isLoading}
          onRefresh={loadMoreItem}
          ref={flatListRef}
          contentContainerStyle={styles.chatContainer}
          data={messagesData}
          renderItem={({item}) => <MessageItem message={item} />}
          keyExtractor={item => item._id}
          onContentSizeChange={() => isNearBottom && scrollToBottom()}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
        />
      </TouchableWithoutFeedback>
      {!isNearBottom && <ScrollToBottom onPress={scrollToBottom} />}
    </>
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
