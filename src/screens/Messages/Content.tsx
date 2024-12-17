import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import EmptyChat from './EmptyChat';
import {useAppStore} from '../../store';
import Persona from '../../components/Persona/Persona';
import {NavigationProps} from '../../utils/types';

type ContentProps = {
  openBottomSheet: () => void;
  navigation: NavigationProps;
};

const Content: React.FC<ContentProps> = ({openBottomSheet, navigation}) => {
  const directMessagesContacts = useAppStore(
    state => state.directMessagesContacts,
  );

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
