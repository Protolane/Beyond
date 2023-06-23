import type { IUIDialogOptions } from '../components/Dialog';
import { UIDialog } from '../components/Dialog';
import React from 'react';

export function useDialog(options: IUIDialogOptions) {
  const [visible, setVisible] = React.useState<boolean>(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const component = React.useMemo(() => <UIDialog {...options} visible={visible} hideDialog={hideDialog} />, [visible]);

  return {
    component,
    showDialog,
    hideDialog,
  };
}
