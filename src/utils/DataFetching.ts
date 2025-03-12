import {Alert} from 'react-native';

import {apiClient} from '../api/apiClient';
import {
  GET_ALL_CALLS,
  GET_ALL_FRIENDS,
  GET_CONVERSATIONS,
  GET_USER_INFO,
} from '../api/apis';

import {useAppStore} from '../store';

export const getUserInfo = async () => {
  const {
    updateKeys,
    updateFuncChat,
    setUserInfoStatus,
    setUserPersona,
    isUserInfoFetched,
    setConversationPagination,
    setFriendsPagination,
    setCallsPagination,
    updateCalls,
  } = useAppStore.getState();

  if (isUserInfoFetched) {
    return;
  }

  updateKeys({loading: true});

  try {
    const [userRes, friendsRes, conversationsRes, callsRes] = await Promise.all(
      [
        apiClient.get(GET_USER_INFO),
        apiClient.post(GET_ALL_FRIENDS, {page: 0}),
        apiClient.post(GET_CONVERSATIONS, {page: 0}),
        apiClient.post(GET_ALL_CALLS, {page: 0}),
      ],
    );

    if (
      userRes.status === 200 &&
      friendsRes.status === 200 &&
      conversationsRes.status === 200 &&
      callsRes.status === 200
    ) {
      setUserInfoStatus(true);
      setUserPersona(userRes.data);
      updateFuncChat({
        conversations: conversationsRes.data.conversations,
        friends: friendsRes.data.friends,
      });

      updateCalls(() => [...callsRes.data.calls]);

      setConversationPagination({
        page: 1,
        hasMore: conversationsRes.data.hasMore,
        isLoading: false,
      });

      setFriendsPagination({
        page: 1,
        hasMore: friendsRes.data.hasMore,
        isLoading: false,
      });

      setCallsPagination({
        page: 1,
        hasMore: callsRes.data.hasMore,
        isLoading: false,
      });
    }
  } catch (error: any) {
    Alert.alert(
      'Error',
      error.response?.data?.message || 'Failed to get user datas.',
    );
  } finally {
    updateKeys({loading: false});
  }
};

// =====================================================================
// CONVERSATIONS
// =====================================================================
export const getConversations = async () => {
  const {
    updateConversations,
    conversationPagination: pagination,
    setConversationPagination: setPagination,
  } = useAppStore.getState();

  const {isLoading, hasMore, page} = pagination;

  if (isLoading || !hasMore) {
    return;
  }

  setPagination({
    isLoading: true,
  });

  try {
    const response = await apiClient.post(GET_CONVERSATIONS, {
      page,
    });

    if (response.status === 200) {
      const {conversations, hasMore: updatedHasMore} = response.data;

      if (conversations.length > 0) {
        updateConversations(current => [
          ...current.filter(
            c => !conversations.some((m: any) => m._id === c._id),
          ),
          ...conversations,
        ]);

        setPagination({
          page: pagination.page + 1,
          isLoading: false,
          hasMore: updatedHasMore,
        });
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to get conversations', [
      {text: 'Try again', onPress: refetchConversations},
    ]);
  } finally {
    setPagination({isLoading: false});
  }
};

export const refetchConversations = () => {
  const {setConversationPagination: setPagination, updateConversations} =
    useAppStore.getState();

  setPagination({
    isLoading: false,
    page: 0,
    hasMore: true,
  });

  updateConversations(() => []);
  getConversations();
};

export const loadMoreConversations = () => {
  const {conversationPagination: pagination} = useAppStore.getState();

  const {isLoading, hasMore} = pagination;

  if (!isLoading && hasMore) {
    getConversations();
  }
};

// =====================================================================
// Friends
// =====================================================================
export const getFriends = async () => {
  const {
    updateFriends,
    friendsPagination: pagination,
    setFriendsPagination: setPagination,
  } = useAppStore.getState();

  const {isLoading, hasMore, page} = pagination;

  if (isLoading || !hasMore) {
    return;
  }

  setPagination({
    isLoading: true,
  });

  try {
    const response = await apiClient.post(GET_ALL_FRIENDS, {
      page,
    });

    if (response.status === 200) {
      const {friends, hasMore: updatedHasMore} = response.data;

      if (friends.length > 0) {
        updateFriends(current => [
          ...current.filter(c => !friends.some((m: any) => m._id === c._id)),
          ...friends,
        ]);

        setPagination({
          page: pagination.page + 1,
          isLoading: false,
          hasMore: updatedHasMore,
        });
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to get friends', [
      {text: 'Try again', onPress: refetchFriends},
    ]);
  } finally {
    setPagination({isLoading: false});
  }
};

export const refetchFriends = () => {
  const {setFriendsPagination: setPagination, updateFriends} =
    useAppStore.getState();

  setPagination({
    isLoading: false,
    page: 0,
    hasMore: true,
  });

  updateFriends(() => []);
  getFriends();
};

export const loadMoreFriends = () => {
  const {friendsPagination: pagination} = useAppStore.getState();

  const {isLoading, hasMore} = pagination;

  if (!isLoading && hasMore) {
    getFriends();
  }
};

// =====================================================================
// Calls
// =====================================================================

export const getCalls = async () => {
  const {
    updateCalls,
    callsPagination: pagination,
    setCallsPagination: setPagination,
  } = useAppStore.getState();

  const {isLoading, hasMore, page} = pagination;

  if (isLoading || !hasMore) {
    return;
  }

  setPagination({
    isLoading: true,
  });

  try {
    const response = await apiClient.post(GET_ALL_CALLS, {
      page,
    });

    if (response.status === 200) {
      const {calls, hasMore: updatedHasMore} = response.data;

      if (calls.length > 0) {
        updateCalls(current => [
          ...current.filter(c => !calls.some((m: any) => m._id === c._id)),
          ...calls,
        ]);

        setPagination({
          page: pagination.page + 1,
          isLoading: false,
          hasMore: updatedHasMore,
        });
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to get calls', [
      {text: 'Try again', onPress: refetchFriends},
    ]);
  } finally {
    setPagination({isLoading: false});
  }
};

export const refetchCalls = () => {
  const {setCallsPagination: setPagination, updateCalls} =
    useAppStore.getState();

  setPagination({
    isLoading: false,
    page: 0,
    hasMore: true,
  });

  updateCalls(() => []);
  getCalls();
};

export const loadMoreCalls = () => {
  const {callsPagination: pagination} = useAppStore.getState();

  const {isLoading, hasMore} = pagination;

  if (!isLoading && hasMore) {
    getCalls();
  }
};
