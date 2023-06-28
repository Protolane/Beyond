import { Text, TouchableRipple } from 'react-native-paper';
import type { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';
import Icon from 'react-native-paper/src/components/Icon';
import { StyleSheet, View } from 'react-native';

export interface DialogItemProps {
  icon?: IconSource;
  appendIcon?: IconSource;
  label?: string;
  onPress?: () => void;
}

const iconSize = 24;

export function DialogItem({ icon, appendIcon, label, onPress }: DialogItemProps) {
  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableRipple onPress={handlePress}>
      <View style={styles.container}>
        {icon ? <Icon size={iconSize} source={icon} /> : <View style={{ width: iconSize }} />}
        {label && (
          <Text style={styles.label} variant="titleMedium">
            {label}
          </Text>
        )}
        {appendIcon && <Icon size={iconSize} source={appendIcon} />}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 32,
  },
  label: {
    flex: 1,
    marginVertical: 8,
  },
});
