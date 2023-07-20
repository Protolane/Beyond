import React from 'react';
import { PostsScreen } from '../../post/components/PostsScreen';
import { WithAppBackground } from '../../ui/components/WithAppBackground';

export function HomeScreen() {
  return (
    <WithAppBackground>
      <PostsScreen />
    </WithAppBackground>
  );
}
