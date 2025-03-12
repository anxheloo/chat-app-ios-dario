import React, {useMemo} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import {loadMoreFriends, refetchFriends} from '../../utils/DataFetching';

import EmptyContacts from './EmptyContacts';
import Persona from '../../components/Persona/Persona';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import ReusableInput from '../../components/ReusableInput';

import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

import useSearch from '../../utils/hooks/useSearch';
import useAppState from '../../utils/hooks/useAppState';

import {COLORS} from '../../theme/theme';

type ContentProps = {
  navigation: NavigationProps;
};

const ContactsList: React.FC<ContentProps> = ({navigation}) => {
  const friends = useAppStore(state => state.friends);
  const isLoading = useAppStore(state => state.friendsPagination.isLoading);
  const {search, updateSearch, clearSearch, debouncedSearch} = useSearch();

  // Fetch friends on app state change from inactive, background to active
  useAppState(refetchFriends);

  const searchedFriends = useMemo(
    () =>
      friends.filter(friend =>
        friend.username.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, friends],
  );

  if (!friends.length) {
    return <EmptyContacts navigation={navigation} />;
  }

  return (
    <View style={styles.content}>
      <ReusableInput
        placeholder="Search"
        value={search}
        onChange={updateSearch}
        marginHorizontal={20}
        onPress={clearSearch}
        icon1={<SearchIcon width={15} height={15} fill={'#000'} />}
        icon2={<CloseIcon width={15} height={15} fill={'#000'} />}
      />
      <FlatList
        scrollEventThrottle={16}
        onEndReached={loadMoreFriends}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" color={'#000'} /> : null
        }
        contentContainerStyle={styles.content}
        data={searchedFriends}
        renderItem={({item}) => (
          <Persona contact={item} backgroundColor="white" />
        )}
        keyExtractor={item => item._id}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        scrollEnabled={true}
      />
      <FullScreenLoader version={'absolute'} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: COLORS.White,
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default ContactsList;
