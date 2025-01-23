import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import ReusableText from './ReusableText';
import {BORDERRADIUS, COLORS, FONTWEIGHT} from '../theme/theme';
import {useAppStore} from '../store';

type Props = {
  text: string;
  onPress: () => void;
};

const ReusableButton: React.FC<Props> = ({text, onPress}) => {
  const loading = useAppStore(state => state.loading);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <ReusableText color="white" fontWeight={FONTWEIGHT[600]}>
        {loading ? <ActivityIndicator color="white" size={'small'} /> : text}
      </ReusableText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: COLORS.Black,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
  },
});

export default ReusableButton;
