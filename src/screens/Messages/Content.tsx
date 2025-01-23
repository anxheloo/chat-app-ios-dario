import React, {memo, useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import EmptyChat from './EmptyChat';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import Conversations from '../../components/Persona/Conversations';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

type ContentProps = {
  openBottomSheet: () => void;
  navigation: NavigationProps;
};

const Content: React.FC<ContentProps> = memo(
  ({openBottomSheet, navigation}) => {
    const loading = useAppStore(state => state.loading);
    const [search, setSearch] = useState<string>('');
    const conversations = useAppStore(state => state.conversations);

    console.log('This is Content step 4');
    const clearSearch = useCallback(() => setSearch(''), []);

    if (loading) {
      return <FullScreenLoader version={'flex'} />;
    }

    if (!conversations.length) {
      return <EmptyChat openBottomSheet={openBottomSheet} />;
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
          data={conversations}
          renderItem={({item}) => (
            <Conversations
              conversation={item}
              navigation={navigation}
              backgroundColor="white"
            />
          )}
          keyExtractor={item => item._id}
          initialNumToRender={10}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Content;
