import React from 'react';
import { useDialogStore } from '../stores/DialogStore';
import { Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import type { FormRef, FormSchemaEntry } from '../core/form/components/Form';
import { FieldTypes, Form } from '../core/form/components/Form';
import { useAccountsStore } from '../stores/AccountsStore';

interface DialogOptions<T = boolean> {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  okButtonText?: string;
  cancelButtonText?: string;
  onOk: () => T;
  onCancel: () => T;
}

function closeAndClearDialog() {
  useDialogStore.getState().hideDialog();
  useDialogStore.getState().setActions(undefined);
  useDialogStore.getState().setContent(undefined);
  useDialogStore.getState().setTitle(undefined);
  useDialogStore.getState().setOnDismiss(undefined);
}

export async function openDialog<T = boolean>(options: DialogOptions<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    function handleOk() {
      if (options.onOk) resolve(options.onOk());
      else reject('No onOk handler provided');
      closeAndClearDialog();
    }

    function handleCancel() {
      if (options.onCancel) resolve(options.onCancel());
      else reject('No onCancel handler provided');
      closeAndClearDialog();
    }

    useDialogStore
      .getState()
      .setTitle(typeof options.title === 'string' ? <Text>{options.title}</Text> : options.title);
    useDialogStore
      .getState()
      .setContent(typeof options.content === 'string' ? <Text>{options.content}</Text> : options.content);
    useDialogStore.getState().setOnDismiss(handleCancel);
    useDialogStore.getState().setActions(_ => (
      <>
        <Button onPress={handleCancel}>{options.cancelButtonText ?? 'Cancel'}</Button>
        <Button onPress={handleOk}>{options.okButtonText ?? 'Ok'}</Button>
      </>
    ));

    useDialogStore.getState().showDialog();
  });
}

interface FormDialogOptions<T = boolean> extends Omit<DialogOptions<T>, 'onOk' | 'onCancel'> {
  schema: FormSchemaEntry[];
}

export async function formDialog<T = boolean>(options: FormDialogOptions<T>) {
  const formRef = React.createRef<FormRef>();

  return openDialog<Promise<T>>({
    ...options,
    content: (
      <View>
        {typeof options.content === 'string' ? <Text>{options.content}</Text> : <View>{options.content}</View>}

        <Form ref={formRef} noButtons schema={options.schema} />
      </View>
    ),
    onOk: () => {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        formRef.current?.handleSubmit?.(data => resolve(data), reject)();
      });
    },
    onCancel: () => {
      return Promise.reject('User cancelled');
    },
  });
}

export function sessionExpiredForm() {
  return formDialog<{
    password: string;
  }>({
    title: 'Session expired',
    content: <SessionExpiredFormContent />,
    schema: [
      {
        type: FieldTypes.Text,
        name: 'password',
        label: 'Password',
        rules: [{ required: true, message: 'Please input your password!' }],
      },
    ],
  });
}

function SessionExpiredFormContent() {
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  // const { data: personDetails } = usePersonDetails(selectedAccount);

  return (
    <View>
      <Text>Your session has expired. Please enter you password to log in again.</Text>
      <Text>
        @{selectedAccount.username}@{selectedAccount.instance}
      </Text>
    </View>
  );
}
