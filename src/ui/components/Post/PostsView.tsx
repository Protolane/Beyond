import type { ViewProps } from 'react-native';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { PostCard } from './PostCard';
import React from 'react';
import type { PostView } from 'lemmy-js-client';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { InView, IOScrollView } from 'react-native-intersection-observer';

export interface PostsViewProps {
  posts: Array<PostView>;
  onLoadMore?: () => void;
}

const loadMoreFrom = 2;
const darkBackground = '../../../../assets/seamless-dark.png';
const lightBackground = '../../../../assets/seamless-bright.png';

export function PostsView({ posts, onLoadMore }: PostsViewProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { dark } = useTheme();

  React.useEffect(() => {
    setIsLoading(false);
  }, [posts]);

  return (
    <ImageBackground source={dark ? require(darkBackground) : require(lightBackground)}>
      <SafeAreaView>
        <IOScrollView showsVerticalScrollIndicator={false}>
          {posts.map((postView, i) => (
            <InViewHandler
              key={postView.post.id}
              style={style.container}
              onChange={inView => {
                if (inView && i >= posts.length - 1 - loadMoreFrom && onLoadMore) {
                  onLoadMore();
                  setIsLoading(true);
                }
              }}
            >
              {inView => <PostCard postView={postView} inView={inView} />}
            </InViewHandler>
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

interface InViewHandlerProps {
  children: (inView: boolean) => React.ReactNode;
  onChange?: (inView: boolean) => void;
  style?: ViewProps['style'];
}

function InViewHandler(props: InViewHandlerProps) {
  const [inView, setInView] = React.useState<boolean>(false);

  return (
    <InView
      {...props}
      onChange={inView => {
        setInView(inView);
        props?.onChange?.(inView);
      }}
    >
      {props?.children?.(inView)}
    </InView>
  );
}

const style = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
});
