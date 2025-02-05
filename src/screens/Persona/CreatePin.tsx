import React, {useCallback, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../../components/ReusableInput';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import ReusableButton from '../../components/ReusableButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import useRegister from '../../utils/hooks/useRegister';

type CreatePinScreenProps = {
  navigation: NavigationProps;
};

const CreatePin: React.FC<CreatePinScreenProps> = ({navigation}) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const pin = useAppStore(state => state.pin);
  const [pinError, setPinError] = useState<boolean>(false);
  const handleRegister = useRegister(navigation);

  const onChange = (text: string): void => {
    setUserPersona({pin: text});
    if (pinError) setPinError(false);
  };

  const isValidPin = () => {
    return pin.length === 4;
  };

  const onPress = (): void => {
    if (!isValidPin()) {
      setPinError(true);
      return;
    }
    handleRegister();
  };

  const cancel = useCallback((): void => {
    navigation.navigate('CreatePersona');
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior={'padding'} style={styles.safeAreaView}>
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <ReusableText
                fontSize={FONTSIZE.md}
                fontWeight={300}
                onPress={cancel}>
                Cancel
              </ReusableText>
            </View>

            <View style={styles.content}>
              <View style={styles.textContainer}>
                <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
                  Create Pin
                </ReusableText>
                <ReusableText
                  fontSize={14}
                  fontWeight={FONTWEIGHT[300]}
                  color={COLORS.LightGray}
                  textAlign="center">
                  Please enter a 4-digit PIN you can remeber
                </ReusableText>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ReusableInput
                  value={pin}
                  onChange={onChange}
                  isPassword={true}
                />

                {pinError && (
                  <Text style={styles.errorStyle}>PIN must be 4-Digits</Text>
                )}
              </View>
            </View>

            <ReusableButton text="Continue" onPress={onPress} />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: 'white'},
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  content: {
    flex: 1,
    marginTop: 40,
    gap: 40,
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
    backgroundColor: COLORS.LightGray2,
    paddingHorizontal: 15,
  },

  errorStyle: {
    color: 'black',
    fontSize: FONTSIZE.sm,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default CreatePin;
