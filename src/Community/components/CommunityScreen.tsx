import { PostsScreen } from '../../post/components/PostsScreen';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../../ui/NavigationList';

export function CommunityScreen({ route }: DrawerScreenProps<NavigationList, 'Community'>) {
  return <PostsScreen communityName={route.params.communityName} />;
}
