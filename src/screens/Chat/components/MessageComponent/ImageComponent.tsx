/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {BORDERRADIUS} from '../../../../theme/theme';
import {Message, NavigationProps} from '../../../../utils/types';
import {useNavigation} from '@react-navigation/native';

type ImageProps = {
  message: Message;
  uploading: boolean;
  isSender: boolean;
};

const ImageComponent: React.FC<ImageProps> = ({
  message,
  uploading,
  isSender,
}) => {
  const navigation = useNavigation<NavigationProps>();
  // const [upload, setUpload] = useState(true);

  const openImage = useCallback(() => {
    if (!uploading) {
      navigation.navigate('FullScreenMedia', {
        fileUrl: message.fileUrl,
        type: 'image',
      });
    }
  }, [uploading, navigation, message.fileUrl]);

  console.log('This is fileIrl inside image:', message.fileUrl);

  return (
    <TouchableOpacity
      onPress={openImage}
      activeOpacity={0.9}
      style={styles.image}>
      {uploading ? (
        <ActivityIndicator
          size="small"
          color={isSender ? '#fff' : '#000'}
          style={styles.activityIndicator}
        />
      ) : (
        <Image
          width={220}
          height={150}
          // source={{uri: `data:image/png;base64,${message.fileUrl}`}}
          source={{
            uri: message.fileUrl,
          }}
          style={styles.image}
          resizeMode="cover"
          // onLoad={() => setUpload(false)}
          onError={error => console.log('This is error:', error)}
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

export default ImageComponent;
