import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useCallback, useRef, useState} from 'react';
import ReusableText from '../ReusableText';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {UPDATE_DISSAPEARING_MESSAGES} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';
import ClockIcon from '../../assets/icons/profile/ClockIcon';
import RightIcon from '../../assets/icons/profile/RighArrow';

type UpdateMessagesProps = {
  cancel: () => void;
};

const UpdateDissapear: React.FC<UpdateMessagesProps> = memo(({cancel}) => {
  const {setUserPersona, token, dissappearingMessages} = useAppStore();
  const [selectableOption, setSelectableOption] = useState<string>(
    dissappearingMessages,
  );
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownPadding = useRef(new Animated.Value(0)).current;

  const options = [
    'None',
    '30 seconds',
    '5 minutes',
    '30 minutes',
    '1 hour',
    '8 hours',
    '1 day',
    '1 week',
  ];

  const toggleDropdown = useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false);
      // Animate closing
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(dropdownPadding, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animate opening
      setIsExpanded(true);
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: 320,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(dropdownPadding, {
          toValue: 20,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isExpanded, dropdownHeight, dropdownPadding]);

  const updateMessages = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res = await apiClient.post(
        UPDATE_DISSAPEARING_MESSAGES,
        {
          dissappearingMessages: selectableOption,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        console.log('This is res', res.data);
        setIsLoading(false);
        setUserPersona({dissappearingMessages: res.data.dissappearingMessages});
        toggleDropdown();
        cancel();
        Alert.alert('Successfully Updated', 'Your time frame has been updated');
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Update Error', error.response.data.message);
    }
  }, [cancel, selectableOption, setUserPersona, toggleDropdown, token]);

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
              onPress={updateMessages}>
              {!loading ? (
                'Set'
              ) : (
                <ActivityIndicator size="small" color="black" />
              )}
            </ReusableText>
          </View>

          <View style={styles.textContainer}>
            <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
              Messages
            </ReusableText>
            <ReusableText
              fontSize={14}
              fontWeight={FONTWEIGHT[300]}
              color={COLORS.LightGray}
              textAlign="center">
              Select the time frame for messages to disappear
            </ReusableText>
          </View>

          <View style={styles.mainContent}>
            <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
              <ClockIcon width={15} height={15} />
              <ReusableText
                color="black"
                fontWeight={FONTWEIGHT[300]}
                fontSize={FONTSIZE.md}
                style={{flex: 1}}>
                {dissappearingMessages}
              </ReusableText>
              <View
                style={{
                  transform: [{rotate: isExpanded ? '-90deg' : '90deg'}],
                }}>
                <RightIcon width={7} height={7} />
              </View>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.optionsContainer,
                {height: dropdownHeight, paddingVertical: dropdownPadding},
              ]}>
              {isExpanded &&
                options.map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.option}
                    onPress={() => {
                      // setIsExpanded(false);
                      setSelectableOption(item);
                    }}>
                    <View style={styles.circle}>
                      {selectableOption === item && (
                        <View style={styles.selectableCircle} />
                      )}
                    </View>
                    <ReusableText
                      fontWeight={FONTWEIGHT[300]}
                      fontSize={FONTSIZE.md}>
                      {item}
                    </ReusableText>
                  </TouchableOpacity>
                ))}
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});

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
    marginTop: 40,
  },

  button: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
  },

  optionsContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    borderRadius: BORDERRADIUS.radius_14,
    marginTop: 10,
    justifyContent: 'space-between',
    gap: 15,
    overflow: 'hidden',
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: '100%',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectableCircle: {
    width: 10,
    height: 10,
    borderRadius: '100%',
    backgroundColor: 'black',
  },
});

export default UpdateDissapear;
