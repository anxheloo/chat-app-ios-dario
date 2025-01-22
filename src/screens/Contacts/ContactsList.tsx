import React, {memo, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import EmptyContacts from './EmptyContacts';
import Persona from '../../components/Persona/Persona';
import useFriend from '../../utils/hooks/useFriend';

type ContentProps = {
  navigation: NavigationProps;
};

const ContactsList: React.FC<ContentProps> = memo(({navigation}) => {
  const friends = useAppStore(state => state.friends);
  // const {getFriends,loading} = useFriend();

  const action = useCallback(() => navigation.navigate('Scanner'), []);

  // useEffect(() => {
  //   getFriends();
  // }, [getFriends]);

  if (!friends.length) {
    return <EmptyContacts action={action} />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={friends}
      renderItem={({item}) => (
        <Persona
          contact={item}
          navigation={navigation}
          backgroundColor="white"
        />
      )}
      keyExtractor={item => item._id}
      initialNumToRender={10}
    />
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default ContactsList;
