/* eslint-disable react-native/no-inline-styles */
import React, {memo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {
  acceptCall,
  endCall,
  toggleCamera,
  toggleMic,
} from '../../../utils/webrtc';

import useCallTimer from '../../../utils/hooks/useCallTimer';

import {useAppStore} from '../../../store';
import {COLORS} from '../../../theme/theme';

import ReusableText from '../../../components/ReusableText';

import VideoOff from '../../../assets/icons/Calls/VideoOff.svg';
import VideoOn from '../../../assets/icons/Calls/VideoOn.svg';
import MicOff from '../../../assets/icons/Calls/MicOff.svg';
import MicOn from '../../../assets/icons/Calls/MicOn.svg';
import EndCallIcon from '../../../assets/icons/Calls/EndCall.svg';
import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';

const BtnGroup = memo(() => {
  const callState = useAppStore(state => state.callState);
  const callType = useAppStore(state => state.callType);
  const isVideoEnabled = useAppStore(state => state.isVideoEnabled);

  // Count down for the call timer
  const timer = useCallTimer();

  const [localMicOn, setlocalMicOn] = useState(true);
  const isIncoming = callState === 'incoming';
  const isActive = callState === 'active';

  return (
    <View style={styles.container}>
      <ReusableText fontSize={14} fontWeight={400} color="white">
        {isActive
          ? timer
          : isIncoming
          ? `Incoming ${callType} call...`
          : 'Calling...'}
      </ReusableText>

      <View style={[styles.btnContainer, {gap: isIncoming ? 70 : 30}]}>
        {!isIncoming && (
          <TouchableOpacity
            disabled={callType === null}
            style={styles.sideBtn}
            onPress={() => toggleMic(localMicOn, setlocalMicOn)}>
            {localMicOn ? <MicOff /> : <MicOn />}
          </TouchableOpacity>
        )}

        <View style={[styles.middleBtnContainer, {borderColor: '#FF675C'}]}>
          <TouchableOpacity
            disabled={callType === null}
            style={[styles.middleBtn, {backgroundColor: '#FF675C'}]}
            onPress={endCall}>
            <EndCallIcon />
          </TouchableOpacity>
        </View>

        {isIncoming && (
          <View style={[styles.middleBtnContainer, {borderColor: '#98FB98'}]}>
            <TouchableOpacity
              disabled={callType === null}
              style={[styles.middleBtn, {backgroundColor: '#98FB98'}]}
              onPress={acceptCall}>
              <CallIcon width={24} height={24} fill={'white'} />
            </TouchableOpacity>
          </View>
        )}

        {!isIncoming && (
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={toggleCamera}
            disabled={callType === 'audio' || callType === null}>
            {isVideoEnabled ? <VideoOff /> : <VideoOn />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 20,
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
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
    backgroundColor: COLORS.White,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BtnGroup;
