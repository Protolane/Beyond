import type { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';
import { View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import React from 'react';

interface CounterButtonProps {
  icon: IconSource;
  onPress?: () => void;
  counter?: number;
  size?: number;
  pressed?: boolean;
  disabled?: boolean;
}

export function CounterButton({ size, icon, onPress, counter = 0, pressed, disabled }: CounterButtonProps) {
  const { colors } = useTheme();
  function formatNumber(number: number) {
    if (number < 1000) {
      return number;
    }
    return (number / 1000).toFixed(1) + 'k';
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <IconButton
        iconColor={pressed ? colors.tertiary : undefined}
        size={size}
        onPress={onPress}
        icon={icon}
        disabled={disabled}
      />
      {counter > 0 && <Text variant="labelSmall">{formatNumber(counter)}</Text>}
    </View>
  );
}
