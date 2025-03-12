import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// We can use CommonActions but also we can use the navigationRef directly

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(name, params));
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    // navigationRef.dispatch(CommonActions.goBack());
    navigationRef.goBack();
  }
}

export function reset(screenName: string) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: screenName}],
      }),
    );
    //  navigationRef.reset({
    //      index: 0,
    //      routes: [{name: screenName}],
    //    });
  }
}
