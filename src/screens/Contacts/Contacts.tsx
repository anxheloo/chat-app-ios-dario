import React from 'react';
import {NavigationProps} from '../../utils/types';
import ContactsList from './ContactsList';
// import useFriend from '../../utils/hooks/useFriend';

type Props = {
  navigation: NavigationProps;
};

const Contacts: React.FC<Props> = ({navigation}) => {
  console.log('Inside Contacts');
  return <ContactsList navigation={navigation} />;
};

export default Contacts;
