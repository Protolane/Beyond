import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, HelperText, Text, TextInput } from 'react-native-paper';

// TODO: fix typing

export enum FieldTypes {
  Text = 'text',
  Checkbox = 'checkbox',
}

export interface FormSchemaEntry {
  type: FieldTypes;
  name: string;
  label: string;
  rules: object;
  props?: object;
}

interface FormProps {
  schema: FormSchemaEntry[];
  defaultValues?: object;
  onSubmit?(values: object): void;
  onCancel?(): void;
}

export function Form({ schema, defaultValues, onSubmit, onCancel }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const handleSubmitForm = data => onSubmit?.(data);
  const handleCancel = () => onCancel?.();

  function renderField(entry: FormSchemaEntry, value, onChange, onBlur) {
    switch (entry.type) {
      case FieldTypes.Text:
        return <TextInput {...entry.props} label={entry.label} onBlur={onBlur} onChangeText={onChange} value={value} />;
      case FieldTypes.Checkbox:
        return (
          <Checkbox.Item
            {...entry.props}
            label={entry.label}
            status={value ? 'checked' : 'unchecked'}
            onPress={() => onChange(!value)}
          />
        );
    }
  }

  return (
    <View style={style.container}>
      {schema.map(entry => {
        return (
          <Fragment key={entry.name}>
            <Controller
              control={control}
              rules={entry.rules}
              name={entry.name}
              render={({ field: { onChange, onBlur, value } }) => renderField(entry, value, onChange, onBlur)}
            />
            {errors[entry.name] && <HelperText type="error">Error TODO</HelperText>}
          </Fragment>
        );
      })}

      <View style={style.buttons}>
        <Button onPress={handleCancel}>Cancel</Button>
        <Button onPress={handleSubmit(handleSubmitForm)}>Submit</Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
