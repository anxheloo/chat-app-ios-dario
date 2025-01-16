import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {HOST} from '../../../../api/apis';
import {BORDERRADIUS} from '../../../../theme/theme';

type ImageProps = {
  fileUrl: string;
};

const ImageComponent: React.FC<ImageProps> = ({fileUrl}) => {
  const [loading, setIsLoading] = useState(false);

  return (
    <View style={styles.imageContainer}>
      {loading && (
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        />
      )}

      <Image
        // source={{uri: `${HOST}/${fileUrl}`}}
        source={{uri: fileUrl}}
        style={styles.image}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          console.log('Error loading image');
        }}
      />
    </View>
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
