import React from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {useAppStore} from '../../store';

import ReusableInput from '../ReusableInput';
import ReusableButton from '../ReusableButton';

import useLogin from '../../utils/hooks/useLogin';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';

const PinModal = () => {
  const pinModal = useAppStore(state => state.pinModal);
  const {onPress, pin, setPin} = useLogin();

  if (!pinModal) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={styles.textContainer}>
            <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
              Enter PIN
            </ReusableText>

            <ReusableText
              fontSize={14}
              fontWeight={FONTWEIGHT[300]}
              color={COLORS.LightGray}
              textAlign="center">
              Please enter your 4-digit PIN to access your account.
            </ReusableText>
          </View>
          <View style={styles.inputContainer}>
            <ReusableInput
              placeholder="PIN"
              value={pin}
              onChange={setPin}
              isPassword={true}
            />
            <ReusableButton text="Login" onPress={onPress} />
          </View>
        </>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    backgroundColor: 'white',
    gap: 150,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
  },

  inputContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 2,
  },
});

export default PinModal;
