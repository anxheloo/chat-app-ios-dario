import {useEffect, useState} from 'react';

import {useAppStore} from '../../store';

import {formatDuration} from '../helpers';

import {endCall} from '../webrtc';

const useCallTimer = () => {
  const callState = useAppStore(state => state.callState);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (callState === 'active') {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
        updateWebRTCState({callTimer: timer});
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleUnAnsweredCall = async () => {
      if (callState === 'pending') {
        timeoutId = setTimeout(async () => {
          await endCall();
        }, 20000);
      }
    };

    handleUnAnsweredCall();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [callState]);

  return formatDuration(timer);
};

export default useCallTimer;
