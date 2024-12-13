import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../../theme/theme';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import LockIcon from '../../assets/icons/profile/LockIcon';
import ClockIcon from '../../assets/icons/profile/ClockIcon';
import RightIcon from '../../assets/icons/profile/RighArrow';
import {useAppStore} from '../../store';

type SettingProps = {
  type: string;
};

const SettingElement: React.FC<SettingProps> = ({type}) => {
  const username = useAppStore(state => state.username);

  const onClick = (): void => {
    console.log('Element clicked');
  };

  const renderIcon = (): JSX.Element | null => {
    switch (type) {
      case 'username':
        return (
          <View style={styles.conditionalView}>
            <Text style={styles.username}>@</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        );
      case 'qr-code':
        return (
          <View style={styles.conditionalView}>
            <ScanIcon width={16} height={16} />
            <Text style={styles.username}>My QR Code</Text>
          </View>
        );
      case 'pin':
        return (
          <View style={styles.conditionalView}>
            <LockIcon width={16} height={16} />
            <Text style={styles.username}>PIN</Text>
          </View>
        );
      case 'clock':
        return (
          <View style={styles.conditionalView}>
            <ClockIcon width={16} height={16} />
            <Text style={styles.username}>Dissapearing Messages</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      {renderIcon()}

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
