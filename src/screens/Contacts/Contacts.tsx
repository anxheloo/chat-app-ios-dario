import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

import {NavigationProps} from '../../utils/types';

import ContactsList from './ContactsList';

type Props = {
  navigation: NavigationProps;
};

const Contacts: React.FC<Props> = ({navigation}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ContactsList navigation={navigation} />
    </TouchableWithoutFeedback>
  );
};

export default Contacts;
