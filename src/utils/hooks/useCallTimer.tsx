import {useEffect, useRef, useState} from 'react';

import {useAppStore} from '../../store';

import {formatDuration} from '../helpers';

import {endCall} from '../webrtc';

const useCallTimer = () => {
  const callState = useAppStore(state => state.callState);
  const disabledButtons = useAppStore(state => state.disabledButtons);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);
  const [timer, setTimer] = useState(0);

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Count down for the call timer when call is active or pause it when call is ended
  useEffect(() => {
    if (!interval.current && callState === 'active') {
      interval.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
        updateWebRTCState({callTimer: timer});
      }, 1000);
    } else if (disabledButtons && interval.current) {
      clearInterval(interval.current);
    }

    // return () => {
    //   if (interval.current) {
    //     clearInterval(interval.current);
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState, disabledButtons]);

  // Call timeout after 20 seconds
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
