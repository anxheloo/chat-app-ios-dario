import React, {useEffect} from 'react';
import {NavigationProps} from '../../utils/types';
import ContactsList from './ContactsList';
import useFriend from '../../utils/hooks/useFriend';

type Props = {
  navigation: NavigationProps;
};

const Contacts: React.FC<Props> = ({navigation}) => {
  const getFriends = useFriend();

  console.log('Inside Contacts');

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  return <ContactsList navigation={navigation} />;
};

export default Contacts;
