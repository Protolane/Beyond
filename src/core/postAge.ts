import moment from 'moment';
import type { PostView } from 'lemmy-js-client';

const lemmyFormat = `YYYY-MM-DDTHH:mm:ss.SSSSSSZ`;

export function getPostAge(post: PostView) {
  return moment(post.counts.published, lemmyFormat).fromNow();
}
