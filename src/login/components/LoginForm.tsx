import React from 'react';
import type { FormSchemaEntry } from '../../core/form/components/Form';
import { FieldTypes, Form } from '../../core/form/components/Form';

export interface Login {
  instance: string;
  usernameOrEmail: string;
  password: string;
  totpToken?: string;
}

interface LoginFormProps {
  onSubmit?(values: Login): void;
  onCancel?(): void;
  defaultValues?: Login;
  has2FA?: boolean;
  isBusy?: boolean;
}

export function LoginForm(props: LoginFormProps) {
  const schema: FormSchemaEntry[] = [
    {
      type: FieldTypes.Text,
      name: 'instance',
      label: 'Instance',
      rules: { required: true },
    },
    {
      type: FieldTypes.Text,
      name: 'usernameOrEmail',
      label: 'Username or Email',
      rules: { required: false },
    },
    {
      type: FieldTypes.Text,
      name: 'password',
      label: 'Password',
      rules: { required: false },
      props: { secureTextEntry: true },
    },
  ];

  if (props.has2FA) {
    schema.push({
      type: FieldTypes.Text,
      name: 'totpToken',
      label: '2FA Token',
      rules: { required: true },
    });
  }

  return <Form {...props} schema={schema} />;
}
