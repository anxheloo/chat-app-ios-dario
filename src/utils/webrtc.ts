import {Alert} from 'react-native';

import {useAppStore} from '../store';

import {
  mediaDevices,
  RTCSessionDescription,
  RTCPeerConnection,
} from 'react-native-webrtc';

import {goBack, navigate} from '../navigation/navigationRef';
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

// Start call Step 1
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

  if (status) {
    updateWebRTCState({
      callState: 'outgoing',
      callType,
    });

    navigate('JoinScreen');
  }
};

// Initiate Call from the caller, Step 2
export const initializeCall = async (isVideoCall: boolean) => {
  const {username, id, avatar, socket, updateWebRTCState} =
    useAppStore.getState();

  console.log('THis is socket inside intitializeCall:,', socket);

  try {
    // Create peer connection first
    const pc = new RTCPeerConnection(servers);

    // Get user media
    const ls = await mediaDevices.getUserMedia({
      audio: true,
      video: isVideoCall
        ? {
            width: 500,
            height: 300,
            frameRate: 30,
            facingMode: 'user',
          }
        : false,
    });

    // Enable Tracks to Ensure They Are Not Disabled
    ls.getAudioTracks().forEach(track => (track.enabled = true));
    ls.getVideoTracks().forEach(track => (track.enabled = true));

    updateWebRTCState({
      localStream: ls,
    });

    // Add tracks to peer connection
    ls.getTracks().forEach(track => {
      pc.addTrack(track, ls);
    });

    // Set up ICE handling BEFORE getting media
    pc.onicecandidate = event => {
      if (event.candidate) {
        // Make sure event name matches backend
        socket.emit('ice-candidate', {
          to: useAppStore.getState().selectedChatData?._id,
          candidate: event.candidate,
        });
      }
    };

    // Set up track handling before adding tracks
    pc.ontrack = event => {
      if (event.streams?.[0]) {
        console.log('Got remote track');
        updateWebRTCState({remoteStream: event.streams[0]});
      }
    };

    // Create and send offer
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: isVideoCall,
    });

    await pc.setLocalDescription(offer);

    // Use consistent event name
    socket?.emit('incomingCall', {
      to: useAppStore.getState().selectedChatData?._id,
      offer,
      caller: {
        _id: id,
        username,
        avatar,
      },
      callType: isVideoCall ? 'video' : 'audio',
    });

    // Update state
    updateWebRTCState({
      peerConnection: pc,
      // localStream: ls,
    });
  } catch (error) {
    console.error('Error initializing call:', error);
    Alert.alert('Error', 'Failed to initialize call');
  }
};

// End call
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

  console.log('This is localStream inside handleEndCall: ', localStream);
  console.log('This is peerConnection inside handleEndCall:  ', peerConnection);

  // if (localStream) {
  //   console.log('localStream');
  //   localStream?.getTracks().forEach(track => track.stop());
  //   localStream?.getAudioTracks().forEach(track => {
  //     track.enabled = false;
  //   });
  // }

  // if (peerConnection) {
  //   console.log('peerCOnnection');
  //   peerConnection.close();
  // }

  peerConnection?.close();

  socket.emit('callRejected', {to: receiverId});

  resetCallState();

  goBack();
};

// Accept incoming call
export const acceptCall = async () => {
  const {offer, caller, socket, updateWebRTCState, callType} =
    useAppStore.getState();

  if (!offer || !caller) {
    return;
  }

  try {
    // Step 1: Create a Peer Connection
    const pc = new RTCPeerConnection(servers);

    // Step 2: Get local stream (microphone/video)
    const ls = await mediaDevices.getUserMedia({
      audio: true,
      video:
        callType === 'video'
          ? {width: 500, height: 300, frameRate: 30, facingMode: 'user'}
          : false,
    });

    // Enable Tracks (Fix Android Issues)
    ls.getTracks().forEach(track => (track.enabled = true));

    // Step 3: Add Tracks to Peer Connection
    ls.getTracks().forEach(track => pc.addTrack(track, ls));

    // Step 4: Handle Remote Stream
    pc.ontrack = (event: any) => {
      console.log('Receiving remote stream:', event.streams[0]);
      updateWebRTCState({remoteStream: event.streams[0]});
    };

    // Step 5: Handle ICE Candidates
    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket?.emit('ice-candidate', {
          to: caller?._id,
          candidate: event.candidate,
        });
      }
    };

    // Step 6: Set the Remote Description
    if (offer) {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
    }

    // Step 7: Create an Answer
    const a = await pc.createAnswer();
    await pc.setLocalDescription(a);

    // Step 8: Send the Answer back
    socket?.emit('answer', {
      to: caller?._id,
      answer: a,
    });

    // Step 9: Update State
    updateWebRTCState({
      localStream: ls,
      peerConnection: pc,
      callState: 'active',
    });
  } catch (error) {
    console.log('This is error: ', error);
    Alert.alert('Error', 'Incoming call Failed');
  }
};

// Switch camera for video calls
export const switchSources = () => {
  const {localStream, remoteStream, updateWebRTCState} = useAppStore.getState();

  if (!localStream || !remoteStream) {
    return;
  }
  updateWebRTCState({localStream: remoteStream, remoteStream: localStream});
};

export const switchCamera = () => {
  const {localStream} = useAppStore.getState();

  localStream?.getVideoTracks().forEach(track => {
    track._switchCamera();
  });
};

// Toggle camera for video calls
export const toggleCamera = () => {
  const {
    localStream,
    peerConnection,
    selectedChatData,
    updateWebRTCState,
    caller,
    callType,
    socket,
  } = useAppStore.getState();

  const to = caller?._id ?? selectedChatData?._id;

  if (!localStream || !peerConnection) {
    return;
  }

  callType === 'video'
    ? updateWebRTCState({callType: 'audio'})
    : updateWebRTCState({callType: 'video'});

  // localStream?.getVideoTracks().forEach(track => {
  //   callType === 'video' ? (track.enabled = false) : (track.enabled = true);
  // });
  localStream?.getVideoTracks().forEach(track => {
    track.enabled = !track.enabled;
  });

  socket?.emit('toggle-camera', {to});
};

// Toggle mic
export const toggleMic = (
  localMicOn: boolean,
  setLocalMicOn: (value: boolean) => void,
) => {
  const {localStream} = useAppStore.getState();

  localMicOn ? setLocalMicOn(false) : setLocalMicOn(true);
  localStream?.getAudioTracks().forEach(track => {
    localMicOn ? (track.enabled = false) : (track.enabled = true);
  });
};

// // Function to switch camera side (front/back)
//   function switchCamera() {
//     localStream.getVideoTracks().forEach(track => {
//       track._switchCamera();
//     });
//   }

//   // Function to enable/disable camera
//   function toggleCamera() {
//     localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
//     localStream.getVideoTracks().forEach(track => {
//       localWebcamOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   // Function to enable/disable Mic
//   function toggleMic() {
//     localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
//     localStream.getAudioTracks().forEach(track => {
//       localMicOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   // Function to leave the call (Destroys webRTC connection)
//   function leave() {
//     peerConnection.current.close();
//     setlocalStream(null);
//     setType('JOIN');
//   }
