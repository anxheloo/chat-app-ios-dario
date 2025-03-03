import {useCallback, useEffect} from 'react';
import {Alert, AppState} from 'react-native';

import {goBack, navigate} from '../navigation/navigationRef';

import {RTCSessionDescription, RTCIceCandidate} from 'react-native-webrtc';

import {useAppStore} from '../store';

import {Message, Conversation, Contact} from './types';

export const useSocket = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const resetCallState = useAppStore(state => state.resetCallState);
  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);
  const updateSelectedChatMessages = useAppStore(
    state => state.updateSelectedChatMessages,
  );
  const updateFriends = useAppStore(state => state.updateFriends);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);

  const handleReceiveMessage = useCallback(
    (message: any) => {
      const {conversations, selectedChatData, sortConversations} =
        useAppStore.getState();

      const tempConversations = [...conversations];

      // Check if the conversation already exists
      const existingConversationIndex = conversations.findIndex(
        conversation => conversation._id === message.conversationId,
      );

      // Update the existing conversation
      if (existingConversationIndex !== -1) {
        tempConversations[existingConversationIndex] = {
          ...conversations[existingConversationIndex],
          lastMessage: message,
          lastMessageTime: message.createdAt,
        };
      } else {
        // Add a new conversation if it doesn't exist
        tempConversations.unshift({
          _id: message.conversationId,
          participants: [message.sender, message.recipient],
          lastMessage: message,
          lastMessageTime: message.createdAt,
        });
      }

      // Update the conversations in the state
      updateFuncChat({
        conversations: tempConversations,
      });

      if (
        selectedChatData?._id === message.recipient._id ||
        selectedChatData?._id === message.sender._id
      ) {
        updateSelectedChatMessages(current => [
          ...current.filter(msg => msg._id !== message._id),
          {
            ...message,
            uploading: false,
            recipient: message.recipient._id,
            sender: message.sender._id,
          },
        ]);

        // updateKeys({loading: false});
      }

      sortConversations();
    },
    [updateFuncChat, updateSelectedChatMessages],
  );

  const handleMessageDeleted = useCallback(
    ({messageId}: {messageId: string}) => {
      const {selectedChatMessages, selectedChatData} = useAppStore.getState();

      // Find the message in the current chat
      const messageToDelete = selectedChatMessages.find(
        (message: Message) => message._id === messageId,
      );

      if (
        messageToDelete &&
        (messageToDelete.sender === selectedChatData?._id ||
          messageToDelete.recipient === selectedChatData?._id)
      ) {
        updateFuncChat({
          selectedChatMessages: selectedChatMessages.map(msg => {
            if (msg._id === messageId) {
              return {
                ...msg,
                messageType: 'deleted',
                content: 'Message deleted',
              };
            }
            return msg;
          }),
        });
      }
    },
    [updateFuncChat],
  );

  const handleConversationUpdated = useCallback(
    (conversation: Conversation) => {
      console.log('Conversation emited from backend:', conversation);

      const {conversations} = useAppStore.getState();
      const existingConversations = conversations.map(item => {
        if (item._id === conversation._id) {
          return {
            ...item,
            lastMessage: conversation?.lastMessage,
            lastMessageTime: conversation.lastMessageTime,
          };
        }

        return item;
      });

      updateFuncChat({conversations: existingConversations});
    },
    [updateFuncChat],
  );

  const notifyReceiver = useCallback(
    (friend: Contact) => {
      console.log('THis is friend inside notify receiver:', friend);

      Alert.alert(
        'Incoming Friend',
        `@${friend.username} was added as a friend.`,
      );

      updateFriends(current => [friend, ...current]);
    },
    [updateFriends],
  );

  const friendDeleted = useCallback(
    ({
      senderId,
      senderUsername,
    }: {
      senderId: string;
      senderUsername: string;
    }) => {
      console.log('THis is friendId inside friendDeleted:', senderId);

      Alert.alert('Friend removal', `${senderUsername} removed you.`);
      updateFriends(current =>
        current.filter(friend => friend?._id !== senderId),
      );
    },
    [updateFriends],
  );

  // ==============================================================================================

  // WebRTC
  const incomingCall = async ({offer, caller, callType}: any) => {
    console.log('Incoming call from:', caller.username);

    updateWebRTCState({
      callState: 'incoming',
      caller,
      offer,
      callType,
    });

    // Navigate to JoinScreen to show incoming call UI
    navigate('JoinScreen');
  };

  const answerCall = async ({answer}: {answer: any}) => {
    console.log('Received answer, setting remote description...');
    const peerConnection = useAppStore.getState().peerConnection;

    if (peerConnection) {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );

      updateWebRTCState({answer, callState: 'active'});
    }
  };

  const iceCandidate = async ({candidate}: {candidate: any}) => {
    const peerConnection = useAppStore.getState().peerConnection;

    console.log('This is peer connection inside iceCandidate:', peerConnection);

    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const callRejected = async ({message}: {message: string}) => {
    console.log('Inside call Rejected');

    const localStream = useAppStore.getState().localStream;
    const peerConnection = useAppStore.getState().peerConnection;

    if (message !== 'Offline') {
      Alert.alert(message);
    } else {
      Alert.alert('User is offline');
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    resetCallState();

    goBack();
  };

  const toggleCamera = async () => {
    const {peerConnection, remoteStream, callType} = useAppStore.getState();

    if (!peerConnection) {
      return;
    }

    callType === 'video'
      ? updateWebRTCState({callType: 'audio'})
      : updateWebRTCState({callType: 'video'});

    // remoteStream?.getVideoTracks().forEach(track => {
    //   callType === 'video' ? (track.enabled = false) : (track.enabled = true);
    // });
    remoteStream?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
  };

  useEffect(() => {
    if (!userId) {
      console.log('No user ID found, disconnecting socket.');
      disconnectSocket(); // Disconnect if user logs out
      return;
    }

    console.log('User ID detected, initializing socket:', userId);
    let socket = initializeSocket();

    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messageDeleted', handleMessageDeleted);
      socket.on('conversationUpdated', handleConversationUpdated);
      socket.on('friendCreated', notifyReceiver);
      socket.on('friendDeleted', friendDeleted);

      // Call event listeners
      socket.on('incomingCall', incomingCall);
      socket.on('answer', answerCall);
      socket.on('ice-candidate', iceCandidate);
      socket.on('callRejected', callRejected);
      socket.on('toggle-camera', toggleCamera);
    }

    // Reconnect when the app comes into focus
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active' && !socket?.connected) {
          console.log('🔄 App resumed: Reconnecting socket...');
          socket = initializeSocket();
        }
      },
    );

    return () => {
      console.log('socket disconected from useSocket');
      socket.off('receiveMessage');
      socket.off('messageDeleted');
      socket.off('conversationUpdated');
      socket.off('friendCreated');
      socket.off('friendDeleted');
      appStateListener.remove();
      disconnectSocket();
    };

    // return () => {
    //   console.log('Cleaning up socket listeners...');
    //   if (socket) {
    //     socket.off('receiveMessage', handleReceiveMessage);
    //     socket.off('messageDeleted', handleMessageDeleted);
    //     socket.off('conversationUpdated', handleConversationUpdated);
    //     socket.off('friendCreated', notifyReceiver);
    //     socket.off('friendDeleted', friendDeleted);
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};
