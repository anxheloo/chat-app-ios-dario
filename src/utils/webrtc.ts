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
  const {
    localStream,
    peerConnection,
    selectedChatData,
    caller,
    socket,
    callState,
  } = useAppStore.getState();

  const receiverId = caller?._id ? caller?._id : selectedChatData?._id;

  let callStatus: 'missed' | 'answered' | 'pending' | 'ended' = 'ended';

  if (callState !== 'active') {
    callStatus = 'missed';
  }

  peerConnection?.getSenders().forEach((sender: any) => {
    peerConnection.removeTrack(sender);
  });
  peerConnection?.close();
  localStream?.getTracks().forEach(track => track.stop());
  InCallManager.setSpeakerphoneOn(false);
  InCallManager.setKeepScreenOn(true);
  InCallManager.stop(); // reset any audio settings
  await socket.emit('notifyEndCall', {to: receiverId, callStatus});
  await callUpdate(callStatus);
  goBack();
};

export const notifyEndCall = async ({
  callStatus,
}: {
  message: string;
  callStatus: 'missed' | 'pending' | 'ended' | 'answered';
}) => {
  const {localStream, peerConnection, currentCall, updateCalls} =
    useAppStore.getState();

  updateCalls(currentCalls => [
    ...currentCalls.map(call =>
      call._id === currentCall?._id ? {...call, callStatus} : call,
    ),
  ]);

  peerConnection?.getSenders().forEach((sender: any) => {
    peerConnection.removeTrack(sender);
  });
  peerConnection?.close();
  localStream?.getTracks().forEach(track => track.stop());
  InCallManager.setSpeakerphoneOn(false);
  InCallManager.setKeepScreenOn(true);
  InCallManager.stop(); // reset any audio settings
  goBack();
};

// ====================================================================
// MEDIA FUNCTIONS
// ====================================================================

// Switch camera
export const switchCamera = () => {
  const {localStream, localStream2} = useAppStore.getState();

  let stream;

  if (localStream2) {
    stream = localStream2;
  } else {
    stream = localStream;
  }
  stream?.getVideoTracks().forEach(track => {
    track._switchCamera();
  });
};

// Switch remote with local and vice versa
export const switchSources = () => {
  const {localStream, remoteStream, updateWebRTCState} = useAppStore.getState();

  if (!localStream || !remoteStream) {
    return;
  }
  updateWebRTCState({
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
  const {localStream, isVideoEnabled, updateWebRTCState} =
    useAppStore.getState();

  localStream?.getVideoTracks().forEach(track => {
    track.enabled = !isVideoEnabled;
  });
  updateWebRTCState({isVideoEnabled: !isVideoEnabled});

  // socket?.emit('toggle-camera', {isVideoEnabled: !isVideoEnabled});
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

  await startCall(callType === 'video');

  navigate('JoinScreen');
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

  if (!peerConnection) {
    console.error('❌ No PeerConnection found inside handleRemoteCandidate.');
    return;
  }

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

  console.log(
    '📡 Received Answer. Current signaling state:',
    peerConnection.signalingState,
  );

  try {
    if (
      peerConnection.signalingState === 'stable' ||
      peerConnection.remoteDescription
    ) {
      console.warn(
        '⚠️ Signaling state is already stable! Skipping setRemoteDescription.',
      );
      return;
    }

    // Step 7: Set remote description
    await peerConnection?.setRemoteDescription(
      new RTCSessionDescription(answer),
      // answer,
    );
    await processCandidates();
    updateWebRTCState({callState: 'active'});
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

  try {
    const peerConnection = new RTCPeerConnection(servers);

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

    // updateWebRTCState({
    //   peerConnection,
    //   localStream,
    // });

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

  // updateCalls(currentCalls => [
  //   currentCall,
  //   ...currentCalls.filter(c => c && c?._id !== currentCall?.id),
  // ]);

  // updateWebRTCState({
  //   callState: 'incoming',
  //   caller,
  //   offer,
  //   callType,
  //   currentCall,
  //   peerConnection,
  //   localStream,
  // });

  // navigate('JoinScreen');
};

export const acceptCall = async () => {
  const {socket, caller, offer, updateWebRTCState, callType, peerConnection} =
    useAppStore.getState();

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

  try {
    socket.emit('answer', {to: caller?._id, answer: a});
    updateWebRTCState({
      callState: 'active',
    });
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

      // updateCalls(currentCalls => {
      //   const existingCall = currentCalls.some(
      //     el => el._id === currentCall?._id,
      //   );

      //   if (existingCall) {
      //     return currentCalls.map(call =>
      //       call._id === currentCall?._id ? {...call, callStatus} : call,
      //     );
      //   } else {
      //     return [
      //       updatedCall,
      //       ...currentCalls.filter(c => c && c?._id !== currentCall?._id),
      //     ];
      //   }
      // });

      // updateCalls(currentCalls => [
      //   call,
      //   ...currentCalls.filter(c => c && c?._id !== currentCallId),
      // ]);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to update call');
  }
};
export const startCall = async (isVideoCall: boolean) => {
  const {socket, selectedChatData, updateWebRTCState, id, username, avatar} =
    useAppStore.getState();

  try {
    const currentCall = await createCallUI();

    const peerConnection = new RTCPeerConnection(servers);

    const mediaConstraints = {
      audio: true,
      video: isVideoCall
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

    // localStream.getVideoTracks().forEach(track => {
    //   peerConnection.addTrack(track, localStream);
    // });

    localStream
      .getTracks()
      .forEach(track => peerConnection.addTrack(track, localStream));

    // peerConnection.ontrack = event => {
    //   if (event.streams?.[0]) {
    //     console.log('Got remote track');
    //     updateWebRTCState({remoteStream: event.streams[0]});
    //   }
    // };

    // peerConnection.onicecandidate = ({candidate}) => {
    //   if (candidate) {
    //     socket?.emit('ICEcandidate', {to: selectedChatData?._id, candidate});
    //   }
    // };

    // peerConnection.ontrack = ({streams: [stream]}) => {
    //   updateWebRTCState({remoteStream: stream});
    // };

    // if (
    //   peerConnection.iceConnectionState === 'connected' ||
    //   peerConnection.iceConnectionState === 'completed'
    // ) {
    //   updateWebRTCState({callState: 'active'});
    // }

    if (isVideoCall) {
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.start({media: 'video'});
    } else {
      InCallManager.setSpeakerphoneOn(false);
      InCallManager.start({media: 'audio'});
      InCallManager.setKeepScreenOn(false);
    }

    // Create Offer
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await peerConnection.setLocalDescription(offer);

    // Enable tracks
    // localStream.getAudioTracks().forEach(track => {
    //   track.enabled = true;
    // });

    // localStream.getVideoTracks().forEach(track => {
    //   track.enabled = true;
    // });

    // Send Offer
    socket?.emit('incomingCall', {
      to: selectedChatData?._id,
      offer,
      caller: {
        _id: id,
        username,
        avatar,
      },
      callType: isVideoCall ? 'video' : 'audio',
      currentCall,
    });

    updateWebRTCState({peerConnection, localStream: localStream});
  } catch (error) {
    console.log('Error in startCall:', error);
    Alert.alert('Error', 'Failed to start call');
    endCall();
  }
};
