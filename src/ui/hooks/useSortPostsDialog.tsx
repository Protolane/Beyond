import { usePostsStore } from '../../stores/PostsStore';
import { useDialog } from '../../core/dialog/hooks/useDialog';
import { SortTypes, SortTypesIcons, SortTypesLabels } from '../../core/consts';
import { Text } from 'react-native-paper';
import React from 'react';
import { SortOption } from '../components/Post/SortOption';

export function useSortPostsDialog() {
  const { sort, setSort } = usePostsStore(state => ({
    sort: state.sort,
    setSort: state.setSort,
  }));

  const { showDialog, hideDialog, component } = useDialog({
    content: (
      <>
        {SortTypes.map(sortType => (
          <SortOption
            key={sortType}
            icon={SortTypesIcons[sortType]}
            label={SortTypesLabels[sortType]}
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
