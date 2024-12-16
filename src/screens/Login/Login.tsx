import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../../components/ReusableInput';
import ReusableButton from '../../components/ReusableButton';
import {useAppStore} from '../../store';
import {apiClient} from '../../api/apiClient';
import {LOGIN_ROUTE} from '../../api/apis';
import {getToken, saveToken} from '../../utils/TokenStorage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type LoginProps = {
  navigation: NativeStackNavigationProp<any>;
};

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const updateKeys = useAppStore(state => state.updateKeys);

  // Login
  const onPress = (): void => {
    if (username === '' || pin === '') {
      Alert.alert(
        'Invalid Credentials',
        'Please enter a valid username and PIN',
      );
      return;
    }

    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4 digit PIN');
      return;
    }

    handleLogin();
  };

  // Login
  const handleLogin = async () => {
    updateKeys({loading: true});
    console.log('Inside handleLogin');

    try {
      const response = await apiClient.post(LOGIN_ROUTE, {username, pin});
      console.log('This is response: ', response);

      if (response.status === 200) {
        updateKeys({loading: false, message: 'Login Successful'});

        saveToken(response.data.token);
        console.log('THIS IS TOKEN: ', response.data.token);

        const {username, avatar, id} = response.data.user;

        setUserPersona({
          username,
          avatar,
          id,
        });

        navigation.replace('BottomTabNavigation');
        console.log('This is res.data: ', response.data);
      }
    } catch (error: any) {
      console.log('This is error:', error);
      console.log('Error response:', error.response); // Log full response
      console.log('Error request:', error.request); // Log request details
      console.log('Error message:', error.message); // Log error message
      updateKeys({loading: false, message: 'Login Failed'});
      Alert.alert('Login Error', error?.response.data.message);
    } finally {
      updateKeys({loading: false});
    }
  };

  // Check if token exists
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      console.log('This is token:', token);

      if (token) {
        navigation.replace('BottomTabNavigation');
      }
    };

    checkToken();
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.safeAreaView}>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
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
                onPress={() => navigation.navigate('CreatePersona')}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 20,
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
