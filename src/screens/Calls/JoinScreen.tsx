/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../store';

import AudioVideoTemplate from './components/AudioVideoTemplate';
import VideoCallHeader from './components/VideoCallHeader';
import BtnGroup from './components/BtnGroup';

const JoinScreen = () => {
  const resetCallState = useAppStore(state => state.resetCallState);
  const peerConnection = useAppStore(state => state.peerConnection);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);
  const callState = useAppStore(state => state.callState);
  const socket = useAppStore(state => state.socket);
  const caller = useAppStore(state => state.caller);
  const selectedChatData = useAppStore(state => state.selectedChatData);

  useEffect(() => {
    return () => {
      resetCallState();
    };
  }, [resetCallState]);

  useEffect(() => {
    if (!peerConnection || !socket) {
      return;
    }

    peerConnection.ontrack = event => {
      if (event.streams?.[0]) {
        console.log('Got remote track');
        updateWebRTCState({remoteStream: event.streams[0]});
      }
    };

    peerConnection.onicecandidate = ({
      candidate,
    }: {
      candidate: RTCIceCandidate;
    }) => {
      if (candidate) {
        let receiverId;

        if (callState === 'incoming') {
          // The current user is the receiver (send ICE to the caller)
          receiverId = caller?._id;
        } else {
          // The current user is the caller (send ICE to the selected chat)
          receiverId = selectedChatData?._id;
        }

        if (!receiverId) {
          console.warn('⚠️ No valid receiver found for ICE Candidate.');
          return;
        }

        console.log(`🔵 Sending ICE Candidate to: ${receiverId}`);
        socket.emit('ICEcandidate', {
          to: receiverId,
          candidate,
        });
      }
    };

    peerConnection.addEventListener('icecandidateerror', event => {
      // You can ignore some candidate errors.
      // Connections can still be made even when errors occur.
      console.log('ice candidate error');
    });

    peerConnection.onsignalingstatechange = ev => {
      switch (peerConnection.signalingState) {
        case 'stable':
          console.log('ICE negotiation complete');
          break;
      }
    };

    peerConnection.oniceconnectionstatechange = ev => {
      switch (peerConnection.iceConnectionState) {
        case 'connected':
        case 'completed':
          // You can handle the call being connected here.
          // Like setting the video streams to visible.
          console.log('call completed');
          console.log('call connected');
          break;
      }
    };

    peerConnection.onconnectionstatechange = ev => {
      switch (peerConnection.connectionState) {
        case 'new':
        case 'connecting':
          console.log('Connecting…');
          break;
        case 'connected':
          console.log('Online');
          break;
        case 'disconnected':
          console.log('Disconnecting…');
          break;
        case 'closed':
          // You can handle the call being disconnected here.
          console.log('call disconnected');
          break;
        case 'failed':
          console.log('Error');
          break;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
        barStyle={'light-content'}
      />
      <AudioVideoTemplate />
      <VideoCallHeader />
      <BtnGroup />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});

export default JoinScreen;
