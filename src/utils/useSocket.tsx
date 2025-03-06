import {useEffect} from 'react';

import {useAppStore} from '../store';

import {answer, iceCandidate, incomingCall, notifyEndCall} from './webrtc';

import {
  friendDeleted,
  handleConversationUpdated,
  handleMessageDeleted,
  handleReceiveMessage,
  notifyReceiver,
} from './message';

export const useSocket = () => {
  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);

  // const toggleCamera = async () => {
  //   const {peerConnection, remoteStream, callType} = useAppStore.getState();

  //   if (!peerConnection) {
  //     return;
  //   }

  //   callType === 'video'
  //     ? updateWebRTCState({callType: 'audio'})
  //     : updateWebRTCState({callType: 'video'});

  //   // remoteStream?.getVideoTracks().forEach(track => {
  //   //   callType === 'video' ? (track.enabled = false) : (track.enabled = true);
  //   // });
  //   remoteStream?.getVideoTracks().forEach(track => {
  //     track.enabled = !track.enabled;
  //   });
  // };

  useEffect(() => {
    if (!userId) {
      console.log('No user ID found, disconnecting socket.');
      return;
    }

    let socket = initializeSocket();

    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messageDeleted', handleMessageDeleted);
      socket.on('conversationUpdated', handleConversationUpdated);
      socket.on('friendCreated', notifyReceiver);
      socket.on('friendDeleted', friendDeleted);

      // Call event listeners
      socket.on('incomingCall', incomingCall);
      socket.on('answer', answer);
      socket.on('ICEcandidate', iceCandidate);
      socket.on('endCall', notifyEndCall);
      // socket.on('toggle-camera', toggleCamera);
    }

    return () => {
      if (socket) {
        console.log('Socket disconected');
        [
          'receiveMessage',
          'messageDeleted',
          'conversationUpdated',
          'friendCreated',
          'friendDeleted',
          'incomingCall',
          'answer',
          'ICEcandidate',
          'callRejected',
          'toggle-camera',
        ].forEach(event => {
          socket.off(event);
        });
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};
