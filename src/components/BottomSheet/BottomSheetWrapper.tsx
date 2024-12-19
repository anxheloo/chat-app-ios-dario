import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme/theme';
import {Portal, PortalHost} from '@gorhom/portal';

type BottomSheetProps = {
  children: React.ReactNode;
};

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetProps>(
  ({children}, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);
    const handleSheetChanges = useCallback((index: number) => {
      // console.log('handleSheetChanges', index);
    }, []);

    return (
      <>
        <Portal>
          <BottomSheet
            ref={ref}
            onChange={handleSheetChanges}
            snapPoints={snapPoints}
            enablePanDownToClose
            index={-1}
            handleIndicatorStyle={styles.handleIndicator}
            // handleComponent={null}
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
  },
);

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 35,
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
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 40,
    justifyContent: 'space-between',
    backgroundColor: COLORS.LightGray2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },
});

export default BottomSheetWrapper;
