import {Alert} from 'react-native';

import {apiClient} from '../api/apiClient';
import {UPDATE_USER_PROFILE_PIC} from '../api/apis';

import {useAppStore} from '../store';

import {navigate, replace, reset} from '../navigation/navigationRef';

// import {saveToken} from './TokenStorage';

import {jwtDecode} from 'jwt-decode';
import {decryptPrivateKey} from './encryption';

export const updateProfilePic = async (avatar: number): Promise<void> => {
  const {setUserPersona, updateKeys} = useAppStore.getState();

  updateKeys({isUploading: true});

  try {
    const res = await apiClient.post(UPDATE_USER_PROFILE_PIC, {
      avatar: avatar,
    });

    if (res.status === 200) {
      setUserPersona({avatar: res.data.avatar});
      updateKeys({bottomSheetType: null});
      Alert.alert('Profile Updated', 'Your avatar has been updated');
    }
  } catch (error: any) {
    updateKeys({isUploading: false});
    Alert.alert('Update Error', error.response.data.message);
  }
};

export const selectAvatar = (avatar: number): void => {
  const {setUserPersona, updateKeys} = useAppStore.getState();
  setUserPersona({avatar: avatar});
  updateKeys({bottomSheetType: null});
  navigate('CreatePin');
};

// REGISTER
// export const handleRegister = async () => {
//   console.log('Inside Handle Register');

//   const {updateKeys, username, pin, avatar} = useAppStore.getState();

//   updateKeys({loading: true});
//   try {
//     const response = await apiClient.post(SIGNUP_ROUTES, {
//       username,
//       pin,
//       avatar,
//     });

//     if (response.status === 201) {
//       console.log('This is response success');

//       updateKeys({loading: false, message: 'Registered Successful'});

//       await saveToken(response.data.token);

//       reset('BottomTabNavigation');
//     }
//   } catch (error: any) {
//     //   setUserPersona({username: '', pin: '', avatar: 0});
//     Alert.alert('Register Error', error?.response.data.message);
//   } finally {
//     updateKeys({loading: false});
//   }
// };

export const handleLogin = async (
  pin: string,
  setPin: (pin: string) => void,
) => {
  const {token, setUserPersona, updateKeys, isUserInfoFetched} =
    useAppStore.getState();

  try {
    // 1.Extract userId from token
    const {userId} = jwtDecode<{userId: string; username: string}>(token!);
    // 2. Decrypt private key using the pin
    const decryptedPrivateKey = await decryptPrivateKey(pin, userId);

    if (decryptedPrivateKey && userId) {
      // If user info is already fetched means the app is coming from background, so we don't need to reset the navigation but show the actual screen
      if (!isUserInfoFetched) {
        replace('BottomTabNavigation');
      }
      // 3. Store the decrypted private key in the app state in memory
      setUserPersona({privateKey: decryptedPrivateKey});
      updateKeys({pinModal: false});
    } else {
      Alert.alert('Incorrect PIN', 'Please try again');
      return;
    }
  } catch (error) {
    reset('CreatePersona');
    console.error('Login error:', error);
    Alert.alert('Login failed', 'Please try again');
  } finally {
    setPin('');
  }
};
