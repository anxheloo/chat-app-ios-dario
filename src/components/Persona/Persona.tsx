import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Avatar from './Avatar';
import {Contact} from '../BottomSheet/PersonasList';
import {useAppStore} from '../../store';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../screens/Profile/SettingElement';

type PersonaProps = {
  contact: Contact;
  navigation: NavigationProp<RootStackParamList>;
  cancel: () => void;
};

const Persona: React.FC<PersonaProps> = ({contact, navigation, cancel}) => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  // Select contact to update chat
  const selectContact = () => {
    updateFuncChat({selectedChatData: contact, selectedChatMessages: []});
    console.log('Selected contact:', contact);
    cancel();
    navigation.navigate('Chat');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={selectContact}>
      <Avatar width={36} height={36} avatarWidth={27} avatarHeight={27} />
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
