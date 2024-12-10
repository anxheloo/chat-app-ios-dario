import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {COLORS} from '../theme/theme';

type inputProps = {
  backgroundColor?: string;
  placeholder: string;
  value: string;
  isPassword?: boolean;
  onChange: (value: string) => void;
};

const ReusableInput: React.FC<inputProps> = ({
  backgroundColor = 'transparent',
  placeholder,
  value,
  isPassword,
  onChange,
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={text => onChange(text)}
      secureTextEntry={isPassword}
      maxLength={isPassword ? 4 : undefined}
      placeholder={placeholder}
      placeholderTextColor={COLORS.LightGray}
      style={{flex: 1, paddingHorizontal: 10, height: '100%', backgroundColor}}
    />
  );
};

const styles = StyleSheet.create({});

export default ReusableInput;
