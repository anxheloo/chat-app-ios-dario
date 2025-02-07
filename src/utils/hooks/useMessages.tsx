import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {apiClient} from '../../api/apiClient';
import {GET_ALL_MESSAGES} from '../../api/apis';
import {useAppStore} from '../../store';

const useMessages = (flatListRef: any) => {
  const {updateSelectedChatMessages, selectedChatData} = useAppStore();

  const [pagination, setPagination] = useState({
    isLoading: false,
    hasMore: true,
    page: 0,
  });

  const getAllMessages = async () => {
    const {isLoading, hasMore, page} = pagination;

    if (isLoading || !hasMore) {
      return;
    }

    setPagination(prev => ({...prev, isLoading: true}));

    try {
      const response = await apiClient.post(GET_ALL_MESSAGES, {
        id: selectedChatData?._id,
        page,
      });

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
        // else {
        //   setPagination(prev => ({
        //     ...prev,
        //     hasMore: false,
        //   }));
        // }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get messages', [
        {text: 'Try again', onPress: refetch},
      ]);
    } finally {
      setPagination(prev => ({...prev, isLoading: false}));
    }
  };

  const loadMoreItem = () => {
    if (!pagination.isLoading && pagination.hasMore) {
      getAllMessages();
    }
  };

  const refetch = useCallback(() => {
    setPagination(prev => ({...prev, page: 0, isLoading: false}));
    updateSelectedChatMessages(() => []);
    getAllMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to end function
  // eslint-disable-next-line @typescript-eslint/no-shadow
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
  }, [flatListRef, scrollToBottom]);

  useEffect(() => {
    if (selectedChatData?._id) {
      getAllMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatData]);

  return {loadMoreItem, isLoading: pagination.isLoading, scrollToBottom};
};

export default useMessages;
