import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';
import {useAppStore} from '../../store';

const SelectAvatar = forwardRef<BottomSheet>((props, ref) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const avatar = useAppStore(state => state.avatar);

  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const avatarUrls = [
    require('../../assets/icons/avatar-icons/avatar-0.png'),
    require('../../assets/icons/avatar-icons/avatar-1.png'),
    require('../../assets/icons/avatar-icons/avatar-2.png'),
    require('../../assets/icons/avatar-icons/avatar-3.png'),
    require('../../assets/icons/avatar-icons/avatar-4.png'),
    require('../../assets/icons/avatar-icons/avatar-5.png'),
    require('../../assets/icons/avatar-icons/avatar-6.png'),
    require('../../assets/icons/avatar-icons/avatar-7.png'),
  ];

  const cancel = (): void => {
    if (ref && typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  };

  return (
    <BottomSheet
      ref={ref}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={-1}
      handleComponent={null}>
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <ReusableText
            fontSize={FONTSIZE.md}
            fontWeight={300}
            onPress={cancel}>
            Cancel
          </ReusableText>
          <ReusableText fontSize={FONTSIZE.md} fontWeight={500}>
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

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.iconContainer}>
            <Image source={avatarUrls[avatar]} style={styles.icon} />
          </View>
        </View>

        <View style={styles.avatarContainer}>
          {avatarUrls.map((url, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setUserPersona({avatar: index})}
              style={[
                styles.avatarItem,
                {borderColor: avatar === index ? 'black' : 'transparent'},
              ]}>
              <Image source={url} style={styles.avatarImage} />
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1},

  contentContainer: {flex: 1, padding: 20},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {alignItems: 'center', gap: 10, flex: 1},

  iconContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: 100,
    height: 100,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 40,
    flex: 1,
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
