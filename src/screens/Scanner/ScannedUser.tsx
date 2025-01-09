import * as React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  SAFE_AREA_PADDING,
} from './Constants';
import {NavigationProps} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {BORDERRADIUS} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';

type ScannedUserProps = {
  navigation: NavigationProps;
};
const ScannedUser: React.FC<ScannedUserProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <CloseIcon width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
});

export default ScannedUser;
