/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import MessagingIcon from '../../assets/icons/messages/MessagingIcon';
import ReusableText from '../../components/ReusableText';
import {NavigationProps} from '../../utils/types';

type EmptyChatProps = {
  openBottomSheet: () => void;
  navigation: NavigationProps;
};

const EmptyChat: React.FC<EmptyChatProps> = ({openBottomSheet, navigation}) => {
  return (
    <>
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

        <ReusableText
          fontSize={16}
          fontWeight={FONTWEIGHT[400]}
          textAlign="center"
          textDecorationLine="underline"
          onPress={openBottomSheet}>
          Start Conversation
        </ReusableText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },

  container1: {alignItems: 'center', gap: 10},
});

export default EmptyChat;
