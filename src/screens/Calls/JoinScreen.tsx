import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
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
      // Create new RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          {urls: 'stun:stun.l.google.com:19302'},
          {urls: 'stun:stun1.l.google.com:19302'},
        ],
      });

      // Handle ICE candidates
      pc.onicecandidate = async event => {
        console.log('Inside onicecandidate');

        if (event.candidate && caller) {
          socket?.emit('ICECandidate', {
            ICECandidateReceived: useAppStore.getState().selectedChatData?._id,
            candidate: event.candidate,
          });
        }
      };

      // Handle incoming streams
      pc.ontrack = event => {
        if (event.streams?.[0]) {
          updateWebRTCState({remoteStream: event.streams[0]});
        }
      };

      // Get user media
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: isVideoCall
          ? {
              width: 500,
              height: 300,
              frameRate: 30,
              facingMode: isFrontCamera ? 'user' : 'environment',
            }
          : false,
      });

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      updateWebRTCState({
        localStream: stream,
        peerConnection: pc,
        isVideoEnabled: isVideoCall,
      });

      return pc;
    } catch (error) {
      console.error('Error initializing call:', error);
      Alert.alert('Error', 'Failed to initialize call');
      handleEndCall();
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    const recipientId =
      caller?._id === useAppStore.getState().id
        ? useAppStore.getState().selectedChatData?._id
        : caller?._id;

    socket?.emit('endCall', {
      recipientId: recipientId,
    });

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

  const handleIncomingCall = async () => {
    if (!offer || !caller) {
      return;
    }

    try {
      const pc = await initializeCall(callType === 'video');
      if (!pc) {
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket?.emit('answer', {
        callerId: caller._id,
        answer,
      });

      updateWebRTCState({callState: 'active'});
    } catch (error) {
      console.error('Error handling incoming call:', error);
      Alert.alert('Error', 'Failed to accept call');
      handleEndCall();
    }
  };

  const handleOutgoingCall = async () => {
    if (!caller) {
      return;
    }

    try {
      const pc = await initializeCall(callType === 'video');
      if (!pc) {
        return;
      }

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: callType === 'video',
      });

      await pc.setLocalDescription(offer);

      socket.emit('initiateCall', {
        caller,
        recipientId: useAppStore.getState().selectedChatData?._id,
        offer,
        callType,
      });
    } catch (error) {
      console.error('Error making outgoing call:', error);
      Alert.alert('Error', 'Failed to make call');
      handleEndCall();
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      updateWebRTCState({isMuted: !isMuted});
    }
  };

  const toggleVideo = () => {
    if (localStream && callType === 'video') {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      updateWebRTCState({isVideoEnabled: !isVideoEnabled});
    }
  };

  const switchCamera = () => {
    if (localStream && callType === 'video') {
      localStream.getVideoTracks().forEach(track => {
        // @ts-ignore: React Native WebRTC specific method
        track._switchCamera();
      });
      updateWebRTCState({isFrontCamera: !isFrontCamera});
    }
  };

  useEffect(() => {
    if (callState === 'incoming') {
      handleIncomingCall();
    } else if (callState === 'outgoing') {
      handleOutgoingCall();
    }

    return () => {
      // Cleanup if component unmounts during active call
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }

      socket?.off('ICECandidateReceived');
    };
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

      <View style={styles.controls}>
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
      </View>
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
