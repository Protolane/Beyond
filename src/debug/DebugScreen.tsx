import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../ui/NavigationList';
import { Animated, SafeAreaView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import ScrollView = Animated.ScrollView;
import { SWRCache } from '../SWRCache';
import { useRefreshCommentsCache, useRefreshPostsCache } from '../api/lemmy';

function stringifyMap(map) {
  let str = '';
  for (const [key, value] of map.entries()) {
    str += `Key: ${key}\n`;
  }
  return str;
}

export function printSWRCache() {
  console.log(stringifyMap(SWRCache));
}

export function DebugScreen({ navigation }: DrawerScreenProps<NavigationList, 'Debug'>) {
  function gotoLemmyTestCommunity() {
    navigation.navigate('Community', {
      communityName: 'test@lemmy.ml',
    });
  }

  const { refresh: refreshComments } = useRefreshCommentsCache();
  const { refresh: refreshPosts } = useRefreshPostsCache();

  return (
    <View>
      <View>
        <Text>Test community</Text>
        <Button onPress={gotoLemmyTestCommunity}>Go to Lemmy test community</Button>
      </View>
      <Text>SWR Cache</Text>
      <Button onPress={() => printSWRCache()}>Print to console</Button>
      <Button onPress={() => refreshPosts()}>Clear Posts Cache</Button>
      <Button onPress={() => refreshComments()}>Clear Comments Cache</Button>
    </View>
  );
}
