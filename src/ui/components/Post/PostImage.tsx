import React from 'react';
import { Image, View } from 'react-native';
import type { PostCardProps } from './PostCard';
import { ActivityIndicator, Text } from 'react-native-paper';
import { getImagePostURL } from '../../hooks/usePostType';

export interface ImageSize {
  width: number;
  height: number;
  proportion: number;
}

export const imagesMap = new Map<string, ImageSize | null>();

function useImageSize(uri?: string) {
  if (!uri) return { data: undefined };
  return { data: imagesMap.get(uri) };
}

export function PostImage({ postView, inView }: PostCardProps & { inView?: boolean }) {
  const url = getImagePostURL(postView);
  const { data } = useImageSize(url);

  if (!data) return <ActivityIndicator />;

  if (inView === false)
    return (
      <View
        style={{
          width: '100%',
          height: data.proportion,
        }}
      />
    );

  return (
    <Image
      source={{
        uri: url,
      }}
      style={{
        width: '100%',
        height: data.proportion,
      }}
    />
  );
}
