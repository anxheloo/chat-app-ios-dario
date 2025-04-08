import React from 'react';
import {NavigationProps} from '../../utils/types';

import ContactsList from './ContactsList';

type Props = {
  navigation: NavigationProps;
};

const Contacts: React.FC<Props> = ({navigation}) => {
  return <ContactsList navigation={navigation} />;
};

export default Contacts;
