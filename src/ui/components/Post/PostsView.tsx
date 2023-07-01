import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { PostCard } from './PostCard';
import React from 'react';
import type { PostView } from 'lemmy-js-client';
import { ActivityIndicator } from 'react-native-paper';
import { InView, IOScrollView } from 'react-native-intersection-observer';

export interface PostsViewProps {
  posts: Array<PostView>;
  onLoadMore?: () => void;
}

const loadMoreFrom = 2;

export function PostsView({ posts, onLoadMore }: PostsViewProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(false);
  }, [posts]);

  return (
    <ImageBackground source={require('../../../../assets/seamless-bright.png')}>
      <SafeAreaView>
        <IOScrollView showsVerticalScrollIndicator={false}>
          {posts.map((post, i) => (
            <InView
              key={post.post.id}
              style={style.container}
              onChange={inView => {
                if (inView && i >= posts.length - 1 - loadMoreFrom && onLoadMore) {
                  onLoadMore();
                  setIsLoading(true);
                }
              }}
            >
              <PostCard postId={post.post.id} />
            </InView>
          ))}
          {isLoading && (
            <View style={style.container}>
              <ActivityIndicator />
            </View>
          )}
        </IOScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
});
