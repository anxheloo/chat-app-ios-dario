import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {apiClient} from '../../api/apiClient';
import {GET_ALL_MESSAGES} from '../../api/apis';
import {useAppStore} from '../../store';

const useMessages = (flatListRef: any) => {
  const token = useAppStore(state => state.token);
  const updateSelectedChatMessages = useAppStore(
    state => state.updateSelectedChatMessages,
  );
  const selectedChatData = useAppStore(state => state.selectedChatData);

  const [pagination, setPagination] = useState({
    isLoading: false,
    hasMore: true,
    page: 0,
  });

  const refetch = useCallback(() => {
    setPagination(prev => ({...prev, page: 0, isLoading: false}));
    updateSelectedChatMessages(() => []);
    getAllMessages();
  }, []);

  const getAllMessages = useCallback(async () => {
    const {isLoading, hasMore, page} = pagination;

    if (isLoading || !hasMore) {
      return;
    }

    setPagination(prev => ({...prev, isLoading: true}));

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
          updateSelectedChatMessages(current => [
            ...messages,
            ...current.filter(
              msg => !messages.some((m: any) => m._id === msg._id),
            ),
          ]);

          setPagination(prev => ({
            ...prev,
            page: prev.page + 1,
            hasMore: updatedHasMore,
          }));
        }
        // setHasMore(updatedHasMore);
      }
    } catch (error) {
      // Alert.alert('Error', 'Failed to get messages', [
      //   {text: 'Try again', onPress: refetch},
      // ]);
      Alert.alert('Alert Title', 'My Alert Msg', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Try again', onPress: refetch},
      ]);
    } finally {
      setPagination(prev => ({...prev, isLoading: false}));
    }
  }, [pagination, selectedChatData?._id, token, updateSelectedChatMessages]);

  const loadMoreItem = useCallback(() => {
    if (!pagination.isLoading && pagination.hasMore) {
      getAllMessages();
    }
  }, [pagination]);

  // Scroll to end function
  const scrollToBottom = useCallback((time: number = 0, flatListRef: any) => {
    if (flatListRef) {
      setTimeout(() => {
        flatListRef?.scrollToEnd({animated: true});
      }, time);
    }
  }, []);

  // Scroll to end on mount
  useEffect(() => {
    scrollToBottom(1000, flatListRef);
  }, []);

  useEffect(() => {
    if (selectedChatData?._id) {
      getAllMessages();
    }
  }, [selectedChatData]);

  return {loadMoreItem, isLoading: pagination.isLoading, scrollToBottom};
};

export default useMessages;
