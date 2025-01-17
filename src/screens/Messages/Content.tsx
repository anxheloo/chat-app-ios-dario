import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import EmptyChat from './EmptyChat';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import {apiClient} from '../../api/apiClient';
import {GET_CONVERSATIONS} from '../../api/apis';
import Conversations from '../../components/Persona/Conversations';

type ContentProps = {
  openBottomSheet: () => void;
  navigation: NavigationProps;
};

const Content: React.FC<ContentProps> = ({openBottomSheet, navigation}) => {
  const directMessagesContacts = useAppStore(
    state => state.directMessagesContacts,
  );
  const token = useAppStore(state => state.token);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  const getConversations = useCallback(async () => {
    try {
      const res = await apiClient.get(GET_CONVERSATIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        updateFuncChat({directMessagesContacts: res.data.conversations});
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [token, updateFuncChat]);

  // Get all contacts that we have sent a message
  useEffect(() => {
    getConversations();
  }, []);

  if (directMessagesContacts.length > 0) {
    return (
      <FlatList
        contentContainerStyle={styles.content}
        data={directMessagesContacts}
        renderItem={({item}) => (
          <Conversations
            conversation={item}
            navigation={navigation}
            backgroundColor={'white'}
          />
        )}
        extraData={directMessagesContacts}
        keyExtractor={item => item._id}
        initialNumToRender={10}
      />
    );
  }

  return (
    <View style={styles.emptyChat}>
      <EmptyChat openBottomSheet={openBottomSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },

  content: {
    flex: 1,
  },
});

export default Content;
