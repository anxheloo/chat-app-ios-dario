import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import EmptyChat from './EmptyChat';
import {useAppStore} from '../../store';
import Persona from '../../components/Persona/Persona';
import {NavigationProps} from '../../utils/types';
import {apiClient} from '../../api/apiClient';
import {GET_CONTACTS_FOR_DM} from '../../api/apis';
import {getToken} from '../../utils/TokenStorage';

type ContentProps = {
  openBottomSheet: () => void;
  navigation: NavigationProps;
};

const Content: React.FC<ContentProps> = ({openBottomSheet, navigation}) => {
  const directMessagesContacts = useAppStore(
    state => state.directMessagesContacts,
  );
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages);

  // Get all contacts that we have sent a message
  useEffect(() => {
    const getContacts = async () => {
      const token = await getToken();

      const res = await apiClient.get(GET_CONTACTS_FOR_DM, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        // console.log('This are contacts:', res.data.contacts);
        updateFuncChat({directMessagesContacts: [...res.data.contacts]});
      }
    };

    getContacts();
  }, [selectedChatMessages]);

  if (directMessagesContacts.length > 0) {
    return (
      <FlatList
        contentContainerStyle={styles.content}
        data={directMessagesContacts}
        renderItem={({item}) => (
          <Persona contact={item} navigation={navigation} version={2} />
        )}
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
    padding: 20,
  },
});

export default Content;
