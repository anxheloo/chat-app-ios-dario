import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

const CheckInternet = () => {
  const [hasInternet, setHasInternet] = useState(true);

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(state => {
      setHasInternet(!!state.isConnected);
    });

    return () => {
      netInfoSubscription();
    };
  }, []);

  const handleTryAgain = async () => {
    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected) {
      setHasInternet(true);
    }
  };

  return {hasInternet, handleTryAgain};
};

export default CheckInternet;
