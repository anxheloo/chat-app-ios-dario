import {useState, useEffect, useCallback} from 'react';
import {Alert, Linking} from 'react-native';
import {request, check, RESULTS} from 'react-native-permissions';

// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;

const usePermissionTest = (permissionType: any) => {
  const [permissionStatus, setPermissionStatus] = useState<any>();

  const checkPermissionStatus = useCallback(async () => {
    try {
      const status = await check(permissionType);
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  }, [permissionType]);

  const checkAndRequestPermission = async () => {
    try {
      if (permissionStatus === RESULTS.GRANTED) {
        return permissionStatus;
      }
      const status = await request(permissionType);
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const handleBlockedPermission = () => {
    Alert.alert(
      'Permission Blocked',
      'You have blocked this permission. Please go to settings and enable it to use this feature.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setPermissionStatus(null);
          },
        },
        {
          text: 'Go to settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {cancelable: false},
    );
  };

  //checking permission status
  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  //handling block status
  useEffect(() => {
    if (permissionStatus === RESULTS.BLOCKED) {
      handleBlockedPermission();
    }
  }, [permissionStatus]);

  return {permissionStatus, checkAndRequestPermission};
};

export default usePermissionTest;

// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
