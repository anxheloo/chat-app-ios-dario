import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useAppStore} from '../../store';
import {NavigationProps} from '../../utils/types';
import EmptyContacts from './EmptyContacts';
import Persona from '../../components/Persona/Persona';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

type ContentProps = {
  navigation: NavigationProps;
};

const ContactsList: React.FC<ContentProps> = ({navigation}) => {
  const friends = useAppStore(state => state.friends);
  const loading = useAppStore(state => state.loading);
  const [search, setSearch] = useState<string>('');

  const clearSearch = useCallback((): void => {
    setSearch('');
  }, []);

  if (loading) {
    return <FullScreenLoader version={'flex'} />;
  }

  if (!friends.length) {
    return <EmptyContacts navigation={navigation} />;
  }

  return (
    <View style={styles.content}>
      <ReusableInput
        placeholder="Search"
        value={search}
        onChange={setSearch}
        onPress={clearSearch}
        icon1={<SearchIcon width={15} height={15} />}
        icon2={<CloseIcon width={15} height={15} />}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ContactsList;
