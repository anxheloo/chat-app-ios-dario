import React, {memo, useCallback, useMemo, useState} from 'react';
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
  navigation: NavigationProps;
};

const Content: React.FC<ContentProps> = memo(({navigation}) => {
  const loading = useAppStore(state => state.loading);
  const userId = useAppStore(state => state.id);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebounceSearch] = useState<string>('');
  const conversations = useAppStore(state => state.conversations);

  const searchedConversations = useMemo(
    () =>
      conversations.filter(
        conversation =>
          conversation.participants
            .filter(participant => participant._id !== userId)
            .filter(contact =>
              contact.username
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()),
            ).length > 0,
      ),
    [conversations, debouncedSearch, userId],
  );

  const clearSearch = useCallback(() => setSearch(''), []);

  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);

    const t = setTimeout(() => {
      setDebounceSearch(searchTerm);
    }, 300);

    return () => clearTimeout(t);
  };

  if (loading) {
    return <FullScreenLoader version={'flex'} />;
  }

  if (!conversations.length) {
    return <EmptyChat navigation={navigation} />;
  }

  return (
    <View style={styles.content}>
      <ReusableInput
        placeholder="Search"
        value={search}
        onChange={updateSearch}
        onPress={clearSearch}
        icon1={<SearchIcon width={15} height={15} />}
        icon2={<CloseIcon width={15} height={15} />}
      />
      <FlatList
        contentContainerStyle={styles.content}
        data={searchedConversations}
        renderItem={({item}) => (
          <Conversations
            conversation={item}
            navigation={navigation}
            backgroundColor="white"
          />
        )}
        keyExtractor={item => item._id}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Content;
