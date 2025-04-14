import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {BORDERRADIUS, COLORS, FONTSIZE} from '../../theme/theme';

import {useAppStore} from '../../store';
import {closeModal, handleDelete} from '../../utils/message';

const DeleteMsg = React.memo(() => {
  const selectedMsgToDelete = useAppStore(
    state => state.selectedMessageToDelete,
  );
  const isShown = selectedMsgToDelete !== null;

  if (!isShown) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Are you sure?</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity style={[styles.btn]} onPress={closeModal}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.btn, {backgroundColor: COLORS.White}]}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    backgroundColor: COLORS.LightGray2,
    width: '100%',
    maxWidth: 320,
    height: 120,
    padding: 10,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  title: {
    color: COLORS.Black,
    fontSize: FONTSIZE.lg,
    fontWeight: '700',
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  btn: {
    width: 130,
    borderRadius: BORDERRADIUS.radius_14,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {fontWeight: '500', fontSize: FONTSIZE.md},
  cancelBtn: {fontWeight: '300', fontSize: FONTSIZE.md},
});

export default DeleteMsg;
