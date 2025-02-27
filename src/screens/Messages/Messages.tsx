import React from 'react';
import Content from './Content';
import {useSocket} from '../../utils/useSocket';

const Messages: React.FC = () => {
  useSocket();

  return <Content />;
};

export default Messages;
