import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import Video from 'react-native-video';

import {RootStackParamList} from '../../utils/types';

import CloseIcon from '../../assets/icons/messages/CloseIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'FullScreenMedia'>;

const FullScreenMedia: React.FC<Props> = ({route, navigation}) => {
  const {fileUrl, type} = route.params;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CloseIcon
        onPress={() => navigation.goBack()}
        width={35}
        height={35}
        style={styles.closeIcon}
        fill={'#fff'}
      />

      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={'#FFF'} />
        </View>
      )}

      <View
        style={[StyleSheet.absoluteFill, styles.mediaView]}
        pointerEvents="none">
        {type === 'image' ? (
          <Image
            source={{uri: fileUrl}}
            style={styles.media}
            resizeMode="contain"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <Video
            source={{uri: fileUrl}}
            style={styles.media}
            controls
            resizeMode="cover"
            paused={false}
            onLoad={() => setIsLoading(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: 'black'},
  mediaView: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  media: {flex: 1, maxHeight: '70%'},
  closeIcon: {margin: 20},
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullScreenMedia;
