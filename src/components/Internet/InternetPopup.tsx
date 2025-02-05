import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CheckInternet from '../../utils/hooks/CheckInternet';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../theme/theme';

const InternetPopup = () => {
  const {hasInternet, handleTryAgain} = CheckInternet();

  if (hasInternet) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Check Internet Connection!</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={handleTryAgain} style={styles.btn}>
              <Text style={styles.deleteBtn}>Try again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

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
    backgroundColor: 'white',
  },
  deleteBtn: {fontWeight: '500', fontSize: FONTSIZE.md},
  cancelBtn: {fontWeight: '300', fontSize: FONTSIZE.md},
});

export default InternetPopup;
