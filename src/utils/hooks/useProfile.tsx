import {Alert} from 'react-native';
import {UPDATE_USER_PROFILE_PIC} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';

const useProfile = () => {
  const {setUserPersona, updateKeys, navigation} = useAppStore();

  const updateProfilePic = async (avatar: number): Promise<void> => {
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

  const selectAvatar = (avatar: number): void => {
    setUserPersona({avatar: avatar});
    updateKeys({bottomSheetType: null});
    navigation?.navigate('CreatePin');
  };

  return {updateProfilePic, selectAvatar};
};

export default useProfile;
