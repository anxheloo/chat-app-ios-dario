import {Alert} from 'react-native';

import {useAppStore} from '../store';

import {
  mediaDevices,
  RTCSessionDescription,
  RTCPeerConnection,
} from 'react-native-webrtc';

import {goBack} from '../navigation/navigationRef';

export const servers = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
  ],
};

export const initializeCall = async (isVideoCall: boolean) => {
  const {username, id, avatar, updateWebRTCState, socket} =
    useAppStore.getState();

  try {
    // Create peer connection first
    const pc = new RTCPeerConnection(servers);

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

    // Add tracks to peer connection
    ls.getTracks().forEach(track => {
      pc.addTrack(track, ls);
    });

    // Create and send offer
    const o = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: isVideoCall,
    });

    await pc.setLocalDescription(o);

    // Use consistent event name
    socket?.emit('incomingCall', {
      to: useAppStore.getState().selectedChatData?._id,
      offer: o,
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
      localStream: ls,
    });
  } catch (error) {
    console.error('Error initializing call:', error);
    Alert.alert('Error', 'Failed to initialize call');
  }
};

export const handleEndCall = () => {
  const {
    localStream,
    peerConnection,
    selectedChatData,
    caller,
    updateWebRTCState,
    socket,
  } = useAppStore.getState();
  const receiverId = caller?._id ? caller?._id : selectedChatData?._id;

  if (localStream) {
    console.log('localStream');
    localStream?.getTracks().forEach(track => track.stop());
    localStream?.getAudioTracks().forEach(track => {
      track.enabled = false;
    });
  }

  if (peerConnection) {
    console.log('peerCOnnection');
    peerConnection.close();
  }

  socket.emit('callRejected', {to: receiverId});

  updateWebRTCState({
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    callState: 'idle',
    callType: null,
    caller: null,
    offer: null,
    answer: null,
  });

  goBack();
};

export const acceptCall = async () => {
  const {offer, caller, socket, updateWebRTCState, callType} =
    useAppStore.getState();

  if (!offer || !caller) {
    return;
  }

  try {
    // Step 1: Create a Peer Connection
    const pc = new RTCPeerConnection(servers);

    // Step 2: Handle Remote Stream
    pc.ontrack = (event: any) => {
      console.log('Receiving remote stream:', event.streams[0]);
      updateWebRTCState({remoteStream: event.streams[0]});
    };

    // Step 3: Handle ICE Candidates
    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket?.emit('ice-candidate', {
          to: caller?._id,
          candidate: event.candidate,
        });
      }
    };

    // Step 4: Get local stream (microphone/video)
    const ls = await mediaDevices.getUserMedia({
      audio: true,
      video:
        callType === 'video'
          ? {width: 500, height: 300, frameRate: 30, facingMode: 'user'}
          : false,
    });

    ls.getTracks().forEach(track => pc.addTrack(track, ls));

    // Step 5: Set the Remote Description
    if (offer) {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
    }

    // Step 6: Create an Answer
    const a = await pc.createAnswer();
    await pc.setLocalDescription(a);

    // Step 7: Send the Answer back
    socket?.emit('answer', {
      to: caller?._id,
      answer: a,
    });

    // Step 8: Update State
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
