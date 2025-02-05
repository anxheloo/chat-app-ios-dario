import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useAppStore} from '../../store';
import {avatarUrls} from '../../utils/constants';
import {BORDERRADIUS} from '../../theme/theme';
import EditIcon from '../../assets/icons/profile/EditIcon';

type AvatarProps = {
  width: number;
  height: number;
  avatarWidth: number;
  avatarHeight: number;
  backgroundColor?: string;
  routeName?: string;
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
    src,
  }) => {
    const avatar = useAppStore(state => state.avatar);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const Avatar = avatarUrls[src ?? avatar];

    return (
      <View style={[styles.container, {backgroundColor, width, height}]}>
        {routeName === 'Profile' && (
          <View style={styles.editContainer}>
            <EditIcon width={10} height={12} />
          </View>
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
