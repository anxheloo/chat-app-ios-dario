import {Alert} from 'react-native';

import {apiClient} from '../api/apiClient';
import {
  GET_ALL_CALLS,
  GET_ALL_FRIENDS,
  GET_CONVERSATIONS,
  GET_USER_INFO,
  SIGNUP_ROUTES,
} from '../api/apis';

import {useAppStore} from '../store';
import {saveToken} from './TokenStorage';
import {reset} from '../navigation/navigationRef';
import {logout} from './helpers';

import {storeGeneratedPrivateKey} from './keys';
import {decryptMessage, generateKeys} from './encryption';

export const getUserInfo = async () => {
  const {updateKeys, setIsUserInfoFetched, setUserPersona, isUserInfoFetched} =
    useAppStore.getState();

  if (isUserInfoFetched) {
    return;
  }

  updateKeys({loading: true});

  try {
    const userRes = await apiClient.get(GET_USER_INFO);

    if (userRes.status !== 200) {
      throw new Error('Failed to get user info');
    }

    setUserPersona(userRes.data);
    setIsUserInfoFetched(true);

    await Promise.all([getConversations(), getFriends(), getCalls()]);
  } catch (error: any) {
    Alert.alert(
      'Error',
      error.response?.data?.message || 'Failed to get user datas.',
    );
    logout();
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
    id,
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

      console.log('This is conversations', conversations);

      if (conversations.length > 0) {
        const tempConversations = [...conversations];

        await Promise.all(
          tempConversations.map(async (conversation: any) => {
            if (conversation.lastMessage.content) {
              const otherParticipant = conversation.participants.find(
                (p: any) => p._id !== id,
              );
              const decryptedText = await decryptMessage(
                conversation.lastMessage.content,
                conversation.lastMessage.iv,
                otherParticipant?.publicKey!,
              );
              console.log('This is decrypted text', decryptedText);
              conversation.lastMessage.content = decryptedText;
            }
            return conversation;
          }),
        );

        console.log('These are tempConversations', tempConversations);

        updateConversations(current => [
          ...current.filter(
            c => !tempConversations.some((m: any) => m._id === c._id),
          ),
          ...tempConversations,
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

// =====================================================================
// Register user
// =====================================================================

export const handleRegister = async () => {
  const {setUserPersona, updateKeys, username, avatar, pin} =
    useAppStore.getState();

  updateKeys({loading: true});

  // const {public: publicKey, private: privateKey} = await generateRSAKeyPair();

  const keys = await generateKeys();

  try {
    const response = await apiClient.post(SIGNUP_ROUTES, {
      username,
      pin,
      avatar,
      publicKey: keys?.publicKey,
    });
    if (response.status === 201) {
      console.log('This is response success');
      await saveToken(response.data.token);
      await storeGeneratedPrivateKey(keys?.privateKey!, response.data.id);
      updateKeys({loading: false, message: 'Registered Successful'});
      reset('BottomTabNavigation');
    }
  } catch (error: any) {
    setUserPersona({username: '', pin: '', avatar: 0});
    Alert.alert('Register Error', error?.response.data.message);
  } finally {
    updateKeys({loading: false, message: 'Register Failed'});
  }
};
