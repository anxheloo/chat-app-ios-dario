import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import MessagingIcon from '../../assets/icons/messages/MessagingIcon';
import ReusableText from '../../components/ReusableText';

import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {NavigationProps} from '../../types/types';
import {useAppStore} from '../../store';

type EmptyChatProps = {
  navigation: NavigationProps;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmptyChat: React.FC<EmptyChatProps> = ({navigation}) => {
  const {updateKeys} = useAppStore.getState();

  return (
    <View style={styles.emptyChat}>
      <View style={styles.container1}>
        <MessagingIcon width={47} height={45} />
        <ReusableText fontSize={FONTSIZE.lg} fontWeight={400}>
          No Conversations
        </ReusableText>

        <ReusableText
          fontSize={14}
          fontWeight={FONTWEIGHT[300]}
          color={COLORS.LightGray}
          textAlign="center">
          Select persona and start messaging
        </ReusableText>
      </View>

      <TouchableOpacity
        onPress={() => updateKeys({bottomSheetType: 'start-conversation'})}>
        <ReusableText
          fontSize={16}
          fontWeight={FONTWEIGHT[400]}
          textAlign="center"
          textDecorationLine="underline">
          Start Conversation
        </ReusableText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },

  container1: {alignItems: 'center', gap: 10},
});

export default EmptyChat;
