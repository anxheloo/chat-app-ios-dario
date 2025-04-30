import {Alert} from 'react-native';

import {apiClient} from '../api/apiClient';
import {
  ADD_FRIEND,
  DELETE_DATA,
  GET_ALL_CALLS,
  GET_ALL_FRIENDS,
  GET_CONVERSATIONS,
  GET_USER_INFO,
  SIGNUP_ROUTES,
} from '../api/apis';

import {useAppStore} from '../store';
import {removeToken, saveToken} from './TokenStorage';
import {goBack, replace, reset} from '../navigation/navigationRef';

import {
  decryptMessage,
  encryptPrivateKey,
  generateKeys,
  storeEncryptedPrivateKey,
} from './encryption';

import {Contact} from '../types/types';

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

      if (conversations.length > 0) {
        const tempConversations = [...conversations];
        try {
          await Promise.all(
            tempConversations.map(async (conversation: any) => {
              if (
                conversation.lastMessage &&
                conversation.lastMessage.content
              ) {
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
        } catch (error) {
          console.log('This is error inside getConversations', error);
        }

        updateConversations(current => [
          ...current.filter(
            c => !tempConversations.some((m: any) => m._id === c._id),
          ),
          ...tempConversations,
        ]);
      }

      setPagination({
        page: conversations.length > 0 ? pagination.page + 1 : pagination.page,
        isLoading: false,
        hasMore: updatedHasMore,
      });
    }
  } catch (error) {
    setPagination({isLoading: false});
    Alert.alert('Error', 'Failed to get conversations', [
      {text: 'Try again', onPress: refetchConversations},
    ]);
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
      }

      setPagination({
        page: friends.length > 0 ? pagination.page + 1 : pagination.page,
        isLoading: false,
        hasMore: updatedHasMore,
      });
    }
  } catch (error) {
    setPagination({isLoading: false});
    Alert.alert('Error', 'Failed to get friends', [
      {text: 'Try again', onPress: refetchFriends},
    ]);
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
      }

      setPagination({
        page: calls.length > 0 ? pagination.page + 1 : pagination.page,
        isLoading: false,
        hasMore: updatedHasMore,
      });
    }
  } catch (error) {
    setPagination({isLoading: false});
    Alert.alert('Error', 'Failed to get calls', [
      {text: 'Try again', onPress: refetchFriends},
    ]);
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

  // 1. Generate keys
  const keys = await generateKeys();

  try {
    // 2. Register user
    const response = await apiClient.post(SIGNUP_ROUTES, {
      username,
      pin,
      avatar,
      publicKey: keys?.publicKey,
    });
    if (response.status === 201) {
      console.log('This is response success');

      // 3. Encrypt private key
      const encryptedPrivateKey = encryptPrivateKey(keys?.privateKey!, pin);

      console.log('This is encryptedPrivateKey', encryptedPrivateKey);

      // 4. Store encrypted private key
      await storeEncryptedPrivateKey(encryptedPrivateKey, response.data.id);
      // 5. Save token locally and in memory
      await saveToken(response.data.token);
      // 6. Update users private key in memory for later use
      setUserPersona({privateKey: keys?.privateKey!});
      updateKeys({loading: false, message: 'Registered Successful'});
      // 7. Reset navigation to BottomTabNavigation
      reset('BottomTabNavigation');
    }
  } catch (error: any) {
    setUserPersona({username: '', pin: '', avatar: 0});
    Alert.alert('Register Error', error?.response.data.message);
  } finally {
    updateKeys({loading: false, message: 'Register Failed'});
  }
};

// =====================================================================
// Delete or Wipe account
// =====================================================================
export const deleteOrWipe = async (type: string) => {
  const {
    updateFuncChat,
    setIsUserInfoFetched,
    setUserPersona,
    updateCalls,
    setCallsPagination,
    disconnectSocket,
    updateKeys,
  } = useAppStore.getState();

  updateKeys({loading: true});

  try {
    console.log('THis is type: ', type);
    const response = await apiClient.post(`${DELETE_DATA}?type=${type}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      //  Remove token locally and in memory, remove users private key
      if (type === 'delete') {
        await removeToken();
        disconnectSocket();
        // Reset user persona for new User
        setUserPersona({
          username: '',
          pin: '',
          avatar: 0,
          id: '',
          isActive: null,
          publicKey: null,
        });
        // User info needs to be fetched again by the new user if app state stays active during logout/login
        setIsUserInfoFetched(false);

        // Reset Calls and Calls Pagination
        reset('CreatePersona');
      }

      // Reset Conversations, Friends Pagination
      updateFuncChat({
        conversations: [],
        friends: [],
        conversationPagination: {page: 0, hasMore: true, isLoading: false},
        friendsPagination: {page: 0, hasMore: true, isLoading: false},
      });

      updateCalls(() => []);

      setCallsPagination({
        page: 0,
        hasMore: true,
        isLoading: false,
      });

      Alert.alert(
        'Success',
        type === 'delete'
          ? 'Account successfully deleted'
          : 'Account successfully wiped',
      );
    }
  } catch (error) {
    console.error('Error logout:', error);
    Alert.alert('Error', 'Failed to logout');
  } finally {
    updateKeys({loading: false});
  }
};

// =====================================================================
// Add Friend
// =====================================================================
export const addFriend = async (scannedUser: Contact | null) => {
  const {socket, id, updateFriends} = useAppStore.getState();

  try {
    const res = await apiClient.post(ADD_FRIEND, {
      recipientId: scannedUser?._id,
    });

    if (res.status === 200 && scannedUser) {
      updateFriends(current => [scannedUser, ...current]);

      await socket?.emit('addFriend', {
        recipientId: scannedUser?._id,
        senderId: id,
      });
      replace('BottomTabNavigation', {
        screen: 'Messages',
      });
      Alert.alert('Success', 'Friend successfully added!');
    } else {
      Alert.alert('Something went wrong, please try again!');
      goBack();
    }
  } catch (error: any) {
    Alert.alert('Error', error.response.data.message);
  }
};
