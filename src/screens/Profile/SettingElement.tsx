import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../../theme/theme';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import LockIcon from '../../assets/icons/profile/LockIcon';
import ClockIcon from '../../assets/icons/profile/ClockIcon';
import RightIcon from '../../assets/icons/profile/RighArrow';
import {useAppStore} from '../../store';
import {removeToken} from '../../utils/TokenStorage';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type SettingProps = {
  type: string;
};

export type RootStackParamList = {
  Login: undefined; // Replace `undefined` with params if Login takes any
  Home: undefined; // Add other screens here
  Chat: undefined;
};

const SettingElement: React.FC<SettingProps> = ({type}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const username = useAppStore(state => state.username);
  const setUserPersona = useAppStore(state => state.setUserPersona);

  const onClick = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => handleLogout(),
      },
    ]);
  };

  const handleLogout = (): void => {
    removeToken();

    setUserPersona({username: '', pin: '', avatar: 0});

    navigation.reset({
      index: 0, // The index of the current active route
      routes: [{name: 'Login'}], // Replace the stack with the Login screen
    });
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
      case 'logout':
        return (
          <View style={styles.conditionalView}>
            {/* <ClockIcon width={16} height={16} /> */}
            <Text style={styles.username}>logout</Text>
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
