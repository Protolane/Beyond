import { PublishedAge } from '../../PublishedAge';

export interface PostPublishedAgeProps {
  published: string;
}

export function PostPublishedAge({ published }: PostPublishedAgeProps) {
  // TODO abstract formats and post vs comment format settings
  return <PublishedAge published={published} />;
}
