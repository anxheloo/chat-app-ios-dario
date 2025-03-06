/* eslint-disable @typescript-eslint/no-shadow */
import {Alert} from 'react-native';
// import InCallManager from 'react-native-incall-manager';

import {useAppStore} from '../store';

import {
  mediaDevices,
  RTCSessionDescription,
  RTCPeerConnection,
  RTCIceCandidate,
} from 'react-native-webrtc';

import {navigate} from '../navigation/navigationRef';
import {checkPermissionStatus} from './helpers';
import {permission} from './permissions';

// ICE servers
export const servers = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
  ],
};

// ====================================================================
// GENERAL FUNCTIONS
// ====================================================================

// End Call
export const endCall = () => {
  const {
    localStream,
    peerConnection,
    selectedChatData,
    caller,
    socket,
    resetCallState,
  } = useAppStore.getState();
  const receiverId = caller?._id ? caller?._id : selectedChatData?._id;

  socket.emit('endCall', {to: receiverId});
  peerConnection?.close();
  localStream?.getTracks().forEach(track => track.stop());
  resetCallState();
  // InCallManager.stop(); // reset any audio settings
};

export const notifyEndCall = async ({message}: {message: string}) => {
  const {localStream, peerConnection, resetCallState} = useAppStore.getState();

  if (message !== 'Offline') {
    Alert.alert(message);
  } else {
    Alert.alert('User is offline');
  }

  peerConnection?.close();
  localStream?.getTracks().forEach(track => track.stop());
  resetCallState();
  // InCallManager.stop(); // reset any audio settings
};

// Switch remote with local and vice versa
export const switchSources = () => {
  const {localStream, remoteStream, updateWebRTCState} = useAppStore.getState();

  if (!localStream || !remoteStream) {
    return;
  }
  updateWebRTCState({localStream: remoteStream, remoteStream: localStream});
};

// Switch camera
export const switchCamera = () => {
  const {localStream} = useAppStore.getState();

  localStream?.getVideoTracks().forEach(track => {
    track._switchCamera();
  });
};

// Toggle camera for video calls
// export const toggleCamera = () => {
//   const {
//     localStream,
//     peerConnection,
//     selectedChatData,
//     updateWebRTCState,
//     caller,
//     callType,
//     socket,
//   } = useAppStore.getState();

//   const to = caller?._id ?? selectedChatData?._id;

//   if (!localStream || !peerConnection) {
//     return;
//   }

//   callType === 'video'
//     ? updateWebRTCState({callType: 'audio'})
//     : updateWebRTCState({callType: 'video'});

//   // localStream?.getVideoTracks().forEach(track => {
//   //   callType === 'video' ? (track.enabled = false) : (track.enabled = true);
//   // });
//   localStream?.getVideoTracks().forEach(track => {
//     track.enabled = !track.enabled;
//   });

//   socket?.emit('toggle-camera', {to});
// };

// Toggle mic

// Turn mic on or off
export const toggleMic = (
  localMicOn: boolean,
  setLocalMicOn: (value: boolean) => void,
) => {
  const {localStream} = useAppStore.getState();

  setLocalMicOn(!localMicOn);
  localStream?.getAudioTracks().forEach(track => {
    track.enabled = !localMicOn;
  });
};

// Turn camera on or off
export const toggleCamera = () => {
  const {localStream, isVideoEnabled, updateWebRTCState} =
    useAppStore.getState();

  localStream?.getVideoTracks().forEach(track => {
    track.enabled = !isVideoEnabled;
  });
  updateWebRTCState({isVideoEnabled: !isVideoEnabled});

  // socket?.emit('toggle-camera', {isVideoEnabled: !isVideoEnabled});
};

export const getUserMedia = async (
  isVideoCall: boolean,
  peerConnection: RTCPeerConnection,
) => {
  const updateWebRTCState = useAppStore.getState().updateWebRTCState;

  //Get user media
  const localStream = await mediaDevices.getUserMedia({
    audio: true,
    video: isVideoCall,
  });

  //Add tracks to peer connection
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  updateWebRTCState({localStream});

  //  Add remote stream
  peerConnection.ontrack = event => {
    if (event.streams?.[0]) {
      updateWebRTCState({remoteStream: event.streams[0]});
    }
  };
};

export const createOffer = async (
  isVideoCall: boolean,
  peerConnection: RTCPeerConnection,
) => {
  const {username, id, avatar, socket, selectedChatData} =
    useAppStore.getState();

  try {
    const offer = await peerConnection?.createOffer({
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: isVideoCall,
        VoiceActivityDetection: true,
      },
    });

    await peerConnection?.setLocalDescription(new RTCSessionDescription(offer));
    // await peerConnection?.setLocalDescription(offer);

    socket?.emit('incomingCall', {
      to: selectedChatData?._id,
      offer,
      caller: {
        _id: id,
        username,
        avatar,
      },
      callType: isVideoCall ? 'video' : 'audio',
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
};

export const createAnswer = async (peerConnection: RTCPeerConnection) => {
  const {socket, caller} = useAppStore.getState();

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
  // await peerConnection.setLocalDescription(answer);

  // 7. Send the answer back
  try {
    await socket?.emit('answer', {
      to: caller?._id,
      answer,
    });
  } catch (error) {
    console.error('Error creating answer:', error);
  }
};

// ====================================================================
// CALLER
// ====================================================================
export const handleCall = async (callType: 'audio' | 'video') => {
  const {updateWebRTCState} = useAppStore.getState();
  let status: boolean;

  if (callType === 'audio') {
    const micStatus = await checkPermissionStatus(permission.microphone);
    status = micStatus;
  } else {
    const micStatus = await checkPermissionStatus(permission.microphone);
    const cameraStatus = await checkPermissionStatus(permission.camera);

    status = micStatus && cameraStatus;
  }

  if (!status) {
    return;
  }

  updateWebRTCState({
    callState: 'outgoing',
    callType,
  });

  navigate('JoinScreen');
};

export const startCall = async (isVideoCall: boolean) => {
  const {socket, updateWebRTCState, selectedChatData} = useAppStore.getState();

  if (!socket) {
    console.error('Socket not found!');
    return;
  }

  try {
    //1. Create peer connection first
    const peerConnection = new RTCPeerConnection(servers);

    // //2. Get user media
    await getUserMedia(isVideoCall, peerConnection);

    //4. We send these candidates to the other peer
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ICEcandidate', {
          to: selectedChatData?._id,
          candidate: event.candidate,
        });
      }
    };

    //5. Create and send offer
    await createOffer(isVideoCall, peerConnection);

    // Update state
    updateWebRTCState({
      peerConnection,
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to initialize call');
  }
};

// Exchange ICE candidates
export const iceCandidate = async ({candidate}: {candidate: any}) => {
  const {peerConnection, updateCandidates} = useAppStore.getState();

  if (!peerConnection) {
    console.log('PeerConnection not ready, storing ICE candidate...');
    updateCandidates(current => [...current, candidate]);
    return;
  }

  await peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
};

// Call is accepted
export const answer = async ({answer}: {answer: any}) => {
  console.log('Answer:', answer);
  const {peerConnection, updateWebRTCState} = useAppStore.getState();
  peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
  updateWebRTCState({answer, callState: 'active'});
};

// =================================================================
// INCOMING CALL
// ================================================================
export const incomingCall = async ({offer, caller, callType}: any) => {
  const {updateWebRTCState} = useAppStore.getState();

  updateWebRTCState({
    callState: 'incoming',
    caller,
    offer,
    callType,
  });

  // Navigate to JoinScreen to show incoming call UI
  navigate('JoinScreen');
};

// Accept incoming call
export const acceptCall = async () => {
  const {offer, caller, socket, updateWebRTCState, callType, candidates} =
    useAppStore.getState();

  if (!offer) {
    console.log('No offer or caller found!');
    return;
  }

  try {
    // Step 1: Create a Peer Connection
    const peerConnection = new RTCPeerConnection(servers);

    // Step 2: Get user media
    await getUserMedia(callType === 'video', peerConnection);

    // Step 3: Set Remote Description
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Step 4: Process saved candidates
    for (const candidate of candidates) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      // await peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    }

    // Step 5: Handle ICE Candidates
    peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket?.emit('ICEcandidate', {
          to: caller?._id,
          candidate: event.candidate,
        });
      }
    };

    // 6. Create an answer
    await createAnswer(peerConnection);

    // Step 7: Update State
    updateWebRTCState({
      peerConnection,
      callState: 'active',
      callType,
    });
  } catch (error) {
    console.log('Accept call error:', error);
    Alert.alert('Error', `Accept call Failed, ${error}`);
  }
};
