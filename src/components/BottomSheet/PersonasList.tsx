import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import Persona from '../Persona/Persona';
import AddIcon from '../../assets/icons/AddIcon';
import {useAppStore} from '../../store';

type PersonasListProps = {
  cancel: () => void;
};

const PersonasList: React.FC<PersonasListProps> = ({cancel}) => {
  const {navigation} = useAppStore();
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebounceSearch] = useState<string>('');
  const friends = useAppStore(state => state.friends);

  const searchedFriends = useMemo(
    () =>
      friends.filter(friend =>
        friend.username.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, friends],
  );

  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);

    const t = setTimeout(() => {
      setDebounceSearch(searchTerm);
    }, 300);

    return () => clearTimeout(t);
  };

  const clearSearch = useCallback((): void => {
    setSearch('');
    Keyboard.dismiss();
  }, []);

  const addNew = useCallback(async () => {
    cancel();
    navigation?.navigate('Scanner');
  }, [cancel, navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <ReusableText
            fontSize={FONTSIZE.md}
            fontWeight={300}
            onPress={cancel}>
            Cancel
          </ReusableText>
          <AddIcon width={17.5} height={17.5} onPress={addNew} />
        </View>

        <View style={styles.textContainer}>
          <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
            Personas List
          </ReusableText>
          <ReusableText
            fontSize={14}
            fontWeight={FONTWEIGHT[300]}
            color={COLORS.LightGray}
            textAlign="center">
            The username you enter will be visible only to your Solitar contact
            list
          </ReusableText>
        </View>

        <ReusableInput
          placeholder="Search"
          value={search}
          onChange={updateSearch}
          onPress={clearSearch}
          backgroundColor="white"
          icon1={<SearchIcon width={15} height={15} />}
          icon2={<CloseIcon width={15} height={15} />}
        />

        <FlatList
          contentContainerStyle={styles.list}
          data={searchedFriends}
          renderItem={({item}) => (
            <Persona
              contact={item}
              navigation={navigation}
              cancel={cancel}
              version="search"
            />
          )}
          keyExtractor={item => item._id}
          // ListEmptyComponent={<Text>ska kontakte</Text>}
          initialNumToRender={10}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    flex: 0.5,
    justifyContent: 'center',
    marginTop: 20,
  },
  list: {
    flex: 1,
    paddingTop: 10,
  },
});

export default PersonasList;
