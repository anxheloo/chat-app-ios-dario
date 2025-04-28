import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {useAppStore} from '../../store';

const useAppState = (onForeground?: () => void) => {
  const appState = useRef(AppState.currentState);
  const {updateKeys} = useAppStore.getState();
  const askingPermission = useAppStore(state => state.askingPermission);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (appState.current.match(/inactive|background/) && state === 'active') {
        if (!askingPermission) {
          updateKeys({pinModal: true});
        } else {
          updateKeys({askingPermission: false});
        }

        if (onForeground) {
          onForeground(); // Trigger function when app becomes active
        }
      }

      appState.current = state;
    });

    return () => {
      subscription.remove();
    };
  }, [askingPermission, onForeground, updateKeys]);
};

export default useAppState;
