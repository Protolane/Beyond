import { useDialog } from '../../core/dialog/hooks/useDialog';
import React from 'react';
import { DialogItem } from '../../core/dialog/components/DialogItem';
import Toast from 'react-native-root-toast';
import * as Clipboard from 'expo-clipboard';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import { useLemmyClient } from '../../api/lemmy';

export function useCommentMoreDialog(comment: CommentView) {
  const { baseUrl } = useLemmyClient();
  const handlePressShare = () => {
    Clipboard.setStringAsync(`${baseUrl}/comment/${comment.comment.id}`).then(() => {
      Toast.show('URL copied to clipboard.', {
        duration: Toast.durations.LONG,
      });
    });

    hideMainDialog();
  };

  const handlePressCopy = () => {
    // hideMainDialog();
    // showCopyDialog();

    Clipboard.setStringAsync(comment.comment.content).then(() => {
      Toast.show('Comment copied to clipboard.', {
        duration: Toast.durations.LONG,
      });
    });

    hideMainDialog();
  };

  const handlePressReport = () => {
    console.log('TODO share');
    hideMainDialog();
  };

  const handlePressCopyRawText = () => {
    console.log('TODO share');
    hideCopyDialog();
  };

  const handlePressCopyMarkdown = () => {
    console.log('TODO share');
    hideCopyDialog();
  };

  const handlePressAllText = () => {
    console.log('TODO share');
    hideCopyDialog();
  };

  const handlePressAllMarkdown = () => {
    console.log('TODO share');
    hideCopyDialog();
  };

  const {
    showDialog: showMainDialog,
    hideDialog: hideMainDialog,
    component: mainDialog,
  } = useDialog({
    content: (
      <>
        <DialogItem label={'Share'} icon={'share-variant-outline'} onPress={handlePressShare} />
        <DialogItem label={'Copy'} icon={'content-copy'} onPress={handlePressCopy} />
        {/*<DialogItem label={'Report'} icon={'alert-octagon-outline'} onPress={handlePressReport} />*/}
      </>
    ),
  });

  const {
    showDialog: showCopyDialog,
    hideDialog: hideCopyDialog,
    component: copyDialog,
  } = useDialog({
    content: (
      <>
        <DialogItem label={'Copy Raw Text'} onPress={handlePressCopyRawText} />
        <DialogItem label={'Copy Markdown'} onPress={handlePressCopyMarkdown} />
        <DialogItem label={'Copy All Raw Text'} onPress={handlePressAllText} />
        <DialogItem label={'Copy All Markdown'} onPress={handlePressAllMarkdown} />
      </>
    ),
  });

  const component = React.useMemo(
    () => (
      <>
        {mainDialog}
        {copyDialog}
      </>
    ),
    [copyDialog, mainDialog]
  );

  return {
    showDialog: showMainDialog,
    component,
  };
}
