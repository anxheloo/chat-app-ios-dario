import React, {useMemo} from 'react';
import {ActivityIndicator, Animated, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../store';

import CallComponent from '../../components/Persona/CallComponent';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import EmptyCall from './EmptyCall';
import ReusableInput from '../../components/ReusableInput';

import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

import {COLORS} from '../../theme/theme';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Call, NavigationProps} from '../../utils/types';
import {loadMoreCalls, refetchCalls} from '../../utils/DataFetching';
import useSearch from '../../utils/hooks/useSearch';
import useAppState from '../../utils/hooks/useAppState';
import HorizontalLine from '../../components/HorizontalLine';

const CallList = () => {
  const navigation = useNavigation<NavigationProps>();
  const calls = useAppStore(state => state.calls);
  const scrollY = useAppStore(state => state.scrollY);
  const isLoading = useAppStore(state => state.callsPagination.isLoading);
  const {search, updateSearch, clearSearch, debouncedSearch} = useSearch();

  // Fetch calls on app state change from inactive, background to active
  useAppState(refetchCalls);

  const searchedCalls: Call[] = useMemo(
    () =>
      calls.filter(
        call =>
          call?.participants
            .filter(
              participant => participant._id !== useAppStore.getState().id,
            )
            .filter(contact =>
              contact?.username
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()),
            ).length > 0,
      ),
    [calls, debouncedSearch],
  );

  useFocusEffect(() => {
    const updateAnimation = () => {
      scrollY?.setValue(0);
    };

    updateAnimation();
  });

  const onScroll = scrollY
    ? Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: false,
      })
    : undefined;

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
        marginHorizontal={20}
        icon1={<SearchIcon width={15} height={15} fill={'#000'} />}
        icon2={<CloseIcon width={15} height={15} fill={'#000'} />}
      />

      <HorizontalLine />
      <Animated.FlatList
        onScroll={onScroll}
        scrollEventThrottle={16}
        onEndReached={loadMoreCalls}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" color={'#000'} /> : null
        }
        contentContainerStyle={styles.content}
        data={searchedCalls}
        renderItem={({item}) => (
          <CallComponent
            call={item}
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
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: COLORS.White,
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default CallList;
