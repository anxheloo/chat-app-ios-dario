/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../ReusableInput';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {UPDATE_USERNAME} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';

type ChangeUsernameProps = {
  cancel: () => void;
};

const ChangeUsername: React.FC<ChangeUsernameProps> = ({cancel}) => {
  const {setUserPersona, username: globalUsername} = useAppStore();
  const [username, setUsername] = useState<string>(globalUsername);
  const [loading, setIsLoading] = useState<boolean>(false);

  const updateUsername = useCallback(
    async (username: string, cancel: () => void): Promise<void> => {
      setIsLoading(true);

      try {
        const res = await apiClient.post(UPDATE_USERNAME, {
          username: username,
        });

        if (res.status === 200) {
          setIsLoading(false);
          setUserPersona({username: res.data.username});
          cancel();
          Alert.alert('Username Updated', 'Your username has been updated');
        }
      } catch (error: any) {
        setIsLoading(false);
        Alert.alert('Update Error', error.response.data.message);
      }
    },
    [setUserPersona],
  );

  const clearSearch = (): void => {
    setUsername('');
  };

  return (
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
            onPress={() => updateUsername(username, cancel)}>
            {!loading ? (
              'Set'
            ) : (
              <ActivityIndicator size="small" color="black" />
            )}
          </ReusableText>
        </View>

        <View style={styles.textContainer}>
          <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
            Username
          </ReusableText>
          <ReusableText
            fontSize={14}
            fontWeight={FONTWEIGHT[300]}
            color={COLORS.LightGray}
            textAlign="center">
            The username you enter will be visible only to your Solitar contact
            list
          </ReusableText>
        </View>

        <View style={styles.mainContent}>
          <ReusableInput
            placeholder="Enter username"
            value={username}
            onChange={setUsername}
            onPress={clearSearch}
            backgroundColor="white"
            icon1={<ReusableText fontSize={FONTSIZE.md}>@</ReusableText>}
            icon2={<CloseIcon width={15} height={15} />}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    flex: 1,
    marginTop: 40,
    justifyContent: 'space-between',
  },
});

export default ChangeUsername;
