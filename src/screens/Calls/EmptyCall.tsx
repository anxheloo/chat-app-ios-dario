import React from 'react';
import {StyleSheet, View} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import CallIcon from '../../assets/icons/Calls/Call';

type EmptyChatProps = {
  openBottomSheet: () => void;
};

const EmptyCall: React.FC<EmptyChatProps> = ({openBottomSheet}) => {
  return (
    <>
      <View style={{alignItems: 'center', gap: 10}}>
        <CallIcon width={47} height={45} />
        <ReusableText fontSize={FONTSIZE.lg} fontWeight={400}>
          No Recent Calls
        </ReusableText>

        <ReusableText
          fontSize={14}
          fontWeight={FONTWEIGHT[300]}
          color={COLORS.LightGray}
          textAlign="center">
          Select persona and start calling
        </ReusableText>
      </View>

      <ReusableText
        fontSize={16}
        fontWeight={FONTWEIGHT[400]}
        textAlign="center"
        textDecorationLine="underline"
        onPress={openBottomSheet}>
        Start Call
      </ReusableText>
    </>
  );
};

const styles = StyleSheet.create({});

export default EmptyCall;
