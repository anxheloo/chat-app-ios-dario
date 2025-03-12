import React from 'react';
import {NavigationProps} from '../../utils/types';

import ContactsList from './ContactsList';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';

type Props = {
  navigation: NavigationProps;
};

const Contacts: React.FC<Props> = ({navigation}) => {
  return (
    <>
      <ContactsList navigation={navigation} />
      <FullScreenLoader version={'absolute'} type="friendsPagination" />
    </>
  );
};

export default Contacts;
