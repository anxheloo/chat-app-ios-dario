import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NavigationProps} from '../../utils/types';
import {useAppStore} from '../../store';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import EmptyCall from './EmptyCall';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import Persona from '../../components/Persona/Persona';

type Props = {
  // openBottomSheet: () => void;
  navigation: NavigationProps;
};

const CallList: React.FC<Props> = ({navigation}) => {
  const loading = useAppStore(state => state.loading);
  const calls = useAppStore(state => state.calls);
  const [search, setSearch] = useState<string>('');
  const clearSearch = useCallback(() => setSearch(''), []);

  if (loading) {
    return <FullScreenLoader version={'flex'} />;
  }

  if (!calls.length) {
    return <EmptyCall />;
  }

  return (
    <View style={styles.content}>
      <ReusableInput
        placeholder="Search"
        value={search}
        onChange={setSearch}
        onPress={clearSearch}
        icon1={<SearchIcon width={15} height={15} />}
        icon2={<CloseIcon width={15} height={15} />}
      />
      <FlatList
        contentContainerStyle={styles.content}
        data={calls}
        renderItem={({item}) => (
          <Persona contact={item} navigation={navigation} />
        )}
        keyExtractor={item => item._id}
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default CallList;
