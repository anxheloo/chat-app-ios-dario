import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import moment from 'moment';

import {COLORS} from '../../../../theme/theme';

type Props = {
  showDate: boolean | undefined;
  createdAt: string;
};

const DayDate: React.FC<Props> = memo(({showDate, createdAt}) => {
  if (showDate) {
    return (
      <View style={styles.container}>
        <Text style={styles.dateLabel}>
          {moment(createdAt).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'MMM Do, YYYY',
          })}
        </Text>
      </View>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateLabel: {
    color: COLORS.White,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: COLORS.Black,
    padding: 2,
    paddingHorizontal: 23,
    borderRadius: 7,
  },
});

export default DayDate;
