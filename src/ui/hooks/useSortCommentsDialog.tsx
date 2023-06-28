import { useDialog } from '../../core/dialog/hooks/useDialog';
import { CommentSortTypes, CommentSortTypesIcons, CommentSortTypesLabels } from '../../core/consts';
import React from 'react';
import { SortOption } from '../components/Post/SortOption';
import { useCommentsStore } from '../../stores/CommentsStore';

export function useSortCommentsDialog() {
  const { sort, setSort } = useCommentsStore(state => ({
    sort: state.sort,
    setSort: state.setSort,
  }));

  const { showDialog, hideDialog, component } = useDialog({
    content: (
      <>
        {CommentSortTypes.map(sortType => (
          <SortOption
            key={sortType}
            icon={CommentSortTypesIcons[sortType]}
            label={CommentSortTypesLabels[sortType]}
            selected={sortType === sort}
            onPress={() => {
              setSort(sortType);
              hideDialog();
            }}
          />
        ))}
      </>
    ),
  });

  return {
    showDialog,
    sort,
    component,
  };
}
