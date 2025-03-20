import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useAppStore} from '../../store';
import {COLORS} from '../../theme/theme';

const LogoutComponent = ({text}: {text: string}) => {
  const loading = useAppStore(state => state.loading);

  return (
    <View style={loading ? styles.isLoading : styles.normal}>
      {loading ? (
        <ActivityIndicator color="black" size={'small'} />
      ) : (
        <Text style={styles.username}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  isLoading: {
    justifyContent: 'center',
  },

  normal: {},

  username: {
    fontWeight: '300',
    color: COLORS.Black,
  },
});

export default LogoutComponent;
