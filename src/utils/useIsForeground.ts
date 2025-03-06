import {useState, useEffect} from 'react';
import {AppState} from 'react-native';
import type {AppStateStatus} from 'react-native';

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  console.log('This is isForeground:', isForeground);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      if (state === 'active') {
        setIsForeground(state === 'active');
      }
    };
    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, []);

  return isForeground;
};
