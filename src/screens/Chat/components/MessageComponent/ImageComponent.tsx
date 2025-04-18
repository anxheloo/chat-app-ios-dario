import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {BORDERRADIUS} from '../../../../theme/theme';

import {Message, NavigationProps} from '../../../../utils/types';
import MessageHOC from './MessageHOC';

type ImageProps = {
  message: Message;
  isSender: boolean;
  isDeleted?: boolean;
};

const ImageComponent: React.FC<ImageProps> = ({message, isSender}) => {
  const navigation = useNavigation<NavigationProps>();

  const openImage = useCallback(() => {
    if (!message.uploading) {
      navigation.navigate('FullScreenMedia', {
        fileUrl: message.fileUrl,
        type: 'image',
      });
    }
  }, [navigation, message]);

  return (
    <TouchableOpacity
      onPress={openImage}
      activeOpacity={0.9}
      style={styles.image}>
      {message.uploading || message.downloading ? (
        <ActivityIndicator
          size="small"
          color={isSender ? '#fff' : '#000'}
          style={styles.activityIndicator}
        />
      ) : (
        <Image
          width={220}
          height={150}
          source={{
            uri: message.fileUrl,
          }}
          style={styles.image}
          resizeMode="cover"
          onError={error =>
            console.log('This is error inside ImageComponent:', error)
          }
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 150,
    borderTopLeftRadius: BORDERRADIUS.radius_13,
    borderTopRightRadius: BORDERRADIUS.radius_13,
  },

  activityIndicator: {
    position: 'absolute',
    inset: 0,
  },
});

export default MessageHOC(ImageComponent);
