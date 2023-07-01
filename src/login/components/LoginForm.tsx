import React from 'react';
import { FieldTypes, Form } from '../../core/form/components/Form';

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
          rules: { required: false },
        },
        {
          type: FieldTypes.Text,
          name: 'password',
          label: 'Password',
          rules: { required: false },
          props: { secureTextEntry: true },
        },
      ]}
    />
  );
}
