import {
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
} from 'react-native-webrtc';

declare module 'react-native-webrtc' {
  interface RTCPeerConnection {
    ontrack: (event: RTCTrackEvent) => void;
    onicecandidate:
      | ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any)
      | null;
    addIceCandidate(candidate: RTCIceCandidate): Promise<void>;
  }

  interface RTCTrackEvent {
    streams: MediaStream[];
    track: MediaStreamTrack;
  }

  interface RTCPeerConnectionIceEvent {
    candidate: RTCIceCandidate | null;
  }
}
