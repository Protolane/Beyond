import type { APP_NAME } from '../core/consts';
import type { PostCardProps } from './components/Post/PostCard';
import type { PostsScreenProps } from '../post/components/PostsScreen';

export type NavigationList = {
  [APP_NAME]: undefined;
  Settings: undefined;
  Login: undefined;
  Post: PostCardProps;
  Community: PostsScreenProps;
  Debug: undefined;
};
