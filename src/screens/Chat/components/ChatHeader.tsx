import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReusableText from '../../../components/ReusableText';
import {useNavigation} from '@react-navigation/native';
import {useAppStore} from '../../../store';
import Avatar from '../../../components/Persona/Avatar';
import {COLORS} from '../../../theme/theme';
import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';
import VideoIcon from '../../../assets/icons/Chat/VideoIcon';

const ChatHeader = () => {
  const navigation = useNavigation();
  const username = useAppStore(state => state.username);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ReusableText fontWeight={500} onPress={goBack}>
        Back
      </ReusableText>

      <View style={styles.middleContent}>
        <Avatar
          width={26}
          height={26}
          avatarWidth={19.5}
          avatarHeight={19.5}
          backgroundColor={COLORS.LightGray2}
        />

        <ReusableText fontWeight={500}>@{username}</ReusableText>
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
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    padding: 20,
    alignItems: 'center',
  },

  middleContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },

  icon: {width: 24, height: 24, marginHorizontal: 10},
});

export default ChatHeader;
