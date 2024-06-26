﻿import { Avatar, Drawer, Surface, Text, useTheme } from 'react-native-paper';
import { Animated, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import type { Account } from '../../../stores/AccountsStore';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { usePersonDetails } from '../../../api/lemmy';
import ScrollView = Animated.ScrollView;
import { useLogoutDialog } from '../../hooks/useLogoutDialog';
import Icon from 'react-native-paper/src/components/Icon';
import * as Linking from 'expo-linking';
import { useFiltersStore } from '../../../stores/FiltersStore';
import React from 'react';

const userCardHeight = 180;
const version = require('../../../../app.json').expo.version;

export function NavigationDrawer({ navigation }: DrawerContentComponentProps) {
  const [isDebugMenuVisible, setIsDebugMenuVisible] = React.useState<number>(0);

  function tryEnableDebug() {
    setIsDebugMenuVisible(isDebugMenuVisible + 1);
  }

  const { accounts, selectedAccount, setSelectedAccount, removeAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
    setSelectedAccount: state.setSelectedAccount,
    accounts: state.accounts,
    removeAccount: state.removeAccount,
  }));

  const { nsfw, setNsfw } = useFiltersStore(state => ({
    nsfw: state.nsfw,
    setNsfw: state.setNsfw,
  }));

  const { data: personDetails } = usePersonDetails(selectedAccount);

  const { dark } = useTheme();

  function handleNavigateLogin() {
    navigation.navigate('Login');
  }

  function handleNavigateDebug() {
    navigation.navigate('Debug');
  }

  function handleNavigateSettings() {
    navigation.navigate('Settings');
  }

  function handleNavigateSupport() {
    Linking.openURL('https://patreon.com/beyond_for_lemmy');
  }

  function handleSelectAccount(account: Account) {
    setSelectedAccount(account);
    navigation.closeDrawer();
  }

  const { showDialog, component } = useLogoutDialog();

  return (
    <>
      {component}
      <Surface elevation={0}>
        <SafeAreaView>
          <ScrollView>
            <View
              style={{
                flex: 1,
                height: userCardHeight,
                backgroundColor: personDetails?.person_view?.person.banner
                  ? undefined
                  : dark
                  ? 'darkgrey'
                  : 'lightblue',
              }}
            >
              <ImageBackground
                source={{ uri: personDetails?.person_view?.person.banner }}
                resizeMode={'cover'}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    ...styles.userCardContainer,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    {selectedAccount?.username ? (
                      <Avatar.Image size={64} source={{ uri: personDetails?.person_view?.person.avatar }} />
                    ) : (
                      <Icon size={64} source={'account-circle-outline'} />
                    )}
                  </View>
                  <Text
                    variant="titleSmall"
                    style={{
                      textShadowColor: 'white',
                      textShadowOffset: { width: -1, height: 1 },
                      textShadowRadius: 10,
                    }}
                  >
                    {selectedAccount.username
                      ? `@${selectedAccount.username}@${selectedAccount.instance}`
                      : `Anonymous (${selectedAccount.instance})`}
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <View>
              <Drawer.Section title={'Account'} showDivider={false}>
                {accounts.map(account => (
                  <Drawer.Item
                    key={account.username ? `@${account.username}@${account.instance}` : account.instance}
                    label={account.username ? `@${account.username}@${account.instance}` : account.instance}
                    onPress={() => handleSelectAccount(account)}
                    icon={
                      selectedAccount?.username === account.username && selectedAccount?.instance === account.instance
                        ? 'account-circle'
                        : 'account-circle-outline'
                    }
                  />
                ))}
                <Drawer.Item label="Add account" onPress={handleNavigateLogin} icon="account-plus-outline" />
                <Drawer.Item label={'Logout'} icon={'logout'} onPress={() => showDialog()} />
              </Drawer.Section>
              <Drawer.Section title={'Preferences'} showDivider={false}>
                {/*<Drawer.Item label="Dark theme" />*/}
                <Drawer.Item
                  label={(nsfw ? 'Disable' : 'Enable') + ' NSFW'}
                  onPress={() => setNsfw(!nsfw)}
                  icon={!nsfw ? 'circle-edit-outline' : 'circle-box'}
                />
                <Drawer.Item label="Settings" icon="cog" onPress={handleNavigateSettings} />
                <Drawer.Item label="Support" icon="patreon" onPress={handleNavigateSupport} />
                {isDebugMenuVisible > 5 && (
                  <Drawer.Item label="Debug" icon="bug-outline" onPress={handleNavigateDebug} />
                )}
                <Drawer.Item label={`Beyond v${version}`} onPress={() => tryEnableDebug()} />
              </Drawer.Section>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  userCardContainer: {
    padding: 24,
  },
});
