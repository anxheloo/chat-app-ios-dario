import React, {memo, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import {useNavigation} from '@react-navigation/native';
import useSearch from '../../utils/hooks/useSearch';

import EmptyChat from './EmptyChat';
import Conversations from '../../components/Persona/Conversations';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import ReusableInput from '../../components/ReusableInput';

import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {COLORS} from '../../theme/theme';

const Content = memo(() => {
  const navigation = useNavigation<NavigationProps>();
  const conversations = useAppStore(state => state.conversations);
  const {search, updateSearch, clearSearch, debouncedSearch} = useSearch();

  const searchedConversations = useMemo(
    () =>
      conversations.filter(
        conversation =>
          conversation.participants
            .filter(
              participant => participant._id !== useAppStore.getState().id,
            )
            .filter(contact =>
              contact.username
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()),
            ).length > 0,
      ),
    [conversations, debouncedSearch],
  );

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
        marginHorizontal={20}
        icon1={<SearchIcon width={15} height={15} fill={'#000'} />}
        icon2={<CloseIcon width={15} height={15} fill={'#000'} />}
      />
      <FlatList
        contentContainerStyle={styles.content}
        data={searchedConversations}
        renderItem={({item}) => (
          <Conversations
            conversation={item}
            navigation={navigation}
            backgroundColor={'white'}
          />
        )}
        keyExtractor={item => item._id}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        scrollEnabled={true}
      />
      <FullScreenLoader version={'absolute'} />
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
});

export default Content;
