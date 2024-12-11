import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import ScanIcon from '../../assets/icons/messages/ScanIcon';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import MessagingIcon from '../../assets/icons/messages/MessagingIcon';
import ReusableInput from '../../components/ReusableInput';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import ReusableText from '../../components/ReusableText';
import BottomSheetWrapper from '../../components/BottomSheet/BottomSheetWrapper';
import PersonasList from '../../components/BottomSheet/PersonasList';
import BottomSheet from '@gorhom/bottom-sheet';

const Messages = () => {
  const [search, setSearch] = useState<string>('');
  const [isFocus, setIsFocus] = useState<boolean>(false);
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={{padding: 20, gap: 20}}>
            <ScanIcon width={24} height={24} style={{alignSelf: 'flex-end'}} />

            <TouchableWithoutFeedback
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}>
              <View style={[styles.inputContainer, isFocus && styles.focused]}>
                <SearchIcon width={15} height={15} />
                <ReusableInput
                  placeholder="Search"
                  value={search}
                  onChange={setSearch}
                />
                <CloseIcon width={15} height={15} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.content}>
            <View style={{alignItems: 'center', gap: 10}}>
              <MessagingIcon width={47} height={45} />
              <ReusableText fontSize={FONTSIZE.lg} fontWeight={400}>
                No Conversations
              </ReusableText>

              <ReusableText
                fontSize={14}
                fontWeight={FONTWEIGHT[300]}
                color={COLORS.LightGray}
                textAlign="center">
                Select persona and start messaging
              </ReusableText>
            </View>

            <ReusableText
              fontSize={16}
              fontWeight={FONTWEIGHT[400]}
              textAlign="center"
              textDecorationLine="underline"
              onPress={openBottomSheet}>
              Start Conversation
            </ReusableText>
          </View>
        </View>
        <BottomSheetWrapper ref={bottomSheetRef}>
          <PersonasList cancel={cancel} addNew={addNew}></PersonasList>
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

  inputContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
    backgroundColor: COLORS.LightGray2,
    paddingHorizontal: 15,
  },

  focused: {
    borderColor: COLORS.Black,
    borderWidth: 1,
  },
});

export default Messages;
