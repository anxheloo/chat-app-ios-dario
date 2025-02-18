import React from 'react';
import Content from './Content';
import {useSocket} from '../../utils/useSocket';

const Messages = () => {
  useSocket();

  return <Content />;
};

export default Messages;
