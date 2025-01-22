import React, {memo, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../theme/theme';

type inputProps = {
  placeholder?: string;
  value: string;
  isPassword?: boolean;
  backgroundColor?: string;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
  onPress?: () => void;
  onChange: (value: string) => void;
  onSubmitEditing?: () => void;
};

const ReusableInput: React.FC<inputProps> = memo(
  ({
    placeholder,
    value,
    isPassword,
    backgroundColor = COLORS.LightGray2,
    icon1,
    icon2,
    onPress,
    onChange,
    onSubmitEditing,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          {backgroundColor},
        ]}>
        {icon1 && icon1}
        <TextInput
          value={value}
          onChangeText={text => onChange(text)}
          secureTextEntry={isPassword}
          maxLength={isPassword ? 4 : undefined}
          placeholder={placeholder}
          placeholderTextColor={COLORS.LightGray}
          style={[styles.input, {textAlign: isPassword ? 'center' : 'left'}]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmitEditing}
        />

        {icon2 && (
          <TouchableOpacity onPress={onPress}>{icon2}</TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 46,
    borderRadius: BORDERRADIUS.radius_14,
    paddingHorizontal: 15,
    maxWidth: 320,
    alignSelf: 'center',
    marginVertical: 10,
  },
  focused: {
    borderColor: COLORS.Black,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: '100%',
    color: COLORS.Black,
  },
});

export default ReusableInput;
