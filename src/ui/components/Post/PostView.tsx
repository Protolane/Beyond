import type { PostCardProps } from './PostCard';
import { usePost } from '../../../api/lemmy';
import { getImagePostURL, getLinkPostURL, usePostType } from '../../hooks/usePostType';
import { ActivityIndicator, Badge, Card, Text } from 'react-native-paper';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { PostTag } from './PostTag';
import { PostName } from './PostName';
import { A } from '@expo/html-elements';
import { styles } from './PostCard';
import { PostImage } from './PostImage';
import { PostActions } from './PostActions';
import { PostContent } from './PostCardContent';
import { PostComments } from '../Comment/PostComments';
import { IOScrollView } from 'react-native-intersection-observer';

export function PostView({ postId }: PostCardProps) {
  const { data: postResponse, mutate } = usePost(postId);
  const post = postResponse?.post_view;
  const postType = usePostType(post);

  const url = getLinkPostURL(post);
  const image = getImagePostURL(post);

  if (!post) return <ActivityIndicator />;

  console.log(postResponse?.community_view.community);

  return (
    <SafeAreaView>
      <IOScrollView>
        <View>
          <Card.Content>
            <PostTag postId={post.post.id} />
            <PostName postId={post.post.id} />

            <View style={styles.tags}>
              <Badge>{postType}</Badge>
              {post.post.nsfw && <Badge>NSFW</Badge>}
              {post.post.locked && <Badge>Locked</Badge>}
              {image?.toLowerCase().endsWith('.gif') && <Badge>GIF</Badge>}
            </View>
            {postType === 'link' && (
              <View style={styles.tags}>
                <A href={url}>{url}</A>
              </View>
            )}
            {!image && <PostContent postId={post.post.id} />}
          </Card.Content>

          {image && <PostImage postId={post.post.id} />}

          <Card.Actions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <PostActions postId={post.post.id} writeComment />
          </Card.Actions>
        </View>
        <PostComments postId={postId} />
      </IOScrollView>
    </SafeAreaView>
  );
}
