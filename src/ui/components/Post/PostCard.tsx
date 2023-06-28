import { ActivityIndicator, Badge, Card, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { PostName } from './PostName';
import { PostContentPreview } from './PostContentPreview';
import { PostImage } from './PostImage';
import { PostTag } from './PostTag';
import { PostActions } from './PostActions';
import { usePost } from '../../../api/lemmy';
import { getImagePostURL, getLinkPostURL, usePostType } from '../../hooks/usePostType';
import { A } from '@expo/html-elements';

export interface PostCardProps {
  postId: number;
}

export function PostCard({ postId }: PostCardProps) {
  const { colors } = useTheme();
  const { data: postResponse, mutate } = usePost(postId);
  const post = postResponse?.post_view;
  const postType = usePostType(post);

  const url = getLinkPostURL(post);
  const image = getImagePostURL(post);

  if (!post)
    return (
      <Card mode={'outlined'}>
        <ActivityIndicator />
      </Card>
    );

  return (
    <TouchableRipple>
      <Card>
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
          {!image && <PostContentPreview postId={post.post.id} />}
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
          <PostActions postId={post.post.id} />
        </Card.Actions>
      </Card>
    </TouchableRipple>
  );
}

export const styles = StyleSheet.create({
  tags: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: -8,
    marginBottom: 12,
  },
});
