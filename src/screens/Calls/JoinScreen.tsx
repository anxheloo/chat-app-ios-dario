/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  RTCView,
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {useAppStore} from '../../store';
import {goBack} from '../../navigation/navigationRef';
import {
  createPeerConnection,
  getLocalStream,
  servers,
} from '../../utils/webrtc';

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
  const caller = useAppStore(state => state.caller);
  const localStream = useAppStore(state => state.localStream);
  const remoteStream = useAppStore(state => state.remoteStream);
  const isMuted = useAppStore(state => state.isMuted);
  const isVideoEnabled = useAppStore(state => state.isVideoEnabled);
  const isFrontCamera = useAppStore(state => state.isFrontCamera);
  const socket = useAppStore(state => state.socket);
  const offer = useAppStore(state => state.offer);
  const peerConnection = useAppStore(state => state.peerConnection);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);

  const initializeCall = async (isVideoCall: boolean) => {
    try {
      // Step 1: Get local media (audio + video if needed)
      const ls = await mediaDevices.getUserMedia({
        audio: true,
        video: isVideoCall
          ? {width: 500, height: 300, frameRate: 30, facingMode: 'user'}
          : false,
      });

      // Step 2: Create Peer Connection
      const pc = new RTCPeerConnection(servers);

      // Step 3: Add Local Stream to Connection
      ls?.getTracks().forEach(track => pc?.addTrack(track, ls));

      // Step 4: Handle Remote Stream
      pc.ontrack = event => {
        console.log('Receiving remote stream:', event.streams[0]);
        updateWebRTCState({remoteStream: event.streams[0]});
      };

      // Step 5: Handle ICE Candidates
      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: useAppStore.getState().selectedChatData?._id,
            candidate: event.candidate,
          });
        }
      };

      // Step 6: Create an Offer and Set Local Description
      const o = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: isVideoCall,
      });

      await pc.setLocalDescription(o);

      // Step 7: Send Offer to Other User
      // socket.emit('offer', {
      //   to: useAppStore.getState().selectedChatData?._id,
      //   offer: o,
      //   caller,
      // });

      socket.emit('incomingCall', {
        to: useAppStore.getState().selectedChatData?._id,
        offer: o,
        caller,
        callType: isVideoCall ? 'video' : 'audio',
      });

      // Step 8: Update State
      updateWebRTCState({
        peerConnection: pc,
        localStream: ls,
      });
    } catch (error) {
      console.error('Error initializing call:', error);
      Alert.alert('Error', 'Failed to initialize call');
    }
  };

  const acceptCall = async () => {
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

      ls.getTracks().forEach(track => pc.addTrack(track, ls));

      // Step 3: Handle Remote Stream
      pc.ontrack = (event: any) => {
        console.log('Receiving remote stream:', event.streams[0]);
        updateWebRTCState({remoteStream: event.streams[0]});
      };

      // Step 4: Handle ICE Candidates
      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: caller?._id,
            candidate: event.candidate,
          });
        }
      };

      // Step 5: Set the Remote Description
      if (offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
      }

      // Step 6: Create an Answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Step 7: Send the Answer back
      socket?.emit('answer', {
        to: caller?._id,
        answer,
      });

      // Step 8: Update State
      updateWebRTCState({
        localStream: ls,
        peerConnection: pc,
        callState: 'active',
      });
    } catch (error) {
      console.log('This is error: ', error);
      console.log('THis is error.response.data:', error.response?.data);
      Alert.alert('Error', 'Incoming call Failed');
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    const to =
      caller?._id === useAppStore.getState().id
        ? useAppStore.getState().selectedChatData?._id
        : caller?._id;

    socket.emit('callRejected', {to});

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

  useEffect(() => {
    if (callState === 'incoming') {
      // handleIncomingCall();
      console.log('Incoming');
    } else if (callState === 'outgoing') {
      initializeCall(callType === 'video');
    }

    return () => {
      // Cleanup if component unmounts during active call
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }

      // socket?.off('ICECandidateReceived');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState]);

  const renderCallStatus = () => {
    switch (callState) {
      case 'incoming':
        return `Incoming ${callType} call from ${caller?.username}`;
      case 'outgoing':
        return `Calling ${caller?.username}...`;
      case 'active':
        return callType === 'video' ? '' : `In call with ${caller?.username}`;
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {callType === 'video' && remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteStream}
          objectFit="cover"
        />
      )}

      {callType === 'video' && localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localStream}
          objectFit="cover"
        />
      )}

      <Text style={styles.status}>{renderCallStatus()}</Text>

      {callState === 'incoming' && (
        <TouchableOpacity onPress={acceptCall}>
          <Text style={{color: 'white'}}>Accept Call</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleEndCall}>
        <Text style={{color: 'white'}}>Decline Call</Text>
      </TouchableOpacity>

      {/* <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}>
          <Text>={isMuted ? 'mic-off' : 'mic'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}>
          <Text>={'decline'}</Text>
        </TouchableOpacity>

        {callType === 'video' && (
          <>
            <TouchableOpacity
              style={[
                styles.controlButton,
                !isVideoEnabled && styles.controlButtonActive,
              ]}
              onPress={toggleVideo}>
              <Text>{isVideoEnabled ? 'videocam' : 'videocam-off'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={switchCamera}>
              <Text>Switch Camera</Text>
            </TouchableOpacity>
          </>
        )}
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  remoteStream: {
    flex: 1,
    backgroundColor: '#2c2c2c',
  },
  localStream: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#4a4a4a',
    borderRadius: 10,
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
