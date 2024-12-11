import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableText from '../ReusableText';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import Avatar0 from '../../assets/icons/avatar/Avatar0';
import Avatar1 from '../../assets/icons/avatar/Avatar1';
import Avatar2 from '../../assets/icons/avatar/Avatar2';
import Avatar3 from '../../assets/icons/avatar/Avatar3';
import Avatar4 from '../../assets/icons/avatar/Avatar4';
import Avatar5 from '../../assets/icons/avatar/Avatar5';
import Avatar6 from '../../assets/icons/avatar/Avatar6';
import Avatar7 from '../../assets/icons/avatar/Avatar7';
import {useAppStore} from '../../store';

type SelectAvatarProps = {
  cancel: () => void;
  setFunc: () => void;
};

const SelectAvatar: React.FC<SelectAvatarProps> = ({cancel, setFunc}) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const avatar = useAppStore(state => state.avatar);

  const avatarUrls = [
    Avatar0,
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
  ];
  const SelectedIcon = avatarUrls[avatar];

  return (
    <>
      <View style={styles.header}>
        <ReusableText fontSize={FONTSIZE.md} fontWeight={300} onPress={cancel}>
          Cancel
        </ReusableText>
        <ReusableText fontSize={FONTSIZE.md} fontWeight={500} onPress={setFunc}>
          Set
        </ReusableText>
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
        <View style={styles.iconContainer}>
          <SelectedIcon width={70} height={70} />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={styles.avatarContainer}>
          {avatarUrls.map((url, index) => {
            const SelectedAvatar = url;

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

      <TouchableOpacity style={styles.button} onPress={setFunc}>
        <ReusableText color="white" fontWeight={FONTWEIGHT[600]}>
          Set
        </ReusableText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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

  iconContainer: {
    backgroundColor: 'white',
    width: 100,
    height: 100,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'center',
    alignItems: 'center',
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

  button: {
    width: '100%',
    backgroundColor: COLORS.Black,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
  },
});

export default SelectAvatar;
