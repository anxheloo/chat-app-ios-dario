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
};

const ImageComponent: React.FC<ImageProps> = ({message, uploading}) => {
  // const [loading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const openImage = useCallback(() => {
    if (!uploading) {
      navigation.navigate('FullScreenMedia', {
        fileUrl: message.fileUrl,
        type: 'image',
      });
    }
  }, [uploading, message.fileUrl]);

  return (
    <TouchableOpacity
      // style={styles.imageContainer}
      onPress={openImage}
      activeOpacity={1}>
      {uploading ? (
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        />
      ) : (
        <Image
          source={{uri: message.fileUrl}}
          style={styles.image}
          resizeMode="cover"
          // onLoadStart={() => setIsLoading(true)}
          // onLoad={() => setIsLoading(false)}
          // onError={() => {
          //   setIsLoading(false);
          //   console.log('Error loading image');
          // }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 220,
    height: 150,
  },

  image: {
    width: 220,
    height: 150,
    borderTopLeftRadius: BORDERRADIUS.radius_13,
    borderTopRightRadius: BORDERRADIUS.radius_13,
  },
});

export default ImageComponent;
