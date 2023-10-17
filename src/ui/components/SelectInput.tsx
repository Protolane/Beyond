import React from 'react';
import type { TextInputProps } from 'react-native-paper';
import { Button, Checkbox, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDialog } from '../../core/dialog/hooks/useDialog';
import { SortTypes, SortTypesIcons, SortTypesLabels } from '../../core/consts';
import { SortOption } from './Post/SortOption';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import ScrollView = Animated.ScrollView;

interface SelectItem<T> {
  label: string;
  value: T;
}

export interface SelectInputProps<T> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'> {
  options: SelectItem<T>[];
  value: SelectItem<T>[];
  onChangeValue: (values: SelectItem<T>[]) => void;
}

export function SelectInput<T = string>({
  options = [],
  value = [],
  onChangeValue,
  ...textInputProps
}: SelectInputProps<T>) {
  const [tempSelected, setTempSelected] = React.useState<SelectItem<T>[]>(value);

  const { showDialog, hideDialog, component } = useDialog({
    content: (
      <SafeAreaView>
        <ScrollView>
          {options.map((option, i) => (
            <TouchableRipple
              key={option.value + '-' + i}
              onPress={() => {
                if (tempSelected.some(v => v.value === option.value))
                  return setTempSelected(tempSelected.filter(v => v.value !== option.value));

                return setTempSelected(
                  [...tempSelected, option].filter(
                    (item, index, self) => index === self.findIndex(t => t.value === item.value)
                  )
                );
              }}
            >
              <View style={styles.container}>
                <Checkbox status={tempSelected.some(v => v.value === option.value) ? 'checked' : 'unchecked'} />
                <Text style={styles.label} variant="titleMedium">
                  {option.label}
                </Text>
              </View>
            </TouchableRipple>
          ))}
        </ScrollView>
      </SafeAreaView>
    ),
    title: textInputProps.label,
    actions: hideDialog => (
      <View style={styles.actions}>
        <Button onPress={() => hideDialog()}>Cancel</Button>
        <Button
          onPress={() => {
            onChangeValue(tempSelected);
            hideDialog();
          }}
        >
          Ok
        </Button>
      </View>
    ),
  });

  function handleOpenSelectModal() {
    showDialog();
  }

  return (
    <>
      {component}
      <TextInput
        {...textInputProps}
        inputMode={'none'}
        value={value.map(v => v.label).join(', ')}
        onPressIn={() => handleOpenSelectModal()}
        onPressOut={() => handleOpenSelectModal()}
      />
    </>
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
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
});
