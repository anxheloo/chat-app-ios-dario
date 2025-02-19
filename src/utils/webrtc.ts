import {
  RTCPeerConnection,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';

export const servers = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
  ],
};

// 🔹 Function to initialize WebRTC Connection
export const createPeerConnection = (onTrack: any, onICECandidate: any) => {
  const peerConnection = new RTCPeerConnection(servers);

  // 🔹 Handle when remote tracks are received
  peerConnection.ontrack = event => {
    if (event.streams[0]) {
      onTrack(event.streams[0]);
    }
  };

  // 🔹 Handle ICE candidates
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      onICECandidate(event.candidate);
    }
  };

  return peerConnection;
};

// 🔹 Function to get user media
export const getLocalStream = async (isVideo: boolean) => {
  return await mediaDevices.getUserMedia({
    audio: true,
    video: isVideo
      ? {width: 500, height: 300, frameRate: 30, facingMode: 'user'}
      : false,
  });
};

// 🔹 Function to clean up WebRTC resources
export const closePeerConnection = (
  peerConnection: RTCPeerConnection,
  localStream: MediaStream,
) => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  if (peerConnection) {
    peerConnection.close();
  }
};
