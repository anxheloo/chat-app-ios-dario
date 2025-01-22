import React, {memo, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import EmptyChat from './EmptyChat';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import Conversations from '../../components/Persona/Conversations';
import useConversations from '../../utils/hooks/useConversations';

type ContentProps = {
  openBottomSheet: () => void;
  navigation: NavigationProps;
};

const Content: React.FC<ContentProps> = memo(
  ({openBottomSheet, navigation}) => {
    // const getConversations = useConversations();
    const directMessagesContacts = useAppStore(
      state => state.directMessagesContacts,
    );

    console.log('This is Content step 4');

    // useEffect(() => {
    //   console.log('This is Get Conversations step 5');
    //   getConversations();
    // }, [getConversations]);

    if (!directMessagesContacts.length) {
      return <EmptyChat openBottomSheet={openBottomSheet} />;
    }

    return (
      <FlatList
        contentContainerStyle={styles.content}
        data={directMessagesContacts}
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
    );
  },
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default Content;
