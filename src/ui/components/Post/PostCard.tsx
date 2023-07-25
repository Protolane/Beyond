import { Badge, Card, TouchableRipple, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { PostName } from './PostName';
import { PostContentPreview } from './PostContentPreview';
import { PostImage } from './PostImage';
import { PostTag } from './PostTag';
import { PostActions } from './PostActions';
import { getImagePostURL, getLinkPostURL, usePostType } from '../../hooks/usePostType';
import { A } from '@expo/html-elements';
import type { PostView } from 'lemmy-js-client';

export interface PostCardProps {
  postView: PostView;
}

export function PostCard({ postView, inView }: PostCardProps & { inView?: boolean }) {
  const postType = usePostType(postView);
  const url = getLinkPostURL(postView);
  const image = getImagePostURL(postView);
  const { colors } = useTheme();

  return (
    <TouchableRipple>
      <Card>
        <Card.Content>
          <PostTag postView={postView} />
          <PostName postView={postView} />

          <View style={styles.tags}>
            <Badge>{postType}</Badge>
            {postView.post.nsfw && <Badge>NSFW</Badge>}
            {postView.post.locked && <Badge>Locked</Badge>}
            {image?.toLowerCase().endsWith('.gif') && <Badge>GIF</Badge>}
          </View>
          {postType === 'link' && (
            <View style={styles.tags}>
              <A style={{ color: colors.tertiary }} href={url}>
                {url}
              </A>
            </View>
          )}
          {!image && <PostContentPreview postView={postView} />}
        </Card.Content>

        {image && <PostImage postView={postView} inView={inView} />}

        <Card.Actions
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <PostActions postView={postView} />
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
