import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';

const useAppState = (onForeground?: () => void) => {
  const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (appState.current.match(/inactive|background/) && state === 'active') {
        console.log('App has come to the foreground!');
        if (onForeground) {
          onForeground(); // Trigger function when app becomes active
        }
      }

      appState.current = state;
      // setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [onForeground]);

  // return appStateVisible;
};

export default useAppState;
