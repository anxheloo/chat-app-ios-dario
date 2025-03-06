import React from 'react';
import Content from './Content';
import useAppState from '../../utils/hooks/useAppState';
import useConversations from '../../utils/hooks/useConversations';

const Messages: React.FC = () => {
  // Get conversations when app changes from inactive to active (temporary solution)
  const conversations = useConversations();
  useAppState(conversations);

  return <Content />;
};

export default Messages;
