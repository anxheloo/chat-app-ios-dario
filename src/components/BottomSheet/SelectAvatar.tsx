import React, {memo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {avatarUrls} from '../../utils/constants';

import {useAppStore} from '../../store';

import ReusableText from '../ReusableText';
import Avatar from '../Persona/Avatar';
import ReusableButton from '../ReusableButton';

type SelectAvatarProps = {
  cancel: () => void;
  setFunc: (avatar: number) => void;
};

const SelectAvatar: React.FC<SelectAvatarProps> = memo(({cancel, setFunc}) => {
  const [avatar, setAvatar] = useState(useAppStore(state => state.avatar));

  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={cancel}>
          <ReusableText fontSize={FONTSIZE.md} fontWeight={300}>
            Cancel
          </ReusableText>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <ReusableText fontSize={FONTSIZE.title} fontWeight={700}>
            Select Avatar
          </ReusableText>
          <ReusableText
            fontSize={14}
            fontWeight={FONTWEIGHT[300]}
            color={COLORS.LightGray}
            textAlign="center">
            The username you enter will be visible only to your Solitar contact
            list
          </ReusableText>
        </View>

        <View style={styles.selectableIconParent}>
          <Avatar
            width={100}
            height={100}
            avatarWidth={70}
            avatarHeight={70}
            src={avatar}
          />
        </View>

        <View style={styles.avatarContainer2}>
          <View style={styles.avatarContainer}>
            {avatarUrls.map((icon, index) => {
              const SelectedAvatar = icon;
              const borderColor = avatar === index ? 'black' : 'transparent';

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setAvatar(index)}
                  style={[styles.avatarItem, {borderColor: borderColor}]}>
                  <SelectedAvatar width={47.5} height={47.5} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ReusableButton text="Set" onPress={() => setFunc(avatar)} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 20,
  },

  selectableIconParent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },

  avatarContainer: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  avatarContainer2: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 15,
  },

  avatarItem: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 5,
  },

  avatarImage: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
});

export default SelectAvatar;
