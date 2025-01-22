import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import Layout from '../../components/Layout/Layout';
import {NavigationProps} from '../../utils/types';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import ContactsList from './ContactsList';
import {useAppStore} from '../../store';
import useFriend from '../../utils/hooks/useFriend';

type Props = {
  navigation: NavigationProps;
};

const Contacts: React.FC<Props> = ({navigation}) => {
  // const {getFriends, loading} = useFriend();
  const getFriends = useFriend();
  const loading = useAppStore(state => state.loading);

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    console.log('Inside Contacts useEffect , step 3');
    getFriends();
    // }, [getFriends]);
  }, []);

  const clearSearch = useCallback((): void => {
    setSearch('');
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <Layout>
      <View style={styles.container}>
        <ReusableInput
          placeholder="Search"
          value={search}
          onChange={setSearch}
          onPress={clearSearch}
          icon1={<SearchIcon width={15} height={15} />}
          icon2={<CloseIcon width={15} height={15} />}
        />

        <ContactsList navigation={navigation} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
});

export default Contacts;
