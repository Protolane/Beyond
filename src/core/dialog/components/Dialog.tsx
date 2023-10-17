import { Dialog, Portal } from 'react-native-paper';
import React from 'react';
import type { Props as PaperDialogProps } from 'react-native-paper/src/components/Dialog/Dialog';
import { StyleSheet } from 'react-native';

export interface IUIDialogOptions {
  title?: React.ReactNode;
  content?: React.ReactNode | ((hideDialog: () => void) => React.ReactNode);
  actions?: (hideDialog: () => void) => React.ReactNode;
  dialogProps?: Partial<PaperDialogProps>;
}

interface IUIDialogProps extends IUIDialogOptions {
  visible: boolean;
  hideDialog: () => void;
  onDismiss?: () => void;
}

export function UIDialog({ visible, hideDialog, actions, content, title, dialogProps, onDismiss }: IUIDialogProps) {
  const handleDismiss = React.useCallback(() => {
    onDismiss?.();
    hideDialog();
  }, [onDismiss, hideDialog]);

  return (
    <Portal>
      <Dialog {...dialogProps} visible={visible} onDismiss={handleDismiss}>
        {title && <Dialog.Title>{title}</Dialog.Title>}
        {content && (
          <Dialog.Content style={styles.modal}>
            {typeof content == 'function' ? content?.(hideDialog) : content}
          </Dialog.Content>
        )}
        {actions && <Dialog.Actions>{actions(hideDialog)}</Dialog.Actions>}
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    maxHeight: '80%',
  },
});
