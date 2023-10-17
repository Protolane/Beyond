import React, { Fragment } from 'react';
import type { DeepPartial, UseFormHandleSubmit } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Checkbox, HelperText, Switch, Text, TextInput } from 'react-native-paper';
import ScrollView = Animated.ScrollView;
import type { SelectInputProps } from '../../../ui/components/SelectInput';
import { SelectInput } from '../../../ui/components/SelectInput';

// TODO: fix typing

export enum FieldTypes {
  Text = 'text',
  Number = 'number',
  Select = 'select',
  Checkbox = 'checkbox',
  Switch = 'switch',
}

type FieldTypeMapping = {
  [FieldTypes.Text]: string;
  [FieldTypes.Number]: number;
  [FieldTypes.Select]: string[];
  [FieldTypes.Checkbox]: boolean;
  [FieldTypes.Switch]: boolean;
};

type FieldType<T extends FieldTypes> = FieldTypeMapping[T];

export interface FormSchemaEntry<Field extends FieldTypes, FieldName> {
  type: Field;
  name: keyof FieldName;
  label: string;
  rules?: object;
  defaultValue?: FieldType<Field>;
  props?: object;
}

interface FormProps<T extends Record<string, FieldTypeMapping[FieldTypes]>> {
  schema: FormSchemaEntry<FieldTypes, keyof T>[];
  defaultValues?: DeepPartial<T>;
  onSubmit?(values: T): void;
  onCancel?(): void;
  noButtons?: boolean;
  isBusy?: boolean;
}

export interface FormRef {
  renderSubmitButton(): React.ReactNode;
  renderCancelButton(): React.ReactNode;
  handleSubmit: UseFormHandleSubmit<object>;
}

export interface ErrorType {
  type: string;
  message: string;
  ref: {
    name: string;
  };
}

function _Form<T extends object>(
  { schema, defaultValues, onSubmit, onCancel, noButtons, isBusy }: FormProps<T>,
  ref: React.Ref<FormRef>
) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    defaultValues,
  });

  const handleSubmitForm: Parameters<ReturnType<typeof useForm>['handleSubmit']>[0] = data => onSubmit?.(data as T);
  const handleCancel = () => onCancel?.();

  function renderCancelButton() {
    return (
      <Button disabled={isBusy} onPress={handleCancel}>
        Cancel
      </Button>
    );
  }

  function renderSubmitButton() {
    return (
      <Button disabled={isBusy} onPress={handleSubmit(handleSubmitForm)}>
        Submit
      </Button>
    );
  }

  React.useImperativeHandle(ref, () => ({
    renderSubmitButton,
    renderCancelButton,
    handleSubmit: handleSubmit,
  }));

  function renderError(error: ErrorType) {
    if (error.type === 'required') return <HelperText type="error">This field required</HelperText>;
  }

  function renderField(entry: FormSchemaEntry, value, onChange, onBlur) {
    switch (entry.type) {
      case FieldTypes.Text:
        return (
          <TextInput
            {...entry.props}
            disabled={isBusy}
            label={entry.label}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            scrollEnabled
          />
        );
      case FieldTypes.Number:
        return (
          <TextInput
            {...entry.props}
            keyboardType={'numeric'}
            inputMode={'numeric'}
            disabled={isBusy}
            label={entry.label}
            onBlur={onBlur}
            onChangeText={text => onChange(parseFloat(text))}
            value={value?.toString()}
            scrollEnabled
          />
        );
      case FieldTypes.Checkbox:
        return (
          <Checkbox.Item
            {...entry.props}
            disabled={isBusy}
            label={entry.label}
            status={value ? 'checked' : 'unchecked'}
            onPress={() => onChange(!value)}
          />
        );
      case FieldTypes.Switch:
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 14,
              marginRight: 6,
            }}
          >
            <Text>{entry.label}</Text>
            <Switch {...entry.props} disabled={isBusy} value={value} onValueChange={() => onChange(!value)} />
          </View>
        );

      case FieldTypes.Select:
        return (
          <SelectInput<string>
            {...(entry.props as SelectInputProps<string>)}
            disabled={isBusy}
            label={entry.label}
            onBlur={onBlur}
            onChangeValue={onChange}
            value={value}
            scrollEnabled
          />
        );
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={style.container}>
          {schema.map(entry => {
            return (
              <Fragment key={entry.name}>
                <Controller
                  control={control}
                  rules={entry.rules}
                  defaultValue={entry.defaultValue}
                  name={entry.name}
                  render={({ field: { onChange, onBlur, value } }) => renderField(entry, value, onChange, onBlur)}
                />
                {errors[entry.name] && <HelperText type="error">{renderError(errors[entry.name])}</HelperText>}
              </Fragment>
            );
          })}
        </View>
      </ScrollView>

      {!noButtons && (
        <View style={style.buttons}>
          {renderCancelButton()}
          {isBusy && <ActivityIndicator />}
          {renderSubmitButton()}
        </View>
      )}
    </SafeAreaView>
  );
}

export const Form = React.forwardRef<FormRef, FormProps>(_Form) as typeof _Form;

const style = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
