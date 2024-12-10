import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {BORDERRADIUS, COLORS, FONTSIZE, FONTWEIGHT} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';
import {useAppStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AvatarIcon from '../../assets/icons/svg/Avatar0';
import Avatar1 from '../../assets/icons/svg/Avatar1';
import Avatar2 from '../../assets/icons/svg/Avatar2';
import Avatar3 from '../../assets/icons/svg/Avatar3';
import Avatar4 from '../../assets/icons/svg/Avatar4';
import Avatar5 from '../../assets/icons/svg/Avatar5';
import Avatar6 from '../../assets/icons/svg/Avatar6';
import Avatar7 from '../../assets/icons/svg/Avatar7';

type RootStackParamList = {
  CreatePin: undefined;
};

const SelectAvatar = forwardRef<BottomSheet>((props, ref) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const avatar = useAppStore(state => state.avatar);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);
  // const avatarUrls = [
  //   require('../../assets/icons/avatar-icons/avatar-0.png'),
  //   require('../../assets/icons/avatar-icons/avatar-1.png'),
  //   require('../../assets/icons/avatar-icons/avatar-2.png'),
  //   require('../../assets/icons/avatar-icons/avatar-3.png'),
  //   require('../../assets/icons/avatar-icons/avatar-4.png'),
  //   require('../../assets/icons/avatar-icons/avatar-5.png'),
  //   require('../../assets/icons/avatar-icons/avatar-6.png'),
  //   require('../../assets/icons/avatar-icons/avatar-7.png'),
  // ];

  const avatarUrls = [
    AvatarIcon,
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
  ];
  const SelectedIcon = avatarUrls[avatar];

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const cancel = (): void => {
    if (ref && typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  };

  const setFunc = (): void => {
    navigation.navigate('CreatePin');
  };

  return (
    <BottomSheet
      ref={ref}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={-1}
      handleIndicatorStyle={styles.handleIndicator}
      handleComponent={null}
      style={styles.bottomSheet}>
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <ReusableText
            fontSize={FONTSIZE.md}
            fontWeight={300}
            onPress={cancel}>
            Cancel
          </ReusableText>
          <ReusableText
            fontSize={FONTSIZE.md}
            fontWeight={500}
            onPress={setFunc}>
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
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 5,
    shadowRadius: 10,
  },

  handleIndicator: {
    // backgroundColor: COLORS.LightGray2,
  },

  contentContainer: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 20 : 40,
    backgroundColor: COLORS.LightGray2,
    justifyContent: 'space-between',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
