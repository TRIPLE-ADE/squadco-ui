import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.small,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 24 },
      large: { paddingVertical: 16, paddingHorizontal: 32 },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: COLORS.primary,
      },
      secondary: {
        backgroundColor: COLORS.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
      },
    };

    return [
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
      disabled && styles.disabled,
      style,
    ];
  };

  const getTextStyles = () => {
    const baseStyle: TextStyle = {
      fontFamily: FONT.medium,
      fontSize: size === 'large' ? SIZES.medium : SIZES.small,
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: COLORS.white,
      },
      secondary: {
        color: COLORS.white,
      },
      outline: {
        color: COLORS.primary,
      },
    };

    return [baseStyle, variantTextStyles[variant], textStyle];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyles()}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
          style={styles.loader}
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginRight: SIZES.small,
  },
});

export default Button; 