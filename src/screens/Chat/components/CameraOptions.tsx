import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

/* toggle includeExtra */
const includeExtra = true;

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image/Video',
    type: 'capture',
    options: {
      selectionLimit: 6,
      mediaType: 'mixed',
      formatAsMp4: true,
      // includeExtra,
      quality: 0.4,
      assetRepresentationMode: 'current',
    },
  },
  {
    title: 'Select Image/Video',
    type: 'library',
    options: {
      selectionLimit: 6,
      mediaType: 'mixed',
      formatAsMp4: true,
      // includeExtra,
      assetRepresentationMode: 'current',
      quality: 0.4,
    },
  },
];

type Props = {
  onButtonPress: (
    type: 'capture' | 'library',
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions,
  ) => void;
};

const CameraOptions: React.FC<Props> = ({onButtonPress}) => {
  return (
    <View style={styles.container}>
      {actions.map(({title, type, options}) => {
        return (
          <Text
            key={title}
            onPress={() => onButtonPress(type, options)}
            style={{fontSize: 14, fontWeight: '400', paddingRight: 10}}>
            {title}
          </Text>
        );
      })}
    </View>
  );
};

export default CameraOptions;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -80,
    right: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowRadius: 6,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: -1,
    },
    gap: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});
