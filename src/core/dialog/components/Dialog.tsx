import { Dialog, Portal } from 'react-native-paper';
import React from 'react';

export interface IUIDialogOptions {
  title?: React.ReactNode;
  content?: React.ReactNode;
  actions?: (hideDialog: () => void) => React.ReactNode;
}

interface IUIDialogProps extends IUIDialogOptions {
  visible: boolean;
  hideDialog: () => void;
}

export function UIDialog({ visible, hideDialog, actions, content, title }: IUIDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        {title && <Dialog.Title>{title}</Dialog.Title>}
        {content && <Dialog.Content>{content}</Dialog.Content>}
        {actions && <Dialog.Actions>{actions(hideDialog)}</Dialog.Actions>}
      </Dialog>
    </Portal>
  );
}
