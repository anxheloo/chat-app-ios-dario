import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Avatar from './Avatar';
import {useAppStore} from '../../store';
import {Contact, NavigationProps} from '../../utils/types';
import {COLORS, FONTSIZE} from '../../theme/theme';

type PersonaProps = {
  contact: Contact;
  navigation?: NavigationProps;
  backgroundColor?: string;
  cancel?: () => void;
};

const Persona: React.FC<PersonaProps> = ({
  contact,
  navigation,
  backgroundColor,
  cancel,
}) => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  // Select contact to update chat
  const selectContact = () => {
    updateFuncChat({selectedChatData: contact});
    navigation?.navigate('Chat');

    if (cancel) {
      cancel();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.container,
        {backgroundColor: backgroundColor ?? 'transparent'},
      ]}
      onPress={selectContact}>
      <Avatar
        width={36}
        height={36}
        avatarWidth={27}
        avatarHeight={27}
        backgroundColor={COLORS.LightGray2}
        src={contact.avatar}
      />
      <View style={styles.secondContainer}>
        <Text style={styles.username}>@{contact.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 15,
  },

  secondContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 6,
  },

  username: {
    fontWeight: '300',
    flex: 1,
  },

  lastMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontSize: FONTSIZE.sm,
    color: COLORS.LightGray,
    maxWidth: 200,
  },

  messageDate: {
    fontWeight: '300',
    fontSize: FONTSIZE.sm,
    color: 'black',
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
});

export default Persona;
