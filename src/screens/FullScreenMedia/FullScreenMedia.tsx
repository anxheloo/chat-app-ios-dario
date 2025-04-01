import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import {RootStackParamList} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {HOST} from '../../api/apis';

type Props = NativeStackScreenProps<RootStackParamList, 'FullScreenMedia'>;

const FullScreenMedia: React.FC<Props> = ({route, navigation}) => {
  const {fileUrl, type} = route.params;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color={'#FFF'} />}

      <CloseIcon
        onPress={() => navigation.goBack()}
        width={35}
        height={35}
        style={styles.closeIcon}
        fill={'#fff'}
      />

      {type === 'image' ? (
        <Image
          source={{uri: `${HOST}/${fileUrl}`}}
          style={styles.media}
          resizeMode="contain"
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <Video
          source={{uri: `${HOST}/${fileUrl}`}}
          style={styles.media}
          controls
          resizeMode="contain"
          paused={false}
          onLoad={() => setIsLoading(false)}
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
    // alignItems: 'center',
  },
  media: {flex: 1, maxHeight: '80%', zIndex: 10},
  closeIcon: {position: 'absolute', top: 80, left: 20, zIndex: 20},
});

export default FullScreenMedia;
