import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../../theme/theme';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import LockIcon from '../../assets/icons/profile/LockIcon';
import ClockIcon from '../../assets/icons/profile/ClockIcon';
import RightIcon from '../../assets/icons/profile/RighArrow';
import {useAppStore} from '../../store';

type SettingType = 'username' | 'qr-code' | 'pin' | 'clock' | 'logout';

type SettingProps = {
  type: SettingType;
  onPress?: () => void;
};

const SettingElement: React.FC<SettingProps> = ({type, onPress}) => {
  const username = useAppStore(state => state.username);

  const returnBasedOnType = {
    username: {
      icon: <Text style={styles.username}>@</Text>,
      text: username,
    },
    'qr-code': {
      icon: <ScanIcon width={16} height={16} />,
      text: 'My QR Code',
    },
    pin: {
      icon: <LockIcon width={16} height={16} />,
      text: 'PIN',
    },
    clock: {
      icon: <ClockIcon width={16} height={16} />,
      text: 'Disappearing Messages',
    },
    logout: {
      icon: null, // No icon for logout
      text: 'Logout',
      // action: handleLogout,
    },
  };

  const {icon, text} = returnBasedOnType[type];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.conditionalView}>
        {icon}
        <Text style={styles.username}>{text}</Text>
      </View>
      <RightIcon width={4} height={8} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LightGray2,
    gap: 15,
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 320,
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
  },

  conditionalView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },

  username: {
    fontWeight: '300',
    color: COLORS.Black,
  },
});

export default SettingElement;
