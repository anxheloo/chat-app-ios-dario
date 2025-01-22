import React, {useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import Avatar from '../../components/Persona/Avatar';
import SettingElement from './SettingElement';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectAvatar from '../../components/BottomSheet/SelectAvatar';
import {NavigationProps, SettingType} from '../../utils/types';
import ChangeUsername from '../../components/BottomSheet/ChangeUsername';
import UpdatePin from '../../components/BottomSheet/UpdatePin';
import UpdateDissapear from '../../components/BottomSheet/UpdateDissapear';
import QRCodeModal from '../../components/BottomSheet/QRCodeModal';
import Layout from '../../components/Layout/Layout';
import useProfile from '../../utils/hooks/useProfile';

type ProfileProps = {
  navigation: NavigationProps;
};

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [clickedSetting, setClickedSetting] = useState<string | null>(null);
  const {cancel, handleLogout, handleSettingClick, updateProfilePic} =
    useProfile(navigation, setClickedSetting, bottomSheetRef);

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
    [],
  );

  return (
    <Layout>
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

      <BottomSheetWrapper ref={bottomSheetRef}>
        {clickedSetting === 'username' && <ChangeUsername cancel={cancel} />}
        {clickedSetting === 'avatar' && (
          <SelectAvatar cancel={cancel} setFunc={updateProfilePic} />
        )}
        {clickedSetting === 'pin' && <UpdatePin cancel={cancel} />}
        {clickedSetting === 'clock' && <UpdateDissapear cancel={cancel} />}
        {clickedSetting === 'qr-code' && <QRCodeModal cancel={cancel} />}
      </BottomSheetWrapper>
    </Layout>
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
