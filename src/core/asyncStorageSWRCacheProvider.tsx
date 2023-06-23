import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

export function asyncStorageSWRCacheProvider() {
  const map = new Map<string, any>();

  AsyncStorage.getItem('app-cache').then(value => {
    if (!value) return;

    (JSON.parse(value) as [string, any][]).forEach(([key, value]) => {
      map.set(key, value);
    });
  });

  AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      const appCache = JSON.stringify(Array.from(map.entries()));
      AsyncStorage.setItem('app-cache', appCache);
    }
  });

  return map;
}
