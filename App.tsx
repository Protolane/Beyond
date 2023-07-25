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
import { useDialogStore } from './src/stores/DialogStore';
import { UIDialog } from './src/core/dialog/components/Dialog';

const Drawer = createDrawerNavigator<NavigationList>();

export default function App() {
  return (
    <SWRConfig
      value={{
        provider: () => SWRCache,
      }}
    >
      <RootSiblingParent>
        <PaperProvider>
          <AppWithTheme />
        </PaperProvider>
      </RootSiblingParent>
    </SWRConfig>
  );
}

function AppWithTheme() {
  const theme = useTheme();
  const dialog = useDialogStore();

  return (
    <>
      <UIDialog
        hideDialog={dialog.hideDialog}
        onDismiss={dialog.onDismiss}
        visible={dialog.visible}
        dialogProps={dialog.dialogProps}
        content={dialog.content}
        actions={dialog.actions}
        title={dialog.title}
      />
      <NavigationContainer
        theme={{
          dark: theme.dark,
          colors: {
            border: theme.colors.background,
            background: theme.colors.background,
            card: theme.colors.background,
            notification: theme.colors.outline,
            primary: theme.colors.primary,
            text: theme.colors.onBackground,
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
          <Drawer.Screen
            options={{
              unmountOnBlur: true,
            }}
            name="Login"
            component={LoginScreen}
          />
          <Drawer.Screen
            options={{
              unmountOnBlur: true,
            }}
            name="Post"
            component={PostScreen}
          />
          <Drawer.Screen name="Community" component={CommunityScreen} />
          <Drawer.Screen name="Debug" component={DebugScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
