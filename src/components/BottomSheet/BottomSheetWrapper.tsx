import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {forwardRef, memo, useCallback, useEffect, useMemo} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {COLORS} from '../../theme/theme';
import {Portal} from '@gorhom/portal';
import {useAppStore} from '../../store';

type BottomSheetProps = {
  children: React.ReactNode;
};

const BottomSheetWrapper = memo(
  forwardRef<BottomSheet, BottomSheetProps>(({children}, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    // const snapPoints = ['75%'];
    const updateKeys = useAppStore(state => state.updateKeys);

    useEffect(() => {
      return () => {
        Keyboard.dismiss();
      };
    }, []);

    const onClose = useCallback(() => {
      updateKeys({bottomSheetType: null});
    }, [updateKeys]);

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
      <Portal name="BottomSheetWrapper">
        {/* <View style={styles.container}> */}
        <BottomSheet
          ref={ref}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          onClose={onClose}
          keyboardBehavior="extend"
          // index={-1}
          index={0}
          handleIndicatorStyle={styles.handleIndicator}
          handleStyle={styles.indicatorContainer}
          style={styles.bottomSheet}>
          <BottomSheetView style={styles.contentContainer}>
            {children}
          </BottomSheetView>
        </BottomSheet>
        {/* </View> */}
      </Portal>
    );
  }),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bottomSheet: {
    // flex: 1,
    // height: '100%',
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
    paddingBottom: 20,
  },
});

export default BottomSheetWrapper;
