import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';

import ReusableText from '../../components/ReusableText';
import ReusableInput from '../../components/ReusableInput';
import ReusableButton from '../../components/ReusableButton';

import useLogin from '../../utils/hooks/useLogin';
import useCheckToken from '../../utils/hooks/useCheckToken';

import {navigate} from '../../navigation/navigationRef';

const Login = () => {
  const {onPress, username, pin, setUsername, setPin} = useLogin();
  useCheckToken();

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.safeAreaView}>
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
                Login
              </ReusableText>

              <ReusableText
                fontSize={14}
                fontWeight={FONTWEIGHT[300]}
                color={COLORS.LightGray}
                textAlign="center">
                Enter the correct credentials to log in
              </ReusableText>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.inputContainer}>
                <ReusableInput
                  placeholder="username"
                  value={username}
                  onChange={setUsername}
                  icon1={<ReusableText fontSize={FONTSIZE.md}>@</ReusableText>}
                />
                <ReusableInput
                  placeholder="PIN"
                  value={pin}
                  onChange={setPin}
                  isPassword={true}
                />

                <ReusableText
                  onPress={() => navigate('CreatePersona')}
                  textDecorationLine="underline"
                  fontWeight={FONTWEIGHT[300]}
                  color={COLORS.Black}>
                  Don't have an account? Sign up
                </ReusableText>
              </View>

              <ReusableButton text="Login" onPress={onPress} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  inputContainer: {
    alignItems: 'center',
  },

  contentContainer: {
    flex: 2,
    justifyContent: 'space-between',
  },
});

export default Login;
