import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../../components/ReusableInput';
import {useAppStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  CreatePersona: undefined;
  BottomTabNavigation: undefined;
};

const CreatePin = () => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const pin = useAppStore(state => state.pin);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [pinError, setPinError] = useState<boolean>(false);

  const onChange = (text: string): void => {
    setUserPersona({pin: text});
  };

  const onPress = (): void => {
    if (pin.length !== 4) {
      setPinError(true);
      return;
    }

    navigation.navigate('BottomTabNavigation');
  };

  const cancel = (): void => {
    navigation.navigate('CreatePersona');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <ReusableText
              fontSize={FONTSIZE.md}
              fontWeight={300}
              onPress={cancel}>
              Cancel
            </ReusableText>
            <ReusableText
              fontSize={FONTSIZE.md}
              fontWeight={500}
              onPress={onPress}>
              Set
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
              <View style={styles.inputContainer}>
                <ReusableInput
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={onChange}
                  isPassword={true}
                />
              </View>

              {pinError && (
                <Text style={styles.errorStyle}>PIN must be 4-Digits</Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onPress}>
            <ReusableText color="white" fontWeight={FONTWEIGHT[600]}>
              Continue
            </ReusableText>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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

  button: {
    width: '100%',
    backgroundColor: COLORS.Black,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
    marginBottom: 20,
  },
});

export default CreatePin;
