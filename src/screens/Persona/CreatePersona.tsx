import React, {useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProps} from '../../utils/types';

import {useAppStore} from '../../store';

import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';

import ReusableText from '../../components/ReusableText';
import AvatarIcon from '../../assets/icons/avatar/Avatar0';
import ReusableInput from '../../components/ReusableInput';
import ReusableButton from '../../components/ReusableButton';

type CreatePersonaScreenProps = {
  navigation: NavigationProps;
};

const CreatePersona: React.FC<CreatePersonaScreenProps> = () => {
  const {setUserPersona, updateKeys} = useAppStore.getState();
  const username = useAppStore(state => state.username);

  const onChange = (text: string): void => {
    setUserPersona({username: text.trim()});
  };

  useEffect(() => {
    return () => {
      setUserPersona({username: ''});
    };
  }, [setUserPersona]);

  const handleContinue = useCallback(() => {
    Keyboard.dismiss();
    updateKeys({bottomSheetType: 'create-avatar'});
  }, [updateKeys]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.safeAreaView}>
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
                Create Persona
              </ReusableText>

              <ReusableText
                fontSize={14}
                fontWeight={FONTWEIGHT[300]}
                color={COLORS.LightGray}
                textAlign="center">
                The username you enter will be visible only to your Solitar
                personas list
              </ReusableText>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.iconAndInputContainer}>
                <View style={styles.iconContainer}>
                  <AvatarIcon width={60} height={60} />
                </View>

                <ReusableInput
                  placeholder="username"
                  value={username}
                  onChange={onChange}
                  icon1={<ReusableText fontSize={FONTSIZE.md}>@</ReusableText>}
                  icon2={
                    <Image
                      source={require('../../assets/icons/info-icon.png')}
                    />
                  }
                />

                {/* <ReusableText
                  onPress={() => navigation.navigate('Login')}
                  textDecorationLine="underline"
                  fontWeight={FONTWEIGHT[300]}
                  color={COLORS.Black}>
                  Already have an account? Sign In
                </ReusableText> */}
              </View>
              <ReusableButton text="Continue" onPress={handleContinue} />
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

  contentContainer: {
    flex: 2,
    justifyContent: 'space-between',
  },

  iconAndInputContainer: {
    alignItems: 'center',
    gap: 20,
  },

  iconContainer: {
    backgroundColor: COLORS.LightGray2,
    width: 80,
    height: 80,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePersona;
