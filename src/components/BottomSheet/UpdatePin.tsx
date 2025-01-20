import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../ReusableInput';
import {UPDATE_PIN} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';
import LockIcon from '../../assets/icons/profile/LockIcon';

type UpdatePinProps = {
  cancel: () => void;
};

const UpdatePin: React.FC<UpdatePinProps> = ({cancel}) => {
  const token = useAppStore(state => state.token);
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [loading, setIsLoading] = useState<boolean>(false);

  const updatePin = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res = await apiClient.post(
        UPDATE_PIN,
        {
          oldPin: oldPin,
          newPin: newPin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('This is res');

      if (res.status === 200) {
        console.log('This is res', res.data);
        setIsLoading(false);
        cancel();
        Alert.alert('Pin Updated', 'Your pin has been updated');
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Update Error', error.response.data.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.contentContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentContainer}>
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
              onPress={updatePin}>
              {!loading ? (
                'Set'
              ) : (
                <ActivityIndicator size="small" color="black" />
              )}
            </ReusableText>
          </View>

          <View style={styles.textContainer}>
            <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
              PIN
            </ReusableText>
            <ReusableText
              fontSize={14}
              fontWeight={FONTWEIGHT[300]}
              color={COLORS.LightGray}
              textAlign="center">
              If you forget your pin, your account will be lost
            </ReusableText>
          </View>

          <View style={styles.mainContent}>
            <ReusableInput
              icon1={<LockIcon width={15} height={15} />}
              placeholder="Old PIN"
              value={oldPin}
              onChange={setOldPin}
              isPassword={true}
              backgroundColor="white"
            />
            <ReusableInput
              icon1={<LockIcon width={15} height={15} />}
              placeholder="New PIN"
              value={newPin}
              onChange={setNewPin}
              isPassword={true}
              backgroundColor="white"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 40,
  },
  mainContent: {
    // flex: 1,
    marginTop: 40,
    justifyContent: 'space-between',
  },
});

export default UpdatePin;
