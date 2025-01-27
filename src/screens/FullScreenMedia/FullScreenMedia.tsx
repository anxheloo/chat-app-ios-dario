import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import {RootStackParamList} from '../../utils/types';
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
        style={styles.closeIcon}
      />

      {type === 'image' ? (
        <Image
          source={{uri: fileUrl}}
          style={styles.media}
          resizeMode="contain"
        />
      ) : (
        <Video
          source={{uri: fileUrl}}
          style={styles.media}
          controls
          resizeMode="contain"
          paused={false}
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
  },
  media: {flex: 1, maxHeight: '80%', zIndex: 10},
  closeIcon: {position: 'absolute', top: 50, left: 20, zIndex: 20},
});

export default FullScreenMedia;
