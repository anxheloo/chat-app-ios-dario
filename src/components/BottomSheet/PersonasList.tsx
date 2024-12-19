import React, {useState} from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReusableText from '../ReusableText';
import {COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableInput from '../ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import Persona from '../Persona/Persona';
import {apiClient} from '../../api/apiClient';
import {SEARCH} from '../../api/apis';
import {getToken} from '../../utils/TokenStorage';
import {RootStackParamList} from '../../screens/Profile/SettingElement';
import {NavigationProp} from '@react-navigation/native';
import {Contact, NavigationProps} from '../../utils/types';

type PersonasListProps = {
  cancel: () => void;
  addNew: () => void;
  navigation: NavigationProps;
};

// export type Contact = {
//   _id: string;
//   username: string;
//   avatar: number;
// };

const PersonasList: React.FC<PersonasListProps> = ({
  cancel,
  addNew,
  navigation,
}) => {
  const [search, setSearch] = useState<string>('');
  const [searchedContacts, setSearchContacts] = useState<Contact[]>([]);

  const clearSearch = (): void => {
    setSearch('');
    setSearchContacts([]);
    Keyboard.dismiss();
  };

  const searchContact = async (search: string) => {
    if (search.length > 0) {
      const token = await getToken();

      try {
        const res = await apiClient.post(
          SEARCH,
          {searchTerm: search},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 200) {
          // console.log('these are contacts:', res.data.contacts);
          setSearchContacts(res.data.contacts);
        } else {
          console.log('error searching contacts');
        }
      } catch (error) {
        console.error('API call error:', error);
      }
    } else {
      setSearchContacts([]);
    }
  };

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
          {/* <ReusableText
            fontSize={FONTSIZE.md}
            fontWeight={500}
            onPress={addNew}>
            Add New
          </ReusableText> */}
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
          onChange={value => {
            setSearch(value);
            searchContact(value);
          }}
          clearSearch={clearSearch}
          backgroundColor="white"
          icon1={<SearchIcon width={15} height={15} />}
          icon2={<CloseIcon width={15} height={15} />}
        />

        <FlatList
          contentContainerStyle={styles.list}
          data={searchedContacts}
          renderItem={({item}) => (
            <Persona
              contact={item}
              navigation={navigation}
              cancel={cancel}
              version={1}
            />
          )}
          keyExtractor={item => item._id}
          extraData={searchedContacts}
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
