import {useEffect, useState} from 'react';

import NetInfo from '@react-native-community/netinfo';
import {useAppStore} from '../../store';

const useInternet = () => {
  const [hasInternet, setHasInternet] = useState(true);
  const initializeSocket = useAppStore(state => state.initializeSocket);

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(state => {
      const isConnected = !!state.isConnected;

      setHasInternet(isConnected);

      // Only use this for socket reconnection
      // if (isConnected) {
      //   console.log('Internet reconnected, attempting to reconnect socket...');
      //   initializeSocket();
      // }
    });

    return () => netInfoSubscription();
  }, [initializeSocket]);

  const handleTryAgain = async () => {
    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected) {
      setHasInternet(true);
      // console.log('Reconnecting socket after internet connection...');
      // initializeSocket();
    }
  };

  return {hasInternet, handleTryAgain};
};

export default useInternet;
