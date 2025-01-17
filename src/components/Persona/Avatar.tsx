import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppStore} from '../../store';
import {avatarUrls} from '../../utils/constants';
import {BORDERRADIUS} from '../../theme/theme';
import {useRoute} from '@react-navigation/native';
import EditIcon from '../../assets/icons/profile/EditIcon';

type AvatarProps = {
  width: number;
  height: number;
  avatarWidth: number;
  avatarHeight: number;
  backgroundColor?: string;
  routeName?: string;
  onPress?: () => void;
  src?: number;
};

const Avatar: React.FC<AvatarProps> = memo(
  ({
    width,
    height,
    avatarWidth,
    avatarHeight,
    backgroundColor = 'white',
    routeName,
    onPress,
    src,
  }) => {
    const avatar = useAppStore(state => state.avatar);
    const Avatar = avatarUrls[src !== undefined ? src : avatar];

    return (
      <View style={[styles.container, {backgroundColor, width, height}]}>
        {routeName === 'Profile' && (
          <TouchableOpacity style={styles.editContainer} onPress={onPress}>
            <EditIcon width={10} height={12} />
          </TouchableOpacity>
        )}
        <Avatar width={avatarWidth} height={avatarHeight} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDERRADIUS.radius_14,
    position: 'relative',
  },

  editContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: 'black',
  },
});

export default Avatar;
