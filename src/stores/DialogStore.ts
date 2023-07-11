import { create } from 'zustand';
import type { IUIDialogOptions } from '../core/dialog/components/Dialog';
import type React from 'react';
import type { Props as PaperDialogProps } from 'react-native-paper/src/components/Dialog/Dialog';

interface DialogStore extends IUIDialogOptions {
  setTitle: (title?: React.ReactNode) => void;
  setContent: (content?: React.ReactNode | ((hideDialog: () => void) => React.ReactNode)) => void;
  setActions: (actions?: (hideDialog: () => void) => React.ReactNode) => void;
  setDialogProps: (dialogProps?: Partial<PaperDialogProps>) => void;
  visible: boolean;
  onDismiss?: () => void;
  setOnDismiss: (onDismiss?: () => void) => void;
  hideDialog: () => void;
  showDialog: () => void;
}

export const useDialogStore = create<DialogStore>(set => ({
  title: undefined,
  content: undefined,
  actions: undefined,
  dialogProps: undefined,
  visible: false,
  setTitle: title => set({ title }),
  setContent: content => set({ content }),
  setActions: actions => set({ actions }),
  setOnDismiss: onDismiss => set({ onDismiss }),
  setDialogProps: dialogProps => set({ dialogProps }),
  hideDialog: () => set({ visible: false }),
  showDialog: () => set({ visible: true }),
}));
