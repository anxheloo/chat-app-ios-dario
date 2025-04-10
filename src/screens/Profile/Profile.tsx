import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import ReusableText from '../../components/ReusableText';
import Avatar from '../../components/Persona/Avatar';
import SettingElement from './SettingElement';

import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';

import {useAppStore} from '../../store';
import {NavigationProps, SettingType} from '../../utils/types';
import {logout} from '../../utils/helpers';

type ProfileProps = {
  navigation: NavigationProps;
};

const Profile: React.FC<ProfileProps> = () => {
  const {updateKeys} = useAppStore.getState();

  const settings = useMemo(
    () =>
      ['username', 'qr-code', 'pin', 'clock', 'logout'].map(type => (
        <SettingElement
          key={type}
          type={type as SettingType}
          onPress={() =>
            type === 'logout' ? logout() : updateKeys({bottomSheetType: type})
          }
        />
      )),
    [updateKeys],
  );

  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
