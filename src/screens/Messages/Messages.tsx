import React from 'react';

import Content from './Content';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';

const Messages: React.FC = () => {
  return (
    <>
      <Content />
      <FullScreenLoader version={'absolute'} type="conversationPagination" />
    </>
  );
};

export default Messages;
