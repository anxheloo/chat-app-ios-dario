import React, {useEffect} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyChat from './EmptyChat';
import {useAppStore} from '../../store';
import Persona from '../../components/Persona/Persona';
import {NavigationProps} from '../../utils/types';
import {apiClient} from '../../api/apiClient';
import {
  DELETE_CONVERSATION,
  GET_CONTACTS_FOR_DM,
  GET_CONVERSATIONS,
} from '../../api/apis';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';
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

  // Get all contacts that we have sent a message
  useEffect(() => {
    const getConversations = async () => {
      const res = await apiClient.get(GET_CONVERSATIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        // Update the store with the fetched conversations
        // updateFuncChat({directMessagesContacts: [...res.data.conversations]});
        updateFuncChat({directMessagesContacts: res.data.conversations});
      }
    };

    getConversations();
  }, []);

  // Delete conversation
  const deleteConversation = async (id: string) => {
    // Backup the current state
    const previousConversations = [...directMessagesContacts];

    // Optimistically update the UI
    updateFuncChat({
      directMessagesContacts: directMessagesContacts.filter(
        conversation => conversation._id !== id,
      ),
    });

    try {
      const res = await apiClient.post(
        DELETE_CONVERSATION,
        {conversationId: id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        // Update UI by filtering out the deleted conversation
        // updateFuncChat({
        //   directMessagesContacts: directMessagesContacts.filter(
        //     conversation => conversation._id !== id,
        //   ),
        // });
        console.log(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);

      // Revert the UI change if the API call fails
      updateFuncChat({directMessagesContacts: previousConversations});

      Alert.alert('Could not delete the conversation. Please try again.');
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <View style={styles.renderRightActions}>
        <TouchableOpacity
          // onPress={() => setShowModal(true)}
          onPress={() => deleteConversation(id)}>
          <DeleteIcon width={17.5} height={21.5} />
        </TouchableOpacity>
      </View>
    );
  };

  if (directMessagesContacts.length > 0) {
    return (
      <FlatList
        contentContainerStyle={styles.content}
        data={directMessagesContacts}
        renderItem={({item}) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item._id)}
            overshootRight={false}>
            <Conversations
              conversation={item}
              navigation={navigation}
              backgroundColor={'white'}
            />
          </Swipeable>
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
    padding: 20,
  },

  renderRightActions: {
    paddingHorizontal: 10,
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default Content;
