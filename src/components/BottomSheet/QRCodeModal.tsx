import {View, StyleSheet, Image, ActivityIndicator, Text} from 'react-native';
import React, {useState} from 'react';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {useAppStore} from '../../store';

type UpdatePinProps = {
  cancel: () => void;
};

const QRCodeModal: React.FC<UpdatePinProps> = ({cancel}) => {
  const qr_code = useAppStore(state => state.qr_code);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(false); // Track error state

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
          {loading && !error && (
            <ActivityIndicator size="large" color={COLORS.LightGray} />
          )}
          {error && (
            <Text style={styles.errorText}>Failed to load QR Code</Text>
          )}
          <Image
            source={{uri: qr_code}}
            style={{width: 220, height: 220}}
            resizeMode="contain"
            onLoad={() => setLoading(false)} // Image loaded
            onError={() => {
              setLoading(false);
              setError(true); // Handle image loading error
            }}
          />
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
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRCodeModal;
