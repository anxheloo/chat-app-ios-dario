import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Video from 'react-native-video';
import {RootStackParamList} from '../../utils/types';
import {SafeAreaView} from 'react-native-safe-area-context';
import CloseIcon from '../../assets/icons/messages/CloseIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'FullScreenMedia'>;

const FullScreenMedia: React.FC<Props> = ({route, navigation}) => {
  const {fileUrl, type} = route.params;

  console.log('This is file Url:', fileUrl);

  return (
    <View style={styles.container}>
      <CloseIcon
        onPress={() => navigation.goBack()}
        width={24}
        height={24}
        style={{position: 'absolute', top: 50, left: 20, zIndex: 20}}
      />

      {type === 'image' ? (
        <Image
          source={{uri: fileUrl}}
          style={styles.media}
          resizeMode="cover"
        />
      ) : (
        <Video
          source={{uri: fileUrl}}
          style={styles.media}
          controls
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: 'black'},
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    // paddingVertical: 120,
  },
  media: {flex: 1, maxHeight: '80%', zIndex: 10},
  // header: {
  //   gap: 20,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E5E5E5',
  //   paddingHorizontal: 20,
  //   paddingBottom: 20,
  //   paddingTop: 10,
  // },
});

export default FullScreenMedia;
