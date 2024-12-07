import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native'; // Ensure `Text` is imported
import ReusableText from '../../components/ReusableText';
import ReusableInput from '../../components/ReusableInput';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {useAppStore} from '../../store';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectAvatar from './SelectAvatar';

const CreatePersona: React.FC = () => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const username = useAppStore(state => state.username);

  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const onPress = (): void => {
    setUserPersona({username});
    bottomSheetRef.current?.expand();
  };

  const onChange = (text: string): void => {
    setUserPersona({username: text});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeAreaView}>
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
                <Image
                  source={require('../../assets/icons/avatar-icons/avatar-0.png')}
                />
              </View>

              <View style={styles.inputContainer}>
                <ReusableText fontSize={FONTSIZE.md}>@</ReusableText>
                <ReusableInput
                  placeholder="username"
                  value={username}
                  onChange={onChange}
                />

                <Image source={require('../../assets/icons/info-icon.png')} />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={onPress}>
              <ReusableText color="white" fontWeight={FONTWEIGHT[600]}>
                Continue
              </ReusableText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <SelectAvatar ref={bottomSheetRef} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
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

export default CreatePersona;
