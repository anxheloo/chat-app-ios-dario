import React, {memo, useMemo, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import {useAppStore} from '../../store';

import {NavigationProps} from '../../utils/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

// import useConversations from '../../utils/hooks/useConversations';
import useAppState from '../../utils/hooks/useAppState';
import useSearch from '../../utils/hooks/useSearch';

import EmptyChat from './EmptyChat';
import Conversations from '../../components/Persona/Conversations';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import ReusableInput from '../../components/ReusableInput';

import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {COLORS} from '../../theme/theme';

import {
  loadMoreConversations,
  refetchConversations,
} from '../../utils/DataFetching';

const Content = memo(() => {
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NavigationProps>();
  const conversations = useAppStore(state => state.conversations);
  const isLoading = useAppStore(
    state => state.conversationPagination.isLoading,
  );
  const {search, updateSearch, clearSearch, debouncedSearch} = useSearch();
  // Fetch conversations on app state change from inactive, background to active
  useAppState(refetchConversations);

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

  console.log('This are searchedConversations', searchedConversations);

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
      <Animated.FlatList
        ref={flatListRef}
        // onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={loadMoreConversations}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" color={'#000'} /> : null
        }
        // removeClippedSubviews
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
    backgroundColor: COLORS.White,
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default Content;
