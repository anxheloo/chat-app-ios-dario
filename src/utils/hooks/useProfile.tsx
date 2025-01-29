import {useCallback} from 'react';
import {Alert, Keyboard} from 'react-native';
import {UPDATE_USER_PROFILE_PIC} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';
import {removeToken} from '../TokenStorage';
import {NavigationProps} from '../types';

const useProfile = (
  navigation: NavigationProps,
  // bottomSheetRef?: React.RefObject<BottomSheet>,
) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const setUserInfoStatus = useAppStore(state => state.setUserInfoStatus);
  const setToken = useAppStore(state => state.setToken);
  const updateKeys = useAppStore(state => state.updateKeys);
  const bottomSheetRef = useAppStore(state => state.bottomSheetRef);
  const avatar = useAppStore(state => state.avatar);
  const token = useAppStore(state => state.token);

  const cancel = (): void => {
    Keyboard.dismiss();
    updateKeys({bottomSheetType: null});
    // bottomSheetRef?.current?.close();
    bottomSheetRef?.close();
  };

  const handleLogout = async () => {
    await removeToken();
    setToken(null);

    setUserPersona({
      username: '',
      pin: '',
      avatar: 0,
    });
    setUserInfoStatus(false);
    updateFuncChat({conversations: [], friends: [], calls: []});

    navigation.reset({
      index: 0, // The index of the current active route
      routes: [{name: 'Login'}], // Replace the stack with the Login screen
    });
  };

  const handleSettingClick = useCallback(
    (type: string): void => {
      updateKeys({bottomSheetType: type});
      // bottomSheetRef?.current?.expand(); // Expand BottomSheet or open a modal
      bottomSheetRef?.expand(); // Expand BottomSheet or open a modal
    },
    [bottomSheetRef, updateKeys],
  );

  const updateProfilePic = async (): Promise<void> => {
    updateKeys({isUploading: true});

    try {
      const res = await apiClient.post(
        UPDATE_USER_PROFILE_PIC,
        {
          avatar: avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        setUserPersona({avatar: res.data.avatar});
        // bottomSheetRef?.current?.close();
        bottomSheetRef?.close();
        Alert.alert('Profile Updated', 'Your avatar has been updated');
      }
    } catch (error: any) {
      updateKeys({isUploading: false});
      Alert.alert('Update Error', error.response.data.message);
    }
  };

  return {cancel, handleLogout, handleSettingClick, updateProfilePic};
};

export default useProfile;
