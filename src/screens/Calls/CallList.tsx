import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../store';

import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import EmptyCall from './EmptyCall';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
// import Persona from '../../components/Persona/Persona';

import {COLORS} from '../../theme/theme';
import useSearch from '../../utils/hooks/useSearch';

const CallList = () => {
  const calls = useAppStore(state => state.calls);
  const {search, updateSearch, clearSearch, debouncedSearch} = useSearch();

  if (!calls.length) {
    return <EmptyCall />;
  }

  return (
    <View style={styles.content}>
      <ReusableInput
        placeholder="Search"
        value={search}
        onChange={updateSearch}
        onPress={clearSearch}
        icon1={<SearchIcon width={15} height={15} fill={'#000'} />}
        icon2={<CloseIcon width={15} height={15} fill={'#000'} />}
      />
      {/* <FlatList
        contentContainerStyle={styles.content}
        data={calls}
        renderItem={({item}) => }
        keyExtractor={item => item._id}
        initialNumToRender={10}
      /> */}
      <FullScreenLoader version={'absolute'} />;
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
});

export default CallList;
