import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../../components/ReusableInput';
import ReusableButton from '../../components/ReusableButton';
import {NavigationProps} from '../../utils/types';
import useLogin from '../../utils/hooks/useLogin';
import useCheckToken from '../../utils/hooks/useCheckToken';

type LoginScreenProps = {
  navigation: NavigationProps;
};

const Login: React.FC<LoginScreenProps> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const onPress = useLogin(username, pin, setUsername, setPin, navigation);
  useCheckToken(navigation);

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
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreatePersona')}>
                  <ReusableText
                    textDecorationLine="underline"
                    fontWeight={FONTWEIGHT[300]}
                    color={COLORS.Black}>
                    Don't have an account? Sign up
                  </ReusableText>
                </TouchableOpacity>
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
    backgroundColor: 'white',
    padding: 20,
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
