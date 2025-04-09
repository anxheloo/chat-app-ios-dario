import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

import CallList from './CallList';

const Calls = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <CallList />
    </TouchableWithoutFeedback>
  );
};

export default Calls;
