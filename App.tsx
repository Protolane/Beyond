import 'react-native-gesture-handler';

import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
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

const Drawer = createDrawerNavigator<NavigationList>();

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
    },
  };
  return (
    <SWRConfig
    // value={{
    //   provider: asyncStorageSWRCacheProvider,
    // }}
    >
      <RootSiblingParent>
        <PaperProvider>
          <NavigationContainer>
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
            </Drawer.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </RootSiblingParent>
    </SWRConfig>
  );
}
