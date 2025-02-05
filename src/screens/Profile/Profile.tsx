import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import Avatar from '../../components/Persona/Avatar';
import SettingElement from './SettingElement';
import {NavigationProps, SettingType} from '../../utils/types';
import {useAppStore} from '../../store';
import {removeToken} from '../../utils/TokenStorage';

type ProfileProps = {
  navigation: NavigationProps;
};

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const {
    updateKeys,
    updateFuncChat,
    setUserInfoStatus,
    setToken,
    setUserPersona,
  } = useAppStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const settings = useMemo(
    () =>
      ['username', 'qr-code', 'pin', 'clock', 'logout'].map(type => (
        <SettingElement
          key={type}
          type={type as SettingType}
          onPress={() =>
            type === 'logout'
              ? handleLogout()
              : updateKeys({bottomSheetType: type})
          }
        />
      )),
    [handleLogout, updateKeys],
  );

  return (
    <View style={styles.container}>
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
            The username you enter will be visible only to your Solitar contact
            list
          </ReusableText>
        </View>

        <TouchableOpacity
          style={styles.avatarView}
          onPress={() => updateKeys({bottomSheetType: 'avatar'})}>
          <Avatar
            width={80}
            height={80}
            avatarWidth={60}
            avatarHeight={60}
            backgroundColor={COLORS.LightGray2}
            routeName="Profile"
          />
        </TouchableOpacity>

        <View style={styles.contentContainer}>{settings}</View>
      </View>
    </View>
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
