/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import {Alert} from 'react-native';
import InCallManager from 'react-native-incall-manager';

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
import {apiClient} from '../api/apiClient';
import {UPDATE_CALL, START_CALL} from '../api/apis';

// ====================================================================
// ICE servers
// ====================================================================

export const servers = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
  ],
};

// ====================================================================
// END CALL FUNCTIONS
// ====================================================================

// End Call & emit notifyEndCallEvent
export const endCall = async () => {
  const {selectedChatData, caller, socket, callState, updateWebRTCState} =
    useAppStore.getState();

  const receiverId = caller?._id ? caller?._id : selectedChatData?._id;

  let callStatus: 'missed' | 'answered' | 'pending' | 'ended' = 'ended';

  if (callState !== 'active') {
    callStatus = 'missed';
  }

  updateWebRTCState({disabledButtons: true});

  closePeerConnection();
  await socket.emit('notifyEndCall', {to: receiverId, callStatus});
  await callUpdate(callStatus);
};

export const notifyEndCall = async ({
  callStatus,
}: {
  message: string;
  callStatus: 'missed' | 'pending' | 'ended' | 'answered';
}) => {
  const {currentCall, updateCalls, updateWebRTCState} = useAppStore.getState();

  updateWebRTCState({disabledButtons: true});

  updateCalls(currentCalls => [
    ...currentCalls.map(call =>
      call._id === currentCall?._id ? {...call, callStatus} : call,
    ),
  ]);

  closePeerConnection();
};

// Close connection
export const closePeerConnection = () => {
  const {peerConnection, localStream, resetCallState} = useAppStore.getState();

  if (!peerConnection) {
    return;
  }

  peerConnection?.getSenders().forEach((sender: any) => {
    peerConnection.removeTrack(sender);
  });
  localStream?.getTracks().forEach(track => track.stop());
  peerConnection?.close();
  // InCallManager.setSpeakerphoneOn(false);
  // InCallManager.setKeepScreenOn(true);
  InCallManager.stop(); // reset any audio settings
  resetCallState();
};

// ====================================================================
// MEDIA FUNCTIONS
// ====================================================================

// Get User Media
// export const getMedia: any = async () => {
//   const {callType, updateWebRTCState} = useAppStore.getState();

//   try {
//     const peerConnection = new RTCPeerConnection(servers);

//     const mediaConstraints = {
//       audio: true,
//       video:
//         callType === 'video'
//           ? {
//               facingMode: 'user',
//               frameRate: 30,
//               width: 640,
//               height: 360,
//             }
//           : false,
//     };

//     const localStream = await mediaDevices
//       .getUserMedia(mediaConstraints)
//       .then(stream => {
//         return stream;
//       });

//     localStream.getTracks().forEach(track => {
//       track.enabled = true;
//     });

//     localStream
//       .getTracks()
//       .forEach(track => peerConnection.addTrack(track, localStream));

//     updateWebRTCState({peerConnection, localStream: localStream});

//     return {localStream, peerConnection};
//   } catch (e) {
//     Alert.alert('Error', 'Failed to get media');
//   }
// };

// Switch camera
export const switchCamera = () => {
  const {localStream} = useAppStore.getState();

  localStream?.getVideoTracks().forEach(track => {
    track._switchCamera();
  });
};

// Switch remote with local and vice versa
export const switchSources = () => {
  const {localStream, remoteStream, updateWebRTCState, switchVideoSources} =
    useAppStore.getState();

  if (!localStream || !remoteStream) {
    return;
  }

  updateWebRTCState({
    switchVideoSources: !switchVideoSources,
    localStream: remoteStream,
    remoteStream: localStream,
  });
};

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
  const {
    isVideoEnabled,
    socket,
    updateWebRTCState,
    caller,
    selectedChatData,
    localStream,
    remoteStream,
    switchVideoSources,
  } = useAppStore.getState();

  const receiverId = caller?._id ? caller?._id : selectedChatData?._id;

  if (!localStream || !remoteStream) {
    console.log('No stream inside toggleCamera');
    return;
  }

  if (switchVideoSources) {
    remoteStream.getVideoTracks()[0].enabled = !isVideoEnabled;
  } else {
    localStream.getVideoTracks()[0].enabled = !isVideoEnabled;
  }

  // localStream?.getVideoTracks().forEach(track => {
  //   track.enabled = !isVideoEnabled;
  // });

  updateWebRTCState({
    isVideoEnabled: !isVideoEnabled,
    // localStream: localStream,
  });

  socket?.emit('toggle-camera', {
    isVideoEnabled: !isVideoEnabled,
    to: receiverId,
  });
};

export const toggleCameraEvent = ({
  isVideoEnabled,
}: {
  isVideoEnabled: boolean;
}) => {
  const {updateWebRTCState} = useAppStore.getState();

  updateWebRTCState({isRemoteVideoEnabled: isVideoEnabled});
};

// ====================================================================
// CALLER
// ====================================================================
export const handleCall = async (callType: 'audio' | 'video' = 'audio') => {
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
    console.log('Please enable microphone and camera');
    return;
  }

  updateWebRTCState({
    callState: 'pending',
    callType: callType,
  });

  await startCall();

  navigate('JoinScreen');
};
export const startCall = async () => {
  const {
    socket,
    selectedChatData,
    id,
    username,
    avatar,
    callType,
    updateWebRTCState,
  } = useAppStore.getState();

  try {
    const currentCall = await createCallUI();

    // const {peerConnection} = await getMedia();

    const peerConnection = new RTCPeerConnection(servers);

    const mediaConstraints = {
      audio: true,
      video:
        callType === 'video'
          ? {
              facingMode: 'user',
              frameRate: 30,
              width: 640,
              height: 360,
            }
          : false,
    };

    const localStream = await mediaDevices
      .getUserMedia(mediaConstraints)
      .then(stream => {
        // updateWebRTCState({localStream: stream});
        return stream;
      });

    localStream.getTracks().forEach(track => {
      track.enabled = true;
    });

    localStream
      .getTracks()
      .forEach(track => peerConnection.addTrack(track, localStream));

    // Create Offer
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: callType === 'video',
    });

    await peerConnection.setLocalDescription(offer);

    updateWebRTCState({
      peerConnection,
      localStream: localStream,
      isVideoEnabled: callType === 'video',
    });

    if (callType === 'video') {
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setKeepScreenOn(true);
      InCallManager.start({
        media: 'video',
      });
    } else {
      InCallManager.start({
        media: 'audio',
      });
      InCallManager.setKeepScreenOn(false);
    }

    InCallManager.startRingback('_BUNDLE_');

    // Send Offer
    socket?.emit('incomingCall', {
      to: selectedChatData?._id,
      offer,
      caller: {
        _id: id,
        username,
        avatar,
      },
      callType: callType,
      currentCall,
    });
  } catch (error) {
    console.log('Error in startCall:', error);
    Alert.alert('Error', 'Failed to start call');
    endCall();
  }
};
// Create call on backend and update UI
export const createCallUI = async () => {
  const {selectedChatData, callType, updateCalls, updateWebRTCState} =
    useAppStore.getState();

  console.log('This is call type', callType);

  try {
    const response = await apiClient.post(START_CALL, {
      receiver: selectedChatData?._id,
      callType: callType,
    });

    if (response.status === 200) {
      const {refinedCall} = response.data;

      updateCalls(currentCalls => [
        refinedCall,
        ...currentCalls.filter(call => call && call._id !== refinedCall?._id),
      ]);
      // updateWebRTCState({currentCallId: refinedCall?._id});
      updateWebRTCState({currentCall: refinedCall});

      return refinedCall;
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to create call');
  }
};

// Handle remote candidate socket event
export const handleRemoteCandidate = ({candidate}: {candidate: any}) => {
  const {peerConnection, updateCandidates} = useAppStore.getState();

  // if (!peerConnection) {
  //   console.error('❌ No PeerConnection found inside handleRemoteCandidate.');
  //   return;
  // }

  const iceCandidate = new RTCIceCandidate(candidate);
  console.log('🟠 Processing Remote ICE Candidate:', iceCandidate);

  // If remote description is not set, store the candidate
  if (!peerConnection.remoteDescription) {
    console.log('⚠️ Storing ICE Candidate for later.');
    updateCandidates(current => [...current, iceCandidate]);
  } else {
    peerConnection
      .addIceCandidate(iceCandidate)
      .then(() => {
        updateCandidates(() => []); // Clear candidates
        console.log('✅ ICE Candidate Added Successfully');
      })
      .catch((err: Error) =>
        console.error('❌ Failed to add ICE candidate:', err),
      );
  }
};

// Answer socket event main
export const answer = async ({answer}: {answer: any}) => {
  const {peerConnection, updateWebRTCState} = useAppStore.getState();

  if (!peerConnection) {
    console.error('❌ No PeerConnection found.');
    return;
  }

  try {
    // if (
    //   peerConnection.signalingState === 'stable' ||
    //   peerConnection.remoteDescription
    // ) {
    //   console.warn(
    //     '⚠️ Signaling state is already stable! Skipping setRemoteDescription.',
    //   );
    //   return;
    // }

    // Step 7: Set remote description
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer),
    );
    await processCandidates();

    updateWebRTCState({isRemoteVideoEnabled: true});
    InCallManager.stopRingback();
  } catch (err) {
    console.error('Answer error:', err);
  }
};
// =================================================================
// INCOMING CALL
// ================================================================
export const incomingCall = async ({
  offer,
  caller,
  callType,
  currentCall,
}: any) => {
  const {updateWebRTCState, updateCalls} = useAppStore.getState();

  const mediaConstraints = {
    audio: true,
    video:
      callType === 'video'
        ? {
            facingMode: 'user',
            frameRate: 30,
          }
        : false,
  };

  InCallManager.startRingtone('_DEFAULT_', 1, 'default', 20);

  if (callType === 'video') {
    InCallManager.setSpeakerphoneOn(true);
    InCallManager.setKeepScreenOn(true);
    InCallManager.start({
      media: 'video',
    });
  } else {
    InCallManager.start({
      media: 'audio',
    });
    InCallManager.setKeepScreenOn(false);
  }

  try {
    const peerConnection = new RTCPeerConnection(servers);

    const localStream = await mediaDevices
      .getUserMedia(mediaConstraints)
      .then(stream => {
        return stream;
      });

    localStream.getTracks().forEach(track => {
      track.enabled = true;
    });

    localStream
      .getTracks()
      .forEach(track => peerConnection.addTrack(track, localStream));

    updateCalls(currentCalls => [
      currentCall,
      ...currentCalls.filter(c => c && c?._id !== currentCall?.id),
    ]);

    updateWebRTCState({
      callState: 'incoming',
      caller,
      offer,
      callType,
      currentCall,
      peerConnection,
      localStream,
    });

    navigate('JoinScreen');
  } catch (err) {
    console.log(err);
  }
};

export const acceptCall = async () => {
  const {socket, caller, offer, callType, peerConnection, updateWebRTCState} =
    useAppStore.getState();

  InCallManager.stopRingtone();
  // InCallManager.stopRingback();

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
    await endCall();
    Alert.alert('Error', 'Please enable microphone and camera');
    return;
  }

  if (!offer) {
    console.log('No offer received!');
    return;
  }

  await peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
  const a = await peerConnection?.createAnswer();
  await peerConnection?.setLocalDescription(a);
  processCandidates();

  updateWebRTCState({
    isVideoEnabled: callType === 'video',
    isRemoteVideoEnabled: true,
  });

  try {
    socket.emit('answer', {to: caller?._id, answer: a});
  } catch (error) {
    console.error('Error in acceptCall:', error);
  }

  await callUpdate('answered');
};

export const processCandidates = async () => {
  const {candidates, peerConnection, updateCandidates} = useAppStore.getState();

  if (candidates.length < 1) {
    return;
  }

  candidates.forEach(
    async candidate => peerConnection?.addIceCandidate(candidate),
    console.log('candidate processed'),
  );
  updateCandidates(() => []);
};

// =================================================================
// CALL POST REQUESTS
// ================================================================
export const callUpdate = async (
  callStatus: 'missed' | 'answered' | 'pending' | 'ended',
  timer?: number,
) => {
  const {updateCalls, currentCall, calls} = useAppStore.getState();

  const existingCall = calls.some(call => call._id === currentCall?._id);

  try {
    const response = await apiClient.post(UPDATE_CALL, {
      callId: currentCall?._id,
      callStatus,
    });

    if (response.status === 200) {
      const {updatedCall} = response.data;

      if (existingCall) {
        // Existing call
        updateCalls(currentCalls => {
          return [
            ...currentCalls.map(call =>
              call._id === currentCall?._id ? {...call, callStatus} : call,
            ),
          ];
        });
      } else {
        // New call
        updateCalls(currentCalls => {
          return [
            updatedCall,
            ...currentCalls.filter(c => c && c?._id !== currentCall?._id),
          ];
        });
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to update call');
  }
};
