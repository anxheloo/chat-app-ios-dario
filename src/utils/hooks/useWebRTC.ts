import {useEffect} from 'react';
import {useAppStore} from '../../store';
import {goBack} from '../../navigation/navigationRef';
import {closePeerConnection} from '../webrtc';

const useWebRTC = () => {
  // const peerConnection = useRef<RTCPeerConnection | null>(null);
  // const localStream = useRef<any>(null);
  // const remoteStream = useRef<any>(null);
  // let remoteCandidates: any[] = [];

  // const createPeerConnection = useCallback(async () => {
  //   const {callState, callType, selectedChatData, caller, socket} =
  //     useAppStore.getState();

  //   if (peerConnection.current) {
  //     return peerConnection.current;
  //   }

  //   let mediaConstraints = {
  //     audio: true,
  //     video: {
  //       frameRate: 30,
  //       facingMode: 'user',
  //     },
  //   };

  //   try {
  //     const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

  //     if (callType === 'audio') {
  //       let videoTrack = await mediaStream.getVideoTracks()[0];
  //       videoTrack.enabled = false;
  //     }

  //     localStream.current = mediaStream;
  //   } catch (err) {
  //     // Handle Error
  //   }

  //   peerConnection.current = new RTCPeerConnection(servers);

  //   peerConnection.current.addEventListener('connectionstatechange', event => {
  //     switch (peerConnection.current?.connectionState) {
  //       case 'closed':
  //         // You can handle the call being disconnected here.
  //         console.log('Call disconnected');
  //         break;
  //     }
  //   });

  //   peerConnection.current.addEventListener('icecandidate', event => {
  //     // When you find a null candidate then there are no more candidates.
  //     // Gathering of candidates has finished.
  //     if (!event.candidate) {
  //       return;
  //     }

  //     console.log('This is icecandidate listener');

  //     // Send the event.candidate onto the person you're calling.
  //     // Keeping to Trickle ICE Standards, you should send the candidates immediately.
  //   });

  //   peerConnection.current.addEventListener('icecandidateerror', event => {
  //     // You can ignore some candidate errors.
  //     // Connections can still be made even when errors occur.
  //     console.log('ice candidate error');
  //   });

  //   peerConnection.current.addEventListener(
  //     'iceconnectionstatechange',
  //     event => {
  //       switch (pc.iceConnectionState) {
  //         case 'connected':
  //         case 'completed':
  //           // You can handle the call being connected here.
  //           // Like setting the video streams to visible.
  //           console.log('call completed');
  //           console.log('call connected');
  //           break;
  //       }
  //     },
  //   );

  //   peerConnection.current.addEventListener('signalingstatechange', event => {
  //     switch (pc.signalingState) {
  //       case 'closed':
  //         // You can handle the call being disconnected here.
  //         console.log('call disconnected');
  //         break;
  //     }
  //   });

  //   peerConnection.current.onicecandidate = ({candidate}) => {
  //     if (candidate) {
  //       let receiverId;

  //       if (callState === 'incoming') {
  //         // The current user is the receiver (send ICE to the caller)
  //         receiverId = caller?._id;
  //       } else {
  //         // The current user is the caller (send ICE to the selected chat)
  //         receiverId = selectedChatData?._id;
  //       }

  //       if (!receiverId) {
  //         console.warn('⚠️ No valid receiver found for ICE Candidate.');
  //         return;
  //       }

  //       console.log(`🔵 Sending ICE Candidate to: ${receiverId}`);
  //       socket.emit('ICEcandidate', {
  //         to: receiverId,
  //         candidate,
  //       });
  //     }
  //   };

  //   peerConnection.current.ontrack = event => {
  //     if (event.streams?.[0]) {
  //       console.log('🎥 Got Remote Stream');
  //       remoteStream.current = event.streams[0];
  //       // updateWebRTCState({remoteStream: remoteStream.current});
  //     }
  //   };

  //   localStream.current
  //     ?.getTracks()
  //     .forEach((track: any) =>
  //       peerConnection.current?.addTrack(track, localStream.current),
  //     );

  //   // peerConnection.current.addEventListener('track', event => {
  //   //   // Grab the remote track from the connected participant.
  //   //   console.log('Getting remote track');
  //   //   remoteStream.current = remoteStream.current || new MediaStream();
  //   //   remoteStream.current.addTrack(event.track, remoteStream.current);
  //   // });

  //   return peerConnection.current;
  // }, []);

  // const createOffer = async (isVideoCall: boolean) => {
  //   const {selectedChatData, socket, id, username, avatar} =
  //     useAppStore.getState();

  //   const pc = await createPeerConnection();

  //   try {
  //     const currentCall = await createCallUI();

  //     const offerDescription = await peerConnection.current?.createOffer({
  //       offerToReceiveAudio: true,
  //       offerToReceiveVideo: true,
  //     });

  //     await pc.setLocalDescription(offerDescription);

  //     // Send the offerDescription to the other participant.
  //     socket?.emit('incomingCall', {
  //       to: selectedChatData?._id,
  //       offer: offerDescription,
  //       caller: {
  //         _id: id,
  //         username,
  //         avatar,
  //       },
  //       callType: isVideoCall ? 'video' : 'audio',
  //       currentCall,
  //     });
  //   } catch (err) {
  //     // Handle Errors
  //   }
  // };

  // const handleRemoteCandidate = (iceCandidate: RTCIceCandidate) => {
  //   iceCandidate = new RTCIceCandidate(iceCandidate);

  //   if (peerConnection.current?.remoteDescription == null) {
  //     return remoteCandidates.push(iceCandidate);
  //   }

  //   return peerConnection.current?.addIceCandidate(iceCandidate);
  // };

  // const processCandidates = () => {
  //   if (remoteCandidates.length < 1) {
  //     return;
  //   }

  //   remoteCandidates.map(candidate =>
  //     peerConnection.current?.addIceCandidate(candidate),
  //   );
  //   remoteCandidates = [];
  // };

  // const createAnswer = async () => {
  //   const {socket, caller, offer, callType} = useAppStore.getState();

  //   try {
  //     let status: boolean;

  //     if (callType === 'audio') {
  //       const micStatus = await checkPermissionStatus(permission.microphone);
  //       status = micStatus;
  //     } else {
  //       const micStatus = await checkPermissionStatus(permission.microphone);
  //       const cameraStatus = await checkPermissionStatus(permission.camera);

  //       status = micStatus && cameraStatus;
  //     }

  //     if (!status) {
  //       Alert.alert('Error', 'Please enable microphone and camera');
  //       return;
  //     }

  //     if (!offer) {
  //       console.log('No offer received!');
  //       return;
  //     }

  //     const pc = await createPeerConnection();

  //     // Use the received offerDescription
  //     const offerDescription = new RTCSessionDescription(offer);
  //     await pc.setRemoteDescription(offerDescription);

  //     const answerDescription = await pc.createAnswer();
  //     await pc.setLocalDescription(answerDescription);

  //     // Here is a good place to process candidates.
  //     processCandidates();

  //     // Send the answerDescription back as a response to the offerDescription.

  //     socket?.emit('answer', {to: caller?._id, answer: answerDescription});
  //     updateWebRTCState({
  //       callState: 'active',
  //     });
  //   } catch (err) {
  //     // Handle Errors
  //   }

  //   await callUpdate('answered');
  // };

  // //   Listeners
  // const answer = async ({answer}: {answer: any}) => {
  //   try {
  //     // Use the received answerDescription
  //     const answerDescription = new RTCSessionDescription(answer);
  //     await peerConnection.current?.setRemoteDescription(answerDescription);
  //   } catch (err) {
  //     // Handle Error
  //   }
  // };
  // const incomingCall = async ({offer, caller, callType, currentCall}: any) => {
  //   const {updateCalls} = useAppStore.getState();

  //   updateCalls(currentCalls => [
  //     currentCall,
  //     ...currentCalls.filter(c => c && c?._id !== currentCall?.id),
  //   ]);

  //   updateWebRTCState({
  //     callState: 'incoming',
  //     caller,
  //     offer,
  //     callType,
  //     currentCall,
  //   });

  //   navigate('JoinScreen');
  // };

  const peerConnection = useAppStore(state => state.peerConnection);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);
  const callState = useAppStore(state => state.callState);
  const socket = useAppStore(state => state.socket);
  const caller = useAppStore(state => state.caller);
  const selectedChatData = useAppStore(state => state.selectedChatData);

  useEffect(() => {
    if (!peerConnection || !socket) {
      return;
    }

    peerConnection.ontrack = event => {
      if (event.streams?.[0]) {
        console.log('Got remote track');
        updateWebRTCState({remoteStream: event.streams[0]});
      } else {
        console.log('No remote track');
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

        default:
          console.log('default');
      }
    };

    peerConnection.onconnectionstatechange = async ev => {
      switch (peerConnection.connectionState) {
        case 'new':
        case 'connecting':
          console.log('Connecting…');
          break;
        case 'connected':
          console.log('Online');
          updateWebRTCState({
            callState: 'active',
          });
          break;
        case 'disconnected':
          console.log('Disconnecting…');
          break;
        case 'closed':
          // You can handle the call being closed here.
          // closePeerConnection();
          // resetCallState();
          goBack();
          console.log('call closed');
          break;
        case 'failed':
          closePeerConnection();
          // resetCallState();
          goBack();
          console.log('Error', ev.error);
          break;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useWebRTC;
