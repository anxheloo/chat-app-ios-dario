import React, {useState} from 'react';
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
import {saveToken} from '../../utils/TokenStorage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type LoginProps = {
  navigation: NativeStackNavigationProp<any>;
};

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const updateKeys = useAppStore(state => state.updateKeys);

  const handleLogin = async () => {
    updateKeys({loading: true});

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

        console.log('THIS IS response.data.user,: ', response.data.user);

        navigation.replace('BottomTabNavigation');
        console.log('This is res.data: ', response.data);
      } else {
        updateKeys({loading: false, message: 'Login Failed'});
        Alert.alert(
          'Login Failed',
          'Please check your credentials and try again.',
        );
      }
    } catch (error: any) {
      //   updateKeys({loading: false, message: error?.response.data.message});

      //   Alert.alert('', error?.response.data.message, [
      //     {
      //       text: 'Cancel',
      //       onPress: () => setUserPersona({username: '', pin: ''}),
      //     },
      //   ]);

      updateKeys({loading: false, message: 'Login Failed'});
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An error occurred. Please try again later.');
    } finally {
      updateKeys({loading: false});
    }
  };

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

            <ReusableButton text="Login" onPress={handleLogin} />
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
    gap: 10,
    alignItems: 'center',
  },

  contentContainer: {
    flex: 2,
    justifyContent: 'space-between',
  },
});

export default Login;
