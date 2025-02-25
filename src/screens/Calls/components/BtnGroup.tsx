/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';

import {handleEndCall, servers} from '../../../utils/webrtc';

import {useAppStore} from '../../../store';

import ReusableText from '../../../components/ReusableText';

import VideoOff from '../../../assets/icons/Calls/VideoOff.svg';
import VideoOn from '../../../assets/icons/Calls/VideoOn.svg';
import MicOff from '../../../assets/icons/Calls/MicOff.svg';
import MicOn from '../../../assets/icons/Calls/MicOn.svg';
import EndCallIcon from '../../../assets/icons/Calls/EndCall.svg';
import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';

import {
  mediaDevices,
  RTCSessionDescription,
  RTCPeerConnection,
} from 'react-native-webrtc';

const BtnGroup = () => {
  const callType = useAppStore(state => state.callType);
  const callState = useAppStore(state => state.callState);
  const socket = useAppStore(state => state.socket);
  const offer = useAppStore(state => state.offer);
  const caller = useAppStore(state => state.caller);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);

  const [localMicOn, setlocalMicOn] = useState(true);

  const isIncoming = callState === 'incoming';
  const isActive = callState === 'active';

  const toggleCamera = () => {
    const {localStream} = useAppStore.getState();

    callType === 'video'
      ? updateWebRTCState({callType: 'audio'})
      : updateWebRTCState({callType: 'video'});
    localStream?.getVideoTracks().forEach(track => {
      callType === 'video' ? (track.enabled = false) : (track.enabled = true);
    });
  };
  const toggleMic = () => {
    const {localStream} = useAppStore.getState();

    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream?.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  };

  const acceptCall = async () => {
    console.log('THis is socket inside acceptCall:', socket);

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

  return (
    <View style={styles.container}>
      <ReusableText fontSize={14} fontWeight={400} color="white">
        {isActive ? '00:00' : isIncoming ? 'Is Calling...' : 'Calling...'}
      </ReusableText>

      <View
        style={[styles.btnContainer, {gap: !isActive && isIncoming ? 70 : 30}]}>
        {!isIncoming && (
          <TouchableOpacity style={styles.sideBtn} onPress={toggleMic}>
            {localMicOn ? <MicOff /> : <MicOn />}
          </TouchableOpacity>
        )}

        <View style={[styles.middleBtnContainer, {borderColor: '#FF675C'}]}>
          <TouchableOpacity
            style={[styles.middleBtn, {backgroundColor: '#FF675C'}]}
            onPress={handleEndCall}>
            <EndCallIcon />
          </TouchableOpacity>
        </View>

        {isIncoming && (
          <View style={[styles.middleBtnContainer, {borderColor: '#98FB98'}]}>
            <TouchableOpacity
              style={[styles.middleBtn, {backgroundColor: '#98FB98'}]}
              onPress={acceptCall}>
              <CallIcon width={24} height={24} fill={'white'} />
            </TouchableOpacity>
          </View>
        )}

        {!isIncoming && (
          <TouchableOpacity style={styles.sideBtn} onPress={toggleCamera}>
            {callType === 'video' ? <VideoOff /> : <VideoOn />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 20,
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    zIndex: 5,
  },

  btnContainer: {
    gap: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  middleBtnContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  middleBtn: {
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF675C',
  },

  sideBtn: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BtnGroup;
