import type { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';
import { DialogItem } from '../../../core/dialog/components/DialogItem';

export interface SortOptionProps {
  icon: IconSource;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SortOption({ icon, label, selected, onPress }: SortOptionProps) {
  return (
    <DialogItem
      icon={icon}
      label={label}
      onPress={onPress}
      appendIcon={selected ? 'check-circle-outline' : undefined}
    />
  );
}
