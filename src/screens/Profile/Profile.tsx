import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import Avatar from '../../components/Persona/Avatar';
import SettingElement from './SettingElement';
import {NavigationProps, SettingType} from '../../utils/types';
import useProfile from '../../utils/hooks/useProfile';

type ProfileProps = {
  navigation: NavigationProps;
};

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const {handleLogout, handleSettingClick} = useProfile(navigation);

  const settings = useMemo(
    () =>
      ['username', 'qr-code', 'pin', 'clock', 'logout'].map(type => (
        <SettingElement
          key={type}
          type={type as SettingType}
          onPress={() =>
            type === 'logout' ? handleLogout() : handleSettingClick(type)
          }
        />
      )),
    [handleLogout, handleSettingClick],
  );

  return (
    <>
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

          <View style={styles.contentContainer}>{settings}</View>
        </View>
      </View>

      {/* {bottomSheetType !== null &&
        bottomSheetType?.length > 0 &&
        bottomSheetType !== 'PersonasList' && (
          <BottomSheetWrapper ref={bottomSheetRef}>
            {bottomSheetType === 'username' && (
              <ChangeUsername cancel={cancel} />
            )}
            {bottomSheetType === 'avatar' && (
              <SelectAvatar cancel={cancel} setFunc={updateProfilePic} />
            )}
            {bottomSheetType === 'pin' && <UpdatePin cancel={cancel} />}
            {bottomSheetType === 'clock' && <UpdateDissapear cancel={cancel} />}
            {bottomSheetType === 'qr-code' && <QRCodeModal cancel={cancel} />}
          </BottomSheetWrapper>
        )} */}
    </>
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
