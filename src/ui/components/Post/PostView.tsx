import type { PostCardProps } from './PostCard';
import { getImagePostURL, getLinkPostURL, usePostType } from '../../hooks/usePostType';
import { Badge, Card, useTheme } from 'react-native-paper';
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

export function PostView({ postView }: PostCardProps) {
  const postType = usePostType(postView);
  const url = getLinkPostURL(postView);
  const image = getImagePostURL(postView);
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <IOScrollView>
        <View>
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
                <A href={url}>{url}</A>
              </View>
            )}
            {!image && <PostContent postView={postView} />}
          </Card.Content>

          {image && <PostImage postView={postView} />}

          <Card.Actions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <PostActions postView={postView} writeComment />
          </Card.Actions>
        </View>
        <PostComments postView={postView} />
      </IOScrollView>
    </SafeAreaView>
  );
}
