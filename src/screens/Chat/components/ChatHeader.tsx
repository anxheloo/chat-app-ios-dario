import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableText from '../../../components/ReusableText';
import {useNavigation} from '@react-navigation/native';
import {useAppStore} from '../../../store';
import Avatar from '../../../components/Persona/Avatar';
import {COLORS} from '../../../theme/theme';
import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';
import VideoIcon from '../../../assets/icons/Chat/VideoIcon';

const ChatHeader = memo(() => {
  const navigation = useNavigation();
  const {selectedChatData} = useAppStore();

  const goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <ReusableText fontWeight={500}>Back</ReusableText>
      </TouchableOpacity>

      <View style={styles.middleContent}>
        <Avatar
          width={26}
          height={26}
          avatarWidth={19.5}
          avatarHeight={19.5}
          backgroundColor={COLORS.LightGray2}
          src={selectedChatData?.avatar}
        />

        <ReusableText fontWeight={500}>
          @{selectedChatData?.username}
        </ReusableText>
      </View>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          console.log('Video icon clicked');
        }}>
        <VideoIcon width={'100%'} height={'100%'} fill={'#212121'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          console.log('Call icon clicked');
        }}>
        <CallIcon width={'100%'} height={'100%'} fill={'#212121'} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
    paddingTop: 10,
    maxHeight: 60,
  },

  middleContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },

  icon: {width: 24, height: 24, marginHorizontal: 10},

  backBtn: {
    padding: 10,
    borderRadius: 8,
  },
});

export default ChatHeader;
