import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import PersonasList from '../../components/BottomSheet/PersonasList';
import BottomSheet from '@gorhom/bottom-sheet';
import Header from '../../components/Header/Header';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {apiClient} from '../../api/apiClient';
import {GET_USER_INFO} from '../../api/apis';
import {useAppStore} from '../../store';
import Content from './Content';
import {useSocket} from '../../utils/useSocket';
import {NavigationProps} from '../../utils/types';

type MessagesScreenProps = {
  navigation: NavigationProps;
};

const Messages: React.FC<MessagesScreenProps> = ({navigation}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const token = useAppStore(state => state.token);

  // Socket initialization when user logs in.
  useSocket();

  // Open bottom sheet
  const openBottomSheet = (): void => {
    bottomSheetRef.current?.expand();
  };

  // Add new
  const addNew = (): void => {
    console.log('Add new');
  };

  // Close bottom sheet
  const cancel = (): void => {
    if (bottomSheetRef && bottomSheetRef?.current) {
      bottomSheetRef.current.close();
    }
  };

  // Clear search
  const clearSearch = (): void => {
    setSearch('');
  };

  //  Get user info
  useEffect(() => {
    const getUserInfo = async () => {
      setLoading(true);

      const res = await apiClient.get(GET_USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        // check this for id
        setUserPersona(res.data);
        setLoading(false);
      }
    };

    getUserInfo();
  }, [token]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}

        {!loading && (
          <View style={styles.container}>
            <Header />

            <ReusableInput
              placeholder="Search"
              value={search}
              onChange={setSearch}
              onPress={clearSearch}
              icon1={<SearchIcon width={15} height={15} />}
              icon2={<CloseIcon width={15} height={15} />}
            />

            <Content
              openBottomSheet={openBottomSheet}
              navigation={navigation}
            />
          </View>
        )}

        <BottomSheetWrapper ref={bottomSheetRef}>
          <PersonasList
            cancel={cancel}
            addNew={addNew}
            navigation={navigation}
          />
        </BottomSheetWrapper>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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

  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Messages;
