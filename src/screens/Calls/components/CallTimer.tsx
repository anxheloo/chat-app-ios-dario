import {useEffect, useState} from 'react';

import {useAppStore} from '../../../store';

import {formatDuration} from '../../../utils/helpers';

const useCallTimer = () => {
  const callState = useAppStore(state => state.callState);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number;

    if (callState === 'active') {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
        updateWebRTCState({callTimer: timer});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState]);

  return formatDuration(timer);
};

export default useCallTimer;
