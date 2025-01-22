import React from 'react';
import {StyleSheet, View} from 'react-native';
import ReusableText from '../../components/ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ContactsIcon from '../../assets/icons/BottomTabIcons/ContactsIcon';

type EmptyChatProps = {
  action: () => void;
};

const EmptyContacts: React.FC<EmptyChatProps> = ({action}) => {
  return (
    <View style={styles.emptyContacts}>
      <View style={{alignItems: 'center', gap: 10}}>
        <ContactsIcon width={47} height={45} fill={COLORS.Black} />
        <ReusableText fontSize={FONTSIZE.lg} fontWeight={400}>
          No Recent Contacts
        </ReusableText>

        <ReusableText
          fontSize={14}
          fontWeight={FONTWEIGHT[300]}
          color={COLORS.LightGray}
          textAlign="center">
          Scan persona's QR-Code and start messaging
        </ReusableText>
      </View>

      <ReusableText
        fontSize={16}
        fontWeight={FONTWEIGHT[400]}
        textAlign="center"
        textDecorationLine="underline"
        onPress={action}>
        Add Persona
      </ReusableText>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContacts: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
});

export default EmptyContacts;
