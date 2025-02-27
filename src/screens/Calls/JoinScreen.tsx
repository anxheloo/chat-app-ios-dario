import React, {useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  RTCView,
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
  mediaDevices,
  RTCPeerConnection,
} from 'react-native-webrtc';

import {useAppStore} from '../../store';

import BtnGroup from './components/BtnGroup';
import AudioUserDetails from './components/AudioUserDetails';

import {servers} from '../../utils/webrtc';
import VideoCallHeader from './components/VideoCallHeader';

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

const JoinScreen = () => {
  const callState = useAppStore(state => state.callState);
  const callType = useAppStore(state => state.callType);
  const localStream = useAppStore(state => state.localStream);
  const remoteStream = useAppStore(state => state.remoteStream);
  const socket = useAppStore(state => state.socket);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);
  const resetCallState = useAppStore(state => state.resetCallState);

  useEffect(() => {
    if (callState === 'outgoing') {
      initializeCall(callType === 'video');
    }

    return () => {
      resetCallState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeCall = async (isVideoCall: boolean) => {
    const {username, id, avatar} = useAppStore.getState();

    console.log('THis is socket inside intitializeCall:,', socket);

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

  return (
    <SafeAreaView style={styles.container}>
      {callState === 'active' && callType === 'video' && <VideoCallHeader />}

      {callType === 'video' && remoteStream ? (
        <RTCView
          mirror={true}
          streamURL={remoteStream?.toURL()}
          style={styles.remoteStream}
          objectFit="cover"
        />
      ) : (
        <AudioUserDetails />
      )}

      {callType === 'video' && localStream && (
        <RTCView
          mirror={true}
          streamURL={localStream?.toURL()}
          style={styles.localStream}
          objectFit="cover"
        />
      )}

      <BtnGroup />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    zIndex: 1,
  },
  remoteStream: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    zIndex: 2,
  },
  localStream: {
    position: 'absolute',
    top: 160,
    right: 20,
    width: 100,
    height: 140,
    backgroundColor: '#4a4a4a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'white',
    zIndex: 3,
  },
  status: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#ff4646',
  },
  endCallButton: {
    backgroundColor: '#ff4646',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default JoinScreen;
