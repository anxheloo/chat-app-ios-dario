import React from 'react';
import Content from './Content';
import {NavigationProps} from '../../utils/types';
import {useSocket} from '../../utils/useSocket';

type MessagesScreenProps = {
  navigation: NavigationProps;
};

const Messages: React.FC<MessagesScreenProps> = ({navigation}) => {
  useSocket();

  return <Content navigation={navigation} />;
};

export default Messages;
