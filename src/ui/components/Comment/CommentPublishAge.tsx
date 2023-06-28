import { PublishedAge } from '../../PublishedAge';

export interface CommentPublishedAge {
  published: string;
}

export function CommentPublishedAge({ published }: CommentPublishedAge) {
  // TODO abstract formats and post vs comment format settings
  return <PublishedAge published={published} />;
}
