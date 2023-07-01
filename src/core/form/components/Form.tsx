import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import ScrollView = Animated.ScrollView;

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
  noButtons?: boolean;
}

export interface FormRef {
  renderSubmitButton(): React.ReactNode;
  renderCancelButton(): React.ReactNode;
}

export const Form = React.forwardRef<FormRef, FormProps>(function Form(
  { schema, defaultValues, onSubmit, onCancel, noButtons },
  ref
) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const handleSubmitForm: Parameters<ReturnType<typeof useForm>['handleSubmit']>[0] = data => onSubmit?.(data);
  const handleCancel = () => onCancel?.();

  function renderCancelButton() {
    return <Button onPress={handleCancel}>Cancel</Button>;
  }

  function renderSubmitButton() {
    return <Button onPress={handleSubmit(handleSubmitForm)}>Submit</Button>;
  }

  React.useImperativeHandle(ref, () => ({
    renderSubmitButton,
    renderCancelButton,
  }));

  function renderField(entry: FormSchemaEntry, value, onChange, onBlur) {
    switch (entry.type) {
      case FieldTypes.Text:
        return (
          <TextInput
            {...entry.props}
            label={entry.label}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            scrollEnabled
          />
        );
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
    <SafeAreaView>
      <ScrollView>
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
        </View>
      </ScrollView>

      {!noButtons && (
        <View style={style.buttons}>
          {renderCancelButton()}
          {renderSubmitButton()}
        </View>
      )}
    </SafeAreaView>
  );
});

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
