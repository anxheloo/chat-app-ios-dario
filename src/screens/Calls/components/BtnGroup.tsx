import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DisabledVideoIcon from '../../../assets/icons/Calls/disabledVideo.svg';
import DisabledMicIcon from '../../../assets/icons/Calls/disabledMic.svg';
import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';
import {useAppStore} from '../../../store';

type Props = {
  onMiddlePress: () => void;
};

const BtnGroup: React.FC<Props> = ({onMiddlePress}) => {
  // const {callType, socket, updateCallState, id, caller} =
  //   useAppStore.getState();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sideBtn}>
        <DisabledMicIcon />
      </TouchableOpacity>

      <View style={styles.middleBtnContainer}>
        <TouchableOpacity style={styles.middleBtn} onPress={onMiddlePress}>
          <CallIcon width={24} height={24} fill={'white'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sideBtn}>
        <DisabledVideoIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    alignItems: 'center',
  },

  middleBtnContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#FF675C',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  middleBtn: {
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF675C',
  },

  sideBtn: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BtnGroup;
