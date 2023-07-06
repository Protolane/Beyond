import 'react-native-gesture-handler';

import { PaperProvider, useTheme } from 'react-native-paper';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from './src/home/components/HomeScreen';
import type { NavigationList } from './src/ui/NavigationList';
import { LoginScreen } from './src/login/components/LoginScreen';
import { CustomNavigationBar } from './src/ui/components/AppLayout/CustomNavigationBar';
import { NavigationDrawer } from './src/ui/components/AppLayout/NavigationDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SWRConfig } from 'swr';
import { APP_NAME } from './src/core/consts';
import { PostScreen } from './src/post/components/PostScreen';
import { RootSiblingParent } from 'react-native-root-siblings';
import { DebugScreen } from './src/debug/DebugScreen';
import { CommunityScreen } from './src/Community/components/CommunityScreen';
import { SWRCache } from './src/SWRCache';

const Drawer = createDrawerNavigator<NavigationList>();

export default function App() {
  const theme = useTheme();

  return (
    <SWRConfig
      value={{
        provider: () => SWRCache,
      }}
    >
      <RootSiblingParent>
        <PaperProvider>
          <NavigationContainer
            theme={{
              ...theme,
              colors: {
                ...theme.colors,
                background: theme.colors.background,
                card: theme.colors.background,
                text: theme.colors.onSurface,
                border: theme.colors.secondary,
                notification: theme.colors.backdrop,
              },
            }}
          >
            <Drawer.Navigator
              initialRouteName={APP_NAME}
              drawerContent={NavigationDrawer}
              screenOptions={{
                header: props => <CustomNavigationBar {...props} />,
              }}
            >
              <Drawer.Screen name={APP_NAME} component={HomeScreen} />
              <Drawer.Screen name="Login" component={LoginScreen} />
              <Drawer.Screen name="Post" component={PostScreen} />
              <Drawer.Screen name="Community" component={CommunityScreen} />
              <Drawer.Screen name="Debug" component={DebugScreen} />
            </Drawer.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </RootSiblingParent>
    </SWRConfig>
  );
}
