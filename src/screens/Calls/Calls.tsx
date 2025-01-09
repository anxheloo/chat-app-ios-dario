import React, {useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header/Header';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import PersonasList from '../../components/BottomSheet/PersonasList';
import EmptyCall from './EmptyCall';
import ReusableInput from '../../components/ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

const Calls = () => {
  const [search, setSearch] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const openBottomSheet = (): void => {
    bottomSheetRef.current?.expand();
  };

  const addNew = (): void => {
    console.log('Add new');
  };

  const cancel = (): void => {
    if (bottomSheetRef && bottomSheetRef?.current) {
      bottomSheetRef.current.close();
    }
  };

  const clearSearch = (): void => {
    setSearch('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Header />

          <ReusableInput
            placeholder="Search"
            value={search}
            onChange={setSearch}
            clearSearch={clearSearch}
            icon1={<SearchIcon width={15} height={15} />}
            icon2={<CloseIcon width={15} height={15} />}
          />

          <View style={styles.content}>
            <EmptyCall openBottomSheet={openBottomSheet} />
          </View>
        </View>

        <BottomSheetWrapper ref={bottomSheetRef}>
          <PersonasList cancel={cancel} addNew={addNew} />
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
});

export default Calls;
