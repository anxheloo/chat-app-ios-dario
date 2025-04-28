import {useEffect} from 'react';
import {Alert} from 'react-native';

import {useAppStore} from '../../store';

import {closePeerConnection} from '../webrtc';

import {goBack} from '../../navigation/navigationRef';

const useWebRTC = () => {
  const peerConnection = useAppStore(state => state.peerConnection);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);

  useEffect(() => {
    if (!peerConnection) {
      return;
    }

    // --- Signaling State Changes
    peerConnection.onsignalingstatechange = () => {
      switch (peerConnection.signalingState) {
        case 'stable':
          console.log('ICE negotiation complete');
          break;
        case 'closed':
          console.log('Signaling closed');
          // closePeerConnection();
          // goBack();
          break;
      }
    };

    // --- ICE Candidate Errors
    peerConnection.onicecandidateerror = (event: any) => {
      console.error('ICE candidate error:', {
        errorCode: event.errorCode,
        errorText: event.errorText,
        url: event.url,
      });
    };

    // --- ICE Connection State Changes
    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState;
      console.log('ICE connection state:', state);
      switch (state) {
        case 'connected':
        case 'completed':
          console.log('Call connected');
          // updateWebRTCState({callState: 'active'});
          break;
        case 'failed':
          console.error('ICE connection failed');
          Alert.alert(
            'Error',
            'Call connection failed. Please check your network.',
          );
          closePeerConnection();
          goBack();
          break;
        case 'disconnected':
          console.log('Call disconnected');
          break;
        case 'closed':
          console.log('Call closed');
          break;
      }
    };

    peerConnection.onconnectionstatechange = async (ev: any) => {
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
          console.log('call closed');
          break;
        case 'failed':
          Alert.alert('Connection Error', 'Call connection failed.');
          closePeerConnection();
          goBack();
          console.log('Error', ev);
          break;
      }
    };

    return () => {
      peerConnection.onsignalingstatechange = null;
      peerConnection.onicecandidateerror = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.onconnectionstatechange = null;
      updateWebRTCState({disabledButtons: false});
    };
  }, [peerConnection, updateWebRTCState]);
};

export default useWebRTC;
