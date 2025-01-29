import React from 'react';
import CallList from './CallList';
import {NavigationProps} from '../../utils/types';

type Props = {
  navigation: NavigationProps;
};

const Calls: React.FC<Props> = ({navigation}) => {
  return <CallList navigation={navigation} />;
};

export default Calls;
