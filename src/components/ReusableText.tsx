import React, {memo} from 'react';
import {Text, TextStyle} from 'react-native';

type TextProps = {
  children: string | React.ReactNode;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle;
  textDecorationLine?: string;
  onPress?: () => void;
};

const ReusableText: React.FC<TextProps> = memo(
  ({
    children,
    fontSize = 14,
    fontWeight = 'normal',
    color = '#000',
    textAlign = 'left',
    style,
    textDecorationLine,
    onPress,
  }) => {
    return (
      <Text
        onPress={onPress}
        style={[
          {
            fontSize,
            fontWeight,
            color,
            textAlign,
            textDecorationLine,
          } as TextStyle,
          style,
        ]}>
        {children}
      </Text>
    );
  },
);

export default ReusableText;
