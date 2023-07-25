import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../ui/NavigationList';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SWRCache } from '../SWRCache';
import { useRefreshCommentsCache, useRefreshPostsCache } from '../api/lemmy';
import Logger from '../logger/Logger';

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

  function testLogSubmission() {
    Logger.info('Test log submission from Logger.info');
    Logger.error('Test log submission from Logger.error');
    Logger.warn('Test log submission from Logger.warn');
    Logger.debug('Test log submission from Logger.debug');

    console.log('Test log submission from console.log');
    console.warn('Test log submission from console.warn');
    console.error('Test log submission from console.error');
    console.debug('Test log submission from console.debug');
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
      <Text>Logger</Text>
      <Button onPress={() => testLogSubmission()}>Test log submission</Button>
    </View>
  );
}
