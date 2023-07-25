import React, { Fragment } from 'react';
import type { UseFormHandleSubmit } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
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

export const Form = React.forwardRef<FormRef, FormProps>(function Form(
  { schema, defaultValues, onSubmit, onCancel, noButtons, isBusy },
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
