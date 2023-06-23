import React from 'react';
import { Form, FieldTypes } from '../../core/form/components/Form';

export interface Login {
  instance: string;
  usernameOrEmail: string;
  password: string;
}

interface LoginFormProps {
  onSubmit?(values: Login): void;
  onCancel?(): void;
  defaultValues?: Login;
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Form
      {...props}
      schema={[
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
          rules: { required: true },
        },
        {
          type: FieldTypes.Text,
          name: 'password',
          label: 'Password',
          rules: { required: true },
          props: { secureTextEntry: true },
        },
      ]}
    />
  );
}
