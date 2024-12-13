import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableInput from '../ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import ReusableText from '../ReusableText';
import {useAppStore} from '../../store';

const Header = () => {
  const username = useAppStore(state => state.username);

  return (
    <View style={styles.container}>
      <ReusableText fontWeight={500} style={{marginTop: 10}}>
        @{username}
      </ReusableText>

      <TouchableOpacity style={styles.icon}>
        <ScanIcon width={'100%'} height={'100%'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    padding: 20,
  },

  icon: {width: 24, height: 24, alignSelf: 'flex-end'},
});

export default Header;
