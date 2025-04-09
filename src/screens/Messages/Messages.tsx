import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

import Content from './Content';

const Messages: React.FC = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Content />
    </TouchableWithoutFeedback>
  );
};

export default Messages;
