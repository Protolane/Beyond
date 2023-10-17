const gifExtensions = ['gif'] as const;

const acceptedImageExtensions = [
  'xbm',
  'tif',
  'jfif',
  'ico',
  'tiff',
  'svg',
  'webp',
  'svgz',
  'jpg',
  'jpeg',
  'png',
  'bmp',
  'pjp',
  'apng',
  'pjpeg',
  'avif',
  ...gifExtensions,
] as const;

const acceptedVideoExtensions = [
  'ogm',
  'wmv',
  'mpg',
  'webm',
  'ogv',
  'mov',
  'asx',
  'mpeg',
  'mp4',
  'm4v',
  'avi',
] as const;

const acceptedExtensions = [...acceptedImageExtensions, ...acceptedVideoExtensions] as const;

export type PostType = 'text' | 'link' | 'image' | 'video' | 'gif' | undefined;

import type { PostView } from 'lemmy-js-client';

export function getImagePostURL(post?: PostView) {
  return post?.post.thumbnail_url;
}

export function getLinkPostURL(post?: PostView) {
  return post?.post.url;
}

function filterByExtension(extensions: readonly string[], post?: PostView) {
  return extensions.some(ext => {
    return !!(post?.post.thumbnail_url?.toLowerCase().endsWith(ext) || post?.post.url?.toLowerCase().endsWith(ext));
  });
}

export const isImagePost = (post?: PostView) => {
  return filterByExtension(acceptedImageExtensions, post);
};

export const isVideoPost = (post?: PostView) => {
  return filterByExtension(acceptedVideoExtensions, post);
};

export const isGifPost = (post?: PostView) => {
  return filterByExtension(gifExtensions, post);
};

export function isLinkPost(post?: PostView) {
  return post?.post.url && !isImagePost(post) && !isVideoPost(post);
}

export function isTextPost(post?: PostView) {
  return !post?.post.url && !isImagePost(post) && !isVideoPost(post) && !!post?.post.body;
}

export function getPostType(post?: PostView) {
  const postType: PostType[] = [];

  if (isTextPost(post)) {
    postType.push('text');
  }

  if (isLinkPost(post)) {
    postType.push('link');
  }

  if (isImagePost(post)) {
    postType.push('image');
  }

  if (isVideoPost(post)) {
    postType.push('video');
  }

  if (isGifPost(post)) {
    postType.push('gif');
  }

  return postType;
}

export function usePostType(post?: PostView): PostType[] {
  return getPostType(post);
}
