import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {useAppStore} from '../../store';
import BottomSheet from '@gorhom/bottom-sheet';
import AvatarIcon from '../../assets/icons/avatar/Avatar0';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import SelectAvatar from '../../components/BottomSheet/SelectAvatar';
import ReusableInput from '../../components/ReusableInput';
import ReusableButton from '../../components/ReusableButton';
import {NavigationProps} from '../../utils/types';

type CreatePersonaScreenProps = {
  navigation: NavigationProps;
};

const CreatePersona: React.FC<CreatePersonaScreenProps> = ({navigation}) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const username = useAppStore(state => state.username);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const openBottomSheet = (): void => {
    setUserPersona({username});
    Keyboard.dismiss();
    bottomSheetRef.current?.expand();
  };

  const onChange = (text: string): void => {
    setUserPersona({username: text});
  };

  const cancel = (): void => {
    bottomSheetRef?.current?.close();
  };

  const setFunc = (): void => {
    bottomSheetRef?.current?.close();
    navigation.navigate('CreatePin');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.safeAreaView}>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
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
                  <Image source={require('../../assets/icons/info-icon.png')} />
                }
              />

              <ReusableText
                onPress={() => navigation.navigate('Login')}
                textDecorationLine="underline"
                fontWeight={FONTWEIGHT[300]}
                color={COLORS.Black}>
                Already have an account? Sign In
              </ReusableText>
            </View>

            <ReusableButton text="Continue" onPress={openBottomSheet} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <BottomSheetWrapper ref={bottomSheetRef}>
        <SelectAvatar cancel={cancel} setFunc={setFunc} />
      </BottomSheetWrapper>
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
