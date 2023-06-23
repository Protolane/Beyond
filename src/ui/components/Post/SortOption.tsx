import { Text, TouchableRipple } from 'react-native-paper';
import type { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';
import Icon from 'react-native-paper/src/components/Icon';
import { StyleSheet, View } from 'react-native';

export interface SortOptionProps {
  icon: IconSource;
  label: string;
  selected: boolean;
  onPress: () => void;
}

const iconSize = 24;

export function SortOption({ icon, label, selected, onPress }: SortOptionProps) {
  return (
    <TouchableRipple onPress={onPress}>
      <View style={styles.container}>
        <Icon size={iconSize} source={icon} />
        <Text style={styles.label} variant="titleMedium">
          {label}
        </Text>
        {selected && <Icon size={iconSize} source={'check-circle-outline'} />}
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
