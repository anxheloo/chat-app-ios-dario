import {useEffect} from 'react';
// import {Alert} from 'react-native';
// import {apiClient} from '../../api/apiClient';
// import {GET_CONVERSATIONS} from '../../api/apis';
import {useAppStore} from '../../store';
import {getConversations} from '../DataFetching';

const useConversations = (flatListRef: any) => {
  //   const updateConversations = useAppStore(state => state.updateConversations);
  const pagination = useAppStore(state => state.conversationPagination);
  //   const getConversations = async () => {
  //     const {isLoading, hasMore, page} = pagination;

  //     if (isLoading || !hasMore) {
  //       return;
  //     }

  //     setPagination(prev => ({...prev, isLoading: true}));

  //     try {
  //       const response = await apiClient.post(GET_CONVERSATIONS, {
  //         page,
  //       });

  //       if (response.status === 200) {
  //         const {conversations, hasMore: updatedHasMore} = response.data;

  //         if (conversations.length > 0) {
  //           updateConversations(current => [
  //             ...current.filter(
  //               c => !conversations.some((m: any) => m._id === c._id),
  //             ),
  //             ...conversations,
  //           ]);

  //           setPagination(prev => ({
  //             ...prev,
  //             page: prev.page + 1,
  //             hasMore: updatedHasMore,
  //           }));
  //         }
  //       }
  //     } catch (error) {
  //       Alert.alert('Error', 'Failed to get conversations', [
  //         {text: 'Try again', onPress: refetch},
  //       ]);
  //     } finally {
  //       setPagination(prev => ({...prev, isLoading: false}));
  //     }
  //   };

  const loadMoreItem = () => {
    if (!pagination.isLoading && pagination.hasMore) {
      getConversations();
    }
  };

  //   const refetch = () => {
  //     setPagination(prev => ({...prev, page: 0, isLoading: false}));
  //     updateConversations(() => []);
  //     getConversations();
  //   };

  // Scroll to end function
  // eslint-disable-next-line @typescript-eslint/no-shadow
  //   const scrollToTop = useCallback((time: number = 0, flatListRef: any) => {
  //     if (flatListRef) {
  //       setTimeout(() => {
  //         flatListRef?.scrollToEnd({animated: true});
  //       }, time);
  //     }
  //   }, []);

  // Scroll to end on mount
  //   useEffect(() => {
  //     scrollToTop(1000, flatListRef);
  //   }, [flatListRef, scrollToTop]);

  useEffect(() => {
    // getConversations();
    getConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loadMoreItem,
    isLoading: pagination.isLoading,
    // scrollToTop,
    // refetch,
  };
};

export default useConversations;
