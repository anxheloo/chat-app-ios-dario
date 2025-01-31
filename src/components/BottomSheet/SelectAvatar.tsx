import React, {memo} from 'react';
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
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const avatar = useAppStore(state => state.avatar);

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.header}>
        <ReusableText fontSize={FONTSIZE.md} fontWeight={300} onPress={cancel}>
          Cancel
        </ReusableText>
        {/* <ReusableText fontSize={FONTSIZE.md} fontWeight={500} onPress={setFunc}>
          Set
        </ReusableText> */}
      </View>

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
        <Avatar width={100} height={100} avatarWidth={70} avatarHeight={70} />
      </View>

      <View style={styles.avatarContainer2}>
        <View style={styles.avatarContainer}>
          {avatarUrls.map((icon, index) => {
            const SelectedAvatar = icon;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setUserPersona({avatar: index})}
                style={[
                  styles.avatarItem,
                  {borderColor: avatar === index ? 'black' : 'transparent'},
                ]}>
                <SelectedAvatar width={37.5} height={37.5} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <ReusableButton text="Set" onPress={() => setFunc(avatar)} />
    </View>
  );
});

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    // paddingBottom: Platform.OS === 'android' ? 50 : 0,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    flex: 0.5,
    justifyContent: 'center',
    marginTop: 20,
  },

  selectableIconParent: {
    flex: 1,
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
    flex: 1,
    maxWidth: 250,
  },

  avatarContainer2: {
    flex: 1,
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
