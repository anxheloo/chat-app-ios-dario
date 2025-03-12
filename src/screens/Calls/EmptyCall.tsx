import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import ReusableText from '../../components/ReusableText';
import CallIcon from '../../assets/icons/Calls/Call';

import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {useAppStore} from '../../store';

const EmptyCall = () => {
  const {updateKeys} = useAppStore.getState();

  return (
    <View style={styles.emptyChat}>
      <View style={styles.container1}>
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

      <TouchableOpacity
        onPress={() => updateKeys({bottomSheetType: 'start-call'})}>
        <ReusableText
          fontSize={16}
          fontWeight={FONTWEIGHT[400]}
          textAlign="center"
          textDecorationLine="underline">
          Start Call
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

export default EmptyCall;
