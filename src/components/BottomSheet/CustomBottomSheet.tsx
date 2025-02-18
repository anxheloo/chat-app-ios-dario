import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../theme/theme';

type BottomSheetProps = {
  children: React.ReactNode;
};

type Ref = BottomSheet;

const CustomBottomSheet = forwardRef<Ref, BottomSheetProps>(
  ({children}, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={2}
          disappearsOnIndex={0}
          {...props}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        //   onClose={onClose}
        // index={-1}
        index={0}
        handleIndicatorStyle={styles.handleIndicator}
        handleStyle={styles.indicatorContainer}>
        <View style={styles.contentContainer}></View>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'red',
  },

  indicatorContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.LightGray2,
  },

  handleIndicator: {
    backgroundColor: COLORS.LightGray,
  },
});

export default CustomBottomSheet;
