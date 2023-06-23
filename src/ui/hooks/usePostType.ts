type PostType = 'text' | 'link' | 'image' | 'video' | undefined;

import type { PostView } from 'lemmy-js-client';

export function getImagePostURL(post?: PostView) {
  return post?.post.thumbnail_url;
}

export function getLinkPostURL(post?: PostView) {
  return post?.post.url;
}

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

export function usePostType(post?: PostView): PostType {
  const imagePostURL = getImagePostURL(post);
  const linkPostURL = getLinkPostURL(post);

  if (linkPostURL) {
    if (imageExtensions.some(ext => linkPostURL.toLowerCase().endsWith(ext))) return 'image';
    return 'link';
  }
  if (imagePostURL) return 'image';
  // if (post?.post.embedded) return 'video';
  return 'text';
}
