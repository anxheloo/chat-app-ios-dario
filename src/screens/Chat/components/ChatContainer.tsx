import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {useAppStore} from '../../../store';
import MessageItem from './MessageComponent/MessageItem';
import {preprocessMessages} from '../../../utils/helpers';
import ScrollToBottom from './ScrollToBottom';
import useMessages from '../../../utils/hooks/useMessages';

const ChatContainer = () => {
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const flatListRef = useRef<FlatList>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const {loadMoreItem, isLoading, scrollToBottom} = useMessages(
    flatListRef?.current,
  );

  //  Messages to render
  const messagesData = useMemo(
    () => preprocessMessages(selectedChatMessages),
    [selectedChatMessages],
  );

  // Check if user is near the bottom of the list
  const handleScroll = useCallback((event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);

    // Update the `isNearBottom` flag based on scroll position
    setTimeout(() => {
      setIsNearBottom(distanceFromBottom < 200);
    }, 200);
  }, []);

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
          onContentSizeChange={() =>
            isNearBottom && scrollToBottom(0, flatListRef?.current)
          }
          initialNumToRender={20}
          maxToRenderPerBatch={20}
        />
      </TouchableWithoutFeedback>
      {!isNearBottom && (
        <ScrollToBottom
          onPress={() => scrollToBottom(0, flatListRef?.current)}
        />
      )}
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
