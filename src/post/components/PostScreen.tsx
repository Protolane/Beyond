import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../../ui/NavigationList';
import { PostView } from '../../ui/components/Post/PostView';

export function PostScreen({ route }: DrawerScreenProps<NavigationList, 'Post'>) {
  return <PostView postId={route.params.postId} />;
}
