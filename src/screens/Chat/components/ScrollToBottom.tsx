import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RightIcon from '../../../assets/icons/profile/RighArrow';

type Props = {
  onPress: () => void;
};

const ScrollToBottom: React.FC<Props> = memo(({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.main}>
      <RightIcon width={14} height={14} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  main: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    bottom: 80,
    right: 7,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '90deg'}],
  },
});

export default ScrollToBottom;
