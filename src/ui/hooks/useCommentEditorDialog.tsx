import { useDialog } from '../../core/dialog/hooks/useDialog';
import React from 'react';
import { CommentEditor } from '../components/Comment/CommentEditor';

export function useCommentEditorDialog(handleSubmit?: (values: { comment: string }) => Promise<any>) {
  const { showDialog, hideDialog, component } = useDialog({
    content: hideDialog => <>{<CommentEditor hideDialog={hideDialog} handleSubmit={handleSubmit} />}</>,
  });

  return {
    showDialog,
    hideDialog,
    component,
  };
}
