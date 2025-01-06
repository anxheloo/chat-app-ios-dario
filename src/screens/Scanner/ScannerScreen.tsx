import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const ScannerScreen = ({navigation}) => {
  const onScanSuccess = e => {
    // Handle the scanned data (e.g., userId)
    const scannedData = e.data;
    Alert.alert('QR Code Scanned', `Data: ${scannedData}`);
    // You can navigate or process the scanned data
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onScanSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
        topContent={
          <Text style={styles.centerText}>
            Align the QR code within the frame to scan.
          </Text>
        }
        bottomContent={
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        }
        cameraStyle={styles.camera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  camera: {
    height: '70%',
    width: '100%',
  },
  centerText: {
    fontSize: 16,
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  buttonTouchable: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ScannerScreen;
