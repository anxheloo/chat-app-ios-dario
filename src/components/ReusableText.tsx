import React from 'react';
import {Text, TextStyle} from 'react-native';
import {FONTSIZE} from '../theme/theme';

type TextProps = {
  children: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle;
  onPress?: () => void;
};

const ReusableText: React.FC<TextProps> = ({
  children,
  fontSize = 14,
  fontWeight = 'normal',
  color = '#000',
  textAlign = 'left',
  style,
  onPress,
}) => {
  return (
    <Text
      onPress={onPress}
      style={[{fontSize, fontWeight, color, textAlign} as TextStyle, style]}>
      {children}
    </Text>
  );
};

export default ReusableText;
