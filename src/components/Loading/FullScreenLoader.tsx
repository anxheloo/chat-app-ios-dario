import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useAppStore} from '../../store';

type Props = {
  version: 'absolute' | 'flex';
  type?: 'conversationPagination' | 'friendsPagination' | 'callsPagination';
};

const FullScreenLoader: React.FC<Props> = ({version, type}) => {
  const loading = useAppStore(state =>
    type ? state[type].isLoading : state.loading,
  );
  const color = version === 'absolute' || 'flex' ? 'white' : 'black';

  if (!loading) {
    return null;
  }

  return (
    <View
      style={
        version === 'absolute'
          ? styles.loadingContainer
          : styles.loadingContainer2
      }>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // backgroundColor: 'white',
  },

  loadingContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'white',
  },
});

export default FullScreenLoader;
