import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;

    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return 'white';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.xs, paddingHorizontal: spacing.m };
      case 'large':
        return { paddingVertical: spacing.m, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.s, paddingHorizontal: spacing.l };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return fontSize.s;
      case 'large':
        return fontSize.l;
      default:
        return fontSize.m;
    }
  };

  const getBorderStyle = () => {
    return variant === 'outline'
      ? { borderWidth: 1, borderColor: colors.primary }
      : {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getPadding(),
        getBorderStyle(),
        { backgroundColor: getBackgroundColor() },
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor(), fontSize: getFontSize() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
