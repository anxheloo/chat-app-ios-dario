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

import {goBack, navigate} from '../navigation/navigationRef';

import {checkPermissionStatus} from './helpers';
import {permission} from './permissions';

import {apiClient} from '../api/apiClient';
import {UPDATE_CALL, START_CALL} from '../api/apis';

// ====================================================================
// ICE servers
// ====================================================================

export const servers: RTCConfiguration = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
    // {
    //   urls: 'turn:openrelay.metered.ca:80',
    //   username: 'openrelayproject',
    //   credential: 'openrelayproject',
    // },
    // {
    //   urls: 'turn:openrelay.metered.ca:443',
    //   username: 'openrelayproject',
    //   credential: 'openrelayproject',
    // },
    // {
    //   urls: 'turn:numb.viagenie.ca',
    //   credential: 'muazkh',
    //   username: 'webrtc@live.com',
    // },
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
  iceTransportPolicy: 'all',
};

// export const servers = {
//   iceServers: [
//     {urls: 'stun:stun.l.google.com:19302'},
//     {urls: 'stun:stun1.l.google.com:19302'},
//     {urls: 'stun:stun2.l.google.com:19302'},
//     {
//       urls: 'turn:openrelay.metered.ca:80',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//     {
//       urls: 'turn:openrelay.metered.ca:443',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//   ],
//   iceCandidatePoolSize: 10,
//   sdpSemantics: 'unified-plan', // Improves iOS-Android compatibility
//   bundlePolicy: 'max-bundle', // Optimizes media bundling
//   rtcpMuxPolicy: 'require', // Enforces RTCP multiplexing
//   iceTransportPolicy: 'all', // Allows relay (TURN) if needed
// };

// export const servers = {
//   iceServers: [
//     {
//       urls: [
//         'stun:stun.l.google.com:19302',
//         'stun:stun1.l.google.com:19302',
//         'stun:stun2.l.google.com:19302',
//       ],
//     },
//   ],
//   iceCandidatePoolSize: 10,
//   // Add these options to improve iOS-Android compatibility
//   sdpSemantics: 'unified-plan',
//   bundlePolicy: 'max-bundle' as const,
//   rtcpMuxPolicy: 'require',
//   // iOS-specific options
//   ...(Platform.OS === 'ios'
//     ? {
//         iceTransportPolicy: 'all',
//       }
//     : {}),
// };

// ====================================================================
// END CALL FUNCTIONS
// ====================================================================

// End Call & emit notifyEndCallEvent
export const endCall = async () => {
  const {selectedChatData, caller, socket, callState, updateWebRTCState} =
    useAppStore.getState();

  try {
    updateWebRTCState({disabledButtons: true});

    const receiverId = caller?._id ? caller?._id : selectedChatData?._id;

    let callStatus: 'missed' | 'answered' | 'pending' | 'ended' = 'ended';

    if (callState !== 'active') {
      callStatus = 'missed';
    }

    await socket.emit('notifyEndCall', {to: receiverId, callStatus});
    closePeerConnection();
    goBack();
    await callUpdate(callStatus);
  } catch (error) {
    console.log('Error in endCall:', error);
  }
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
  goBack();
};

// Close connection
export const closePeerConnection = () => {
  const {peerConnection, localStream, resetCallState} = useAppStore.getState();

  try {
    InCallManager.stop();
    InCallManager.stopRingtone();
    InCallManager.stopRingback();
    InCallManager.setSpeakerphoneOn(false);
    InCallManager.setKeepScreenOn(false);

    if (peerConnection) {
      peerConnection?.getSenders().forEach((sender: any) => {
        peerConnection.removeTrack(sender);
      });
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection?.close();
    }
    resetCallState();
  } catch (e) {
    console.error('Error stopping InCallManager:', e);
  }
};

// ====================================================================
// MEDIA FUNCTIONS
// ====================================================================

// Switch camera
export const switchCamera = async () => {
  const {
    localStream,
    remoteStream,
    updateWebRTCState,
    cameraSwitched,
    switchVideoSources,
  } = useAppStore.getState();

  const faceMode = !cameraSwitched ? 'environment' : 'user';
  const mediaSource = switchVideoSources ? remoteStream : localStream;

  updateWebRTCState({cameraSwitched: !cameraSwitched});

  mediaSource?.getVideoTracks().forEach(async track => {
    await track
      .applyConstraints({
        facingMode: faceMode,
      })
      .catch(err => console.warn('Failed to switch camera:', err));
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

// export const setUpCallManager = async (
//   callType: 'audio' | 'video' | null,
//   isCaller: boolean,
// ) => {
//   try {
//     // InCallManager.start({media: callType!, auto: true});

//     if (callType === 'video') {
//       InCallManager.setSpeakerphoneOn(true);
//       InCallManager.setKeepScreenOn(true);
//     } else {
//       InCallManager.setSpeakerphoneOn(false);
//     }

//     // if (isCaller) {
//     //   InCallManager.start({
//     //     media: callType,
//     //     ringback: '_BUNDLE_',
//     //   });
//     // }

//     // if (isCaller) {
//     //   // Start ringback tone for the caller
//     //   InCallManager.startRingback('_DEFAULT_');
//     // } else {
//     //   // Start ringtone for the receiver
//     //   InCallManager.startRingtone(
//     //     '_BUNDLE_',
//     //     [1000, 1000, 1000, 1000, 1000],
//     //     '_BUNDLE_',
//     //     15,
//     //   );
//     // }
//   } catch (e) {
//     console.log('Error in setUpCallManager:', e);
//   }
// };

export const permissions = async (
  callType: 'audio' | 'video' | null = 'audio',
) => {
  let status: boolean;

  if (callType === 'audio') {
    const micStatus = await checkPermissionStatus(permission.microphone);
    status = micStatus;
  } else {
    const micStatus = await checkPermissionStatus(permission.microphone);
    const cameraStatus = await checkPermissionStatus(permission.camera);

    status = micStatus && cameraStatus;
  }

  return status;
};

export const busyCall = async ({callState}: {callState: 'busy'}) => {
  const {updateWebRTCState} = useAppStore.getState();

  updateWebRTCState({callState});
  await callUpdate('missed');

  closePeerConnection();
  goBack();
};

// ====================================================================
// CALLER
// ====================================================================
export const handleCall = async (callType: 'audio' | 'video' = 'audio') => {
  const {updateWebRTCState} = useAppStore.getState();

  const status = await permissions(callType);

  if (!status) {
    console.log('Please enable microphone and camera');
    return;
  }

  updateWebRTCState({
    callState: 'pending',
    callType: callType,
  });

  navigate('JoinScreen');

  await startCall();
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

  const currentCall = await createCallUI();

  const mediaConstraints = {
    audio: true,
    video: callType === 'video' ? true : false,
    faceMode: callType === 'video' && 'user',
  };

  try {
    const localStream = await mediaDevices.getUserMedia(mediaConstraints);
    updateWebRTCState({
      localStream,
      isVideoEnabled: callType === 'video',
    });

    InCallManager.start({media: callType!, ringback: '_BUNDLE_', auto: true});

    const peerConnection = new RTCPeerConnection(servers);
    updateWebRTCState({peerConnection});

    localStream
      .getTracks()
      .forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        socket.emit('ICEcandidate', {
          to: selectedChatData?._id,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = event => {
      // When remote stream arrives, save it in state for rendering video
      if (event.streams && event.streams[0]) {
        updateWebRTCState({remoteStream: event.streams[0]});
      }
    };

    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: callType === 'video' ? true : false,
    });

    await peerConnection.setLocalDescription(offer);

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
  } catch (e) {
    console.log('Error in get user media:', e);
    Alert.alert('Error', 'Failed to start call. Please try again.');
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

// ====================================================================
// SOCKET LISTENERS
// ====================================================================
export const handleRemoteCandidate = ({candidate}: {candidate: any}) => {
  const {peerConnection, updateCandidates} = useAppStore.getState();

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
  const {peerConnection, updateWebRTCState, callType} = useAppStore.getState();

  if (peerConnection) {
    try {
      const remoteDesc = new RTCSessionDescription(answer);
      await peerConnection.setRemoteDescription(remoteDesc);
      await processCandidates();
      updateWebRTCState({isRemoteVideoEnabled: true, callState: 'active'});

      InCallManager.stopRingback();
      if (callType === 'video') {
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.setKeepScreenOn(true);
      }
    } catch (err) {
      console.error('Answer error:', err);
    }
  }
};

// ====================================================================
// RECEIVER
// ====================================================================

export const incomingCall = async ({
  offer,
  caller,
  callType,
  currentCall,
}: any) => {
  const {updateWebRTCState, updateCalls, callState, socket} =
    useAppStore.getState();

  if (callState === 'active' || callState === 'incoming') {
    updateCalls(currentCalls => [
      {...currentCall, callStatus: 'missed'},
      ...currentCalls.filter(c => c && c?._id !== currentCall?.id),
    ]);
    socket?.emit('busyCall', {to: caller?._id, callState: 'busy'});
    return;
  }

  try {
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
    });

    navigate('JoinScreen');

    InCallManager.stopRingback();
    InCallManager.start({media: callType, auto: true});
    InCallManager.startRingtone(
      '_BUNDLE_',
      [1000, 1000, 1000, 1000, 1000],
      '_BUNDLE_',
      15,
    );
  } catch (err) {
    Alert.alert('Error', 'Failed to process incoming call.');
    console.log(err);
  }
};

export const acceptCall = async () => {
  const {socket, caller, offer, callType, updateWebRTCState} =
    useAppStore.getState();

  const status = await permissions(callType);

  if (!status || !offer) {
    await endCall();
    Alert.alert('Please enable microphone and camera');
    return;
  }

  const mediaConstraints = {
    audio: true,
    video: callType === 'video' ? true : false,
  };

  try {
    const localStream = await mediaDevices.getUserMedia(mediaConstraints);
    updateWebRTCState({
      localStream,
      isVideoEnabled: callType === 'video',
    });

    InCallManager.stopRingtone();

    // await setUpCallManager(callType, false);

    const peerConnection = new RTCPeerConnection(servers);
    updateWebRTCState({peerConnection});

    localStream
      .getTracks()
      .forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        socket.emit('ICEcandidate', {
          to: caller?._id,
          candidate: event.candidate,
        });
      }
    };
    peerConnection.ontrack = event => {
      // When remote stream arrives, save it in state for rendering video
      if (event.streams && event.streams[0]) {
        updateWebRTCState({remoteStream: event.streams[0]});
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (callType === 'video') {
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setKeepScreenOn(true);
    }

    processCandidates();

    socket.emit('answer', {to: caller?._id, answer: answer});

    updateWebRTCState({
      isRemoteVideoEnabled: true,
      callState: 'active',
    });

    // setUpCallManager( callType!, false);
  } catch (err) {
    console.log('Error in acceptCall :', err);
    // closePeerConnection();
    // goBack();
  }
};

export const processCandidates = async () => {
  const {candidates, peerConnection, updateCandidates} = useAppStore.getState();

  if (!peerConnection.remoteDescription) {
    console.warn('⚠️ Remote description not set yet. Skipping ICE candidates.');
    return;
  }

  if (candidates.length < 1) {
    console.log('No candidates to process.');
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
