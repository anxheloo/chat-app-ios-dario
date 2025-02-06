import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {useAppStore} from '../../store';
import QRCode from 'react-native-qrcode-svg';

type UpdatePinProps = {
  cancel: () => void;
};

const QRCodeModal: React.FC<UpdatePinProps> = ({cancel}) => {
  const {id: userId} = useAppStore();
  const [error, setError] = useState(false);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <ReusableText fontSize={FONTSIZE.md} fontWeight={300} onPress={cancel}>
          Cancel
        </ReusableText>
      </View>

      <View style={styles.textContainer}>
        <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
          My QR Code
        </ReusableText>
        <ReusableText
          fontSize={14}
          fontWeight={FONTWEIGHT[300]}
          color={COLORS.LightGray}
          textAlign="center">
          This is your QR code. Share it only with people you trust.
        </ReusableText>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.qrCodeContainer}>
          {error ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <QRCode value={userId} size={180} onError={() => setError(true)} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 40,
  },
  mainContent: {
    // flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },

  qrCodeContainer: {
    width: 220,
    height: 220,
    borderRadius: 14,
    // overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {width: 220, height: 220},
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRCodeModal;
