import type { APP_NAME } from '../core/consts';
import type { PostCardProps } from './components/Post/PostCard';

export type NavigationList = {
  [APP_NAME]: undefined;
  Settings: undefined;
  Login: undefined;
  Post: PostCardProps;
};
