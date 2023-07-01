import { useDialog } from '../../core/dialog/hooks/useDialog';
import React from 'react';
import { CommentEditor } from '../components/Comment/CommentEditor';
import type { Comment, Post } from 'lemmy-js-client';

export function useCommentEditorDialog(post?: Post, parentComment?: Comment, editingComment?: Comment) {
  const { showDialog, hideDialog, component } = useDialog({
    content: hideDialog => (
      <>
        {post && (
          <CommentEditor
            postId={post.id}
            parentId={parentComment?.id}
            editingId={editingComment?.id}
            hideDialog={hideDialog}
          />
        )}
      </>
    ),
  });

  return {
    showDialog,
    hideDialog,
    component,
  };
}
