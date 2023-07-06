import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import type { PostCardProps } from './PostCard';
import { ActivityIndicator } from 'react-native-paper';
import useSWR from 'swr';
import { getImagePostURL } from '../../hooks/usePostType';

interface ImageSize {
  width: number;
  height: number;
  proportion: number;
}

function useImageSize(uri?: string) {
  return useSWR<ImageSize>(uri ? `image-size-${uri}` : null, () => {
    return new Promise((resolve, reject) => {
      if (!uri) return;

      Image.getSize(
        uri,
        (width, height) => {
          const screenWidth = Dimensions.get('window').width;
          const proportion = (height / width) * screenWidth;
          resolve({ width, height, proportion });
        },
        error => {
          reject(error);
        }
      );
    });
  });
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
