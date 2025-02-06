import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../theme/theme';

type Props = {
  Icon: any;
  focused: boolean;
  label: string;
};

const TabBarIcon: React.FC<Props> = ({Icon, focused, label}) => {
  return (
    <View style={styles.iconWrapper}>
      <Icon
        width={20}
        height={20}
        fill={focused ? '#212121' : COLORS.LightGray}
      />
      <Text
        style={[
          {
            color: focused ? '#212121' : COLORS.LightGray,
          },
          styles.label,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 100,
    height: 60,
    marginTop: 7,
    transform: Platform.OS === 'android' ? [{translateY: -15}] : undefined,
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    fontSize: 10,
  },
});

export default TabBarIcon;
