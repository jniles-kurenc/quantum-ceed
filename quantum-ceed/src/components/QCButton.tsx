import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../lib/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function QCButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
  fullWidth = true,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && { width: '100%' },
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.bg : colors.gold} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                variant === 'primary' && { color: colors.bg },
                variant === 'secondary' && { color: colors.text },
                variant === 'ghost' && { color: colors.gold },
                variant === 'danger' && { color: colors.danger },
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    ...typography.h3,
    letterSpacing: 0.3,
  },
  primary: {
    backgroundColor: colors.gold,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
