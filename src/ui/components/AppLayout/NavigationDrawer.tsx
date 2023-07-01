import { Avatar, Drawer, Text, useTheme } from 'react-native-paper';
import { Animated, Image, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import type { Account } from '../../../stores/AccountsStore';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { usePersonDetails } from '../../../api/lemmy';
import ScrollView = Animated.ScrollView;

const userCardHeight = 180;

export function NavigationDrawer({ navigation }: DrawerContentComponentProps) {
  const { accounts, selectedAccount, setSelectedAccount, removeAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
    setSelectedAccount: state.setSelectedAccount,
    accounts: state.accounts,
    removeAccount: state.removeAccount,
  }));

  const { data: personDetails } = usePersonDetails(selectedAccount);

  function handleNavigateLogin() {
    navigation.navigate('Login');
  }

  function handleNavigateDebug() {
    navigation.navigate('Debug');
  }

  function handleSelectAccount(account: Account) {
    setSelectedAccount(account);
    navigation.closeDrawer();
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flex: 1, height: userCardHeight }}>
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
                <Avatar.Image size={64} source={{ uri: personDetails?.person_view?.person.avatar }} />
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
                  : selectedAccount.instance}
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
          </Drawer.Section>
          <Drawer.Section title={'Preferences'} showDivider={false}>
            {/*<Drawer.Item label="Dark theme" />*/}
            {/*<Drawer.Item label="Enable NSFW" />*/}
            <Drawer.Item label="Settings" icon="cog" />
            <Drawer.Item label="Debug" icon="bug-outline" onPress={handleNavigateDebug} />
          </Drawer.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userCardContainer: {
    padding: 24,
  },
});
