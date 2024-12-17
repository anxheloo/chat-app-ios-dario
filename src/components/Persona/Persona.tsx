import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Avatar from './Avatar';
import {useAppStore} from '../../store';
import {Contact, NavigationProps} from '../../utils/types';
import {COLORS} from '../../theme/theme';

type PersonaProps = {
  contact: Contact;
  navigation?: NavigationProps;
  cancel?: () => void;
  version: number;
};

const Persona: React.FC<PersonaProps> = ({
  contact,
  navigation,
  cancel,
  version,
}) => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  // Select contact to update chat
  const selectContact = () => {
    updateFuncChat({selectedChatData: contact, selectedChatMessages: []});
    console.log('Selected contact:', contact);
    if (cancel) {
      cancel();
    }

    navigation?.navigate('Chat');
  };

  console.log('Persona:', contact);

  return (
    <TouchableOpacity style={styles.container} onPress={selectContact}>
      <Avatar
        width={version === 2 ? 46 : 36}
        height={version === 2 ? 46 : 36}
        avatarWidth={version === 2 ? 34 : 27}
        avatarHeight={version === 2 ? 34 : 27}
        backgroundColor={COLORS.LightGray2}
      />
      <Text style={styles.username}>@{contact.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 6,
    gap: 15,
  },

  username: {
    fontWeight: '300',
  },
});

export default Persona;
