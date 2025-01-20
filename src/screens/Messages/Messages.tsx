import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import PersonasList from '../../components/BottomSheet/PersonasList';
import BottomSheet from '@gorhom/bottom-sheet';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import Content from './Content';
import {NavigationProps} from '../../utils/types';
import {useAppStore} from '../../store';
import Layout from '../../components/Layout/Layout';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';

type MessagesScreenProps = {
  navigation: NavigationProps;
};

const Messages: React.FC<MessagesScreenProps> = ({navigation}) => {
  const loading = useAppStore(state => state.loading);
  const [search, setSearch] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet | null>(null);

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

  return (
    <Layout>
      {loading ? (
        <FullScreenLoader />
      ) : (
        <View style={styles.container}>
          <ReusableInput
            placeholder="Search"
            value={search}
            onChange={setSearch}
            onPress={clearSearch}
            icon1={<SearchIcon width={15} height={15} />}
            icon2={<CloseIcon width={15} height={15} />}
          />

          <Content openBottomSheet={openBottomSheet} navigation={navigation} />
        </View>
      )}

      <BottomSheetWrapper ref={bottomSheetRef}>
        <PersonasList cancel={cancel} addNew={addNew} navigation={navigation} />
      </BottomSheetWrapper>
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

export default Messages;
