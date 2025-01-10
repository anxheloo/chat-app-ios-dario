import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import type {AlertButton} from 'react-native';
import {
  Alert,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {Code} from 'react-native-vision-camera';
import {useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  SAFE_AREA_PADDING,
} from './Constants';
import {useIsForeground} from '../../utils/useIsForeground';
import {StatusBarBlurBackground} from '../../components/Views/StatusBarBlurBackground';
import {PressableOpacity} from 'react-native-pressable-opacity';
// import IonIcon from 'react-native-vector-icons/Ionicons';
// import type {Routes} from './Routes';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/core';
import {NavigationProps} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

import {BlurView} from '@react-native-community/blur';
import {BORDERRADIUS} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';

// const showCodeAlert = (value: string, onDismissed: () => void): void => {
//   const buttons: AlertButton[] = [
//     {
//       text: 'Close',
//       style: 'cancel',
//       onPress: onDismissed,
//     },
//   ];
//   if (value.startsWith('http')) {
//     console.log('This is a URL');
//     buttons.push({
//       text: 'Open URL',
//       onPress: () => {
//         Linking.openURL(value);
//         onDismissed();
//       },
//     });
//   }
//   Alert.alert('Scanned Code', value, buttons);
// };

// type Props = NativeStackScreenProps<Routes, 'CodeScannerPage'>;

type ScannerScreenProps = {
  navigation: NavigationProps;
};
function ScannerScreen({navigation}: ScannerScreenProps): React.ReactElement {
  // 1. Use a simple default back camera
  const device = useCameraDevice('back');

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  // 3. (Optional) enable a torch setting
  // const [torch, setTorch] = useState(false);

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false);

  // const onCodeScanned = useCallback((codes: Code[]) => {
  //   // console.log(`Scanned ${codes.length} codes:`, codes);
  //   console.log(`Scanned ${codes[0].value}!`);
  //   const value = codes[0]?.value;
  //   if (value == null) return;
  //   if (isShowingAlert.current) return;
  //   showCodeAlert(value, () => {
  //     isShowingAlert.current = false;
  //   });
  //   isShowingAlert.current = true;
  // }, []);

  // Inside onCodeScanned

  const onCodeScanned = useCallback((codes: Code[]) => {
    const userId = codes[0]?.value; // Extract userId from QR code
    if (!userId) return;

    navigation.navigate('ScannedUser', {userId}); // Navigate to UserDetailsScreen
  }, []);

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.textContainer}>
        <ReusableText
          fontSize={26}
          fontWeight={700}
          color={'white'}
          textAlign={'center'}>
          Scan Persona
        </ReusableText>
        <ReusableText
          fontSize={14}
          fontWeight={300}
          color={'white'}
          textAlign={'center'}>
          Place the camera on the other person's QR code
        </ReusableText>
      </View>

      <View style={{flex: 2}}>
        {device != null && (
          <View style={[styles.camera]}>
            <Camera
              style={StyleSheet.absoluteFill}
              // style={styles.camera}
              device={device}
              isActive={isActive}
              codeScanner={codeScanner}
              // torch={torch ? 'on' : 'off'}
              enableZoomGesture={true}
            />
          </View>
        )}
      </View>
      {/* <StatusBarBlurBackground /> */}

      {/* Torch Button - (Blitz) */}
      {/* <View style={styles.rightButtonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTorch(!torch)}>
          <Text>{torch ? 'flash' : 'flash-off'}</Text>
        </TouchableOpacity>
      </View> */}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        {/* <IonIcon name="chevron-back" color="white" size={35} /> */}
        {/* <Text>Go Back</Text> */}
        <CloseIcon width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    gap: 10,
  },

  camera: {
    width: 250,
    height: 250,
    borderRadius: BORDERRADIUS.radius_14,
    overflow: 'hidden',
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
});

export default ScannerScreen;
