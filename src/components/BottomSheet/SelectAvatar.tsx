import React, {memo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableText from '../ReusableText';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import {useAppStore} from '../../store';
import {avatarUrls} from '../../utils/constants';
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
        <ReusableText fontSize={FONTSIZE.md} fontWeight={300} onPress={cancel}>
          Cancel
        </ReusableText>
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
                  <SelectedAvatar width={37.5} height={37.5} />
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
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 20,
  },

  selectableIconParent: {
    // marginTop: 40,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 250,
  },

  avatarContainer2: {
    // marginTop: 40,
    // marginBottom: 40,
    alignItems: 'center',
  },

  avatarItem: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },

  avatarImage: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
});

export default SelectAvatar;
