import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, memo, useEffect} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {COLORS} from '../../theme/theme';
import {Portal, PortalHost} from '@gorhom/portal';

type BottomSheetProps = {
  children: React.ReactNode;
};

const BottomSheetWrapper = memo(
  forwardRef<BottomSheet, BottomSheetProps>(({children}, ref) => {
    // const snapPoints = ['1%', '25%', '50%', '75%'];
    const snapPoints = ['75%'];

    useEffect(() => {
      return () => {
        Keyboard.dismiss();
      };
    }, []);

    return (
      <>
        <Portal>
          <BottomSheet
            ref={ref}
            snapPoints={snapPoints}
            enablePanDownToClose
            keyboardBehavior="extend" // Prevent BottomSheet from being pushed
            // index={-1}
            index={0}
            handleIndicatorStyle={styles.handleIndicator}
            handleStyle={styles.indicatorContainer}
            style={styles.bottomSheet}>
            <BottomSheetView style={styles.contentContainer}>
              {children}
            </BottomSheetView>
          </BottomSheet>
        </Portal>

        <PortalHost name="BottomSheetWrapper" />
      </>
    );
  }),
);

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 25,
    shadowRadius: 10,
    shadowOpacity: 5,
    shadowColor: 'black',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.LightGray2,
  },

  indicatorContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.LightGray2,
  },

  handleIndicator: {
    backgroundColor: COLORS.LightGray,
  },

  contentContainer: {
    flex: 1,
    // paddingHorizontal: Platform.OS === 'ios' ? 20 : 40,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: COLORS.LightGray2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // paddingBottom: 40,
  },
});

export default BottomSheetWrapper;
