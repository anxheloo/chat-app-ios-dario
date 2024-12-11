import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReusableText from '../ReusableText';
import {FONTSIZE} from '../../theme/theme';

type PersonasListProps = {
  cancel: () => void;
  addNew: () => void;
};

const PersonasList: React.FC<PersonasListProps> = ({cancel, addNew}) => {
  return (
    <>
      <View style={styles.header}>
        <ReusableText fontSize={FONTSIZE.md} fontWeight={300} onPress={cancel}>
          Cancel
        </ReusableText>
        <ReusableText fontSize={FONTSIZE.md} fontWeight={500} onPress={addNew}>
          Set
        </ReusableText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default PersonasList;
