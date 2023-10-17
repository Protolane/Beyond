import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../../ui/NavigationList';
import { Animated, SafeAreaView, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import ScrollView = Animated.ScrollView;

export function SettingsScreen({ navigation }: DrawerScreenProps<NavigationList, 'Settings'>) {
  return (
    <SafeAreaView>
      <ScrollView>
        <List.Item title={'Post Filters'} onPress={() => navigation.navigate('PostFilterSettingsScreen')} />
      </ScrollView>
    </SafeAreaView>
  );
}
