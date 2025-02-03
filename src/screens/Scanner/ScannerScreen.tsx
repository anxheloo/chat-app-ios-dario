import React, {useEffect} from 'react';
import {useCallback} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import type {Code} from 'react-native-vision-camera';
import {useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {SAFE_AREA_PADDING} from './Constants';
import {useIsForeground} from '../../utils/useIsForeground';
import {NavigationProps} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {BlurView} from '@react-native-community/blur';
import {BORDERRADIUS} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';
import {usePermission} from '../../utils/usePermission';
import {useIsFocused} from '@react-navigation/native';

type ScannerScreenProps = {
  navigation: NavigationProps;
};
function ScannerScreen({navigation}: ScannerScreenProps): React.ReactElement {
  const {requestCameraPermission} = usePermission();

  useEffect(() => {
    const request = async () => {
      const hasPermission = await requestCameraPermission();
      return hasPermission;
    };

    const hasPermission = request();

    if (!hasPermission) {
      navigation.goBack();
    }
  }, [navigation, requestCameraPermission]);

  // 1. Use a simple default back camera

  const device = useCameraDevice('back');

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      const recipientId = codes[0]?.value; // Extract userId from QR code
      if (!recipientId) {
        return;
      }

      navigation.navigate('ScannedUser', {recipientId}); // Navigate to UserDetailsScreen
    },
    [navigation],
  );

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={StyleSheet.absoluteFill}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="black"
        />
      </View>

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

      <View style={styles.cameraContainer}>
        {device != null && (
          <View style={[styles.camera]}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              codeScanner={codeScanner}
              enableZoomGesture={true}
            />
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <CloseIcon width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    gap: 10,
  },

  cameraContainer: {
    flex: 2,
  },

  camera: {
    width: 250,
    height: 250,
    borderRadius: BORDERRADIUS.radius_14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },

  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
});

export default ScannerScreen;
