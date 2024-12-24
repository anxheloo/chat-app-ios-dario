import {useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import Header from '../../components/Header/Header';
import Avatar from '../../components/Persona/Avatar';
import SettingElement from './SettingElement';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectAvatar from '../../components/BottomSheet/SelectAvatar';
import {removeToken} from '../../utils/TokenStorage';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import {apiClient} from '../../api/apiClient';
import {UPDATE_USER_PROFILE_PIC} from '../../api/apis';

type ProfileProps = {
  navigation: NavigationProps;
};

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const setToken = useAppStore(state => state.setToken);
  const router = useRoute();
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [clickedSetting, setClickedSetting] = useState<string | null>(null);

  const selectedAvatar = useAppStore.getState();
  const token = useAppStore(state => state.token);

  console.log('This is the route', router.name);

  const cancel = (): void => {
    bottomSheetRef?.current?.close();
  };

  const setFunc = async (): Promise<void> => {
    try {
      const res = await apiClient.post(
        UPDATE_USER_PROFILE_PIC,
        {
          avatar: selectedAvatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('This is res');

      if (res.status === 200) {
        console.log('This is res', res.data);
        setUserPersona({avatar: res.data.avatar});
      }
    } catch (e) {
      console.log(e);
    }

    // bottomSheetRef?.current?.close();
  };

  const handleSettingClick = (type: string): void => {
    setClickedSetting(type);
    bottomSheetRef.current?.expand(); // Expand BottomSheet or open a modal
  };

  const handleLogout = async () => {
    await removeToken();
    setToken(null);

    setUserPersona({username: '', pin: '', avatar: 0});

    navigation.reset({
      index: 0, // The index of the current active route
      routes: [{name: 'Login'}], // Replace the stack with the Login screen
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header />

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
              Profile
            </ReusableText>

            <ReusableText
              fontSize={14}
              fontWeight={FONTWEIGHT[300]}
              color={COLORS.LightGray}
              textAlign="center">
              The username you enter will be visible only to your Solitar
              contact list
            </ReusableText>
          </View>

          <View style={styles.avatarView}>
            <Avatar
              width={80}
              height={80}
              avatarWidth={60}
              avatarHeight={60}
              backgroundColor={COLORS.LightGray2}
              routeName="Profile"
              onPress={() => handleSettingClick('avatar')}
            />
          </View>

          <View style={styles.contentContainer}>
            <SettingElement
              type="username"
              onPress={() => handleSettingClick('username')}
            />
            <SettingElement
              type="qr-code"
              onPress={() => handleSettingClick('qr-code')}
            />
            <SettingElement
              type="pin"
              onPress={() => handleSettingClick('pin')}
            />
            <SettingElement
              type="clock"
              onPress={() => handleSettingClick('clock')}
            />
            <SettingElement type="logout" onPress={handleLogout} />
          </View>
        </View>
      </View>

      <BottomSheetWrapper ref={bottomSheetRef}>
        {/* {clickedSetting === 'username' && <UsernameUpdate cancel={cancel} />} */}
        {clickedSetting === 'avatar' && (
          <SelectAvatar cancel={cancel} setFunc={setFunc} />
        )}
        {/* {clickedSetting === 'qr-code' && <QRCodeModal cancel={cancel} />}
        {clickedSetting === 'pin' && <PinUpdate cancel={cancel} />}
        {clickedSetting === 'clock' && (
          <DisappearingMessagesDropdown cancel={cancel} />
        )} */}
      </BottomSheetWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  content: {
    padding: 20,
    flex: 1,
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
  },

  avatarView: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
});

export default Profile;
