import { StyleSheet, View } from 'react-native';
import type { NavigationList } from '../../ui/NavigationList';
import type { Login } from './LoginForm';
import { LoginForm } from './LoginForm';
import { LemmyHttp } from 'lemmy-js-client';
import type { Account } from '../../stores/AccountsStore';
import { useAccountsStore } from '../../stores/AccountsStore';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { APP_NAME } from '../../core/consts';
import Toast from 'react-native-root-toast';
import { Text } from 'react-native-paper';

export function LoginScreen({ navigation }: DrawerScreenProps<NavigationList, 'Login'>) {
  const { setSelectedAccount, addAccount, accounts } = useAccountsStore(state => ({
    setSelectedAccount: state.setSelectedAccount,
    addAccount: state.addAccount,
    accounts: state.accounts,
  }));

  async function handleLogin(values: Login) {
    if (accounts.find(a => a.instance === values.instance && a.username === values.usernameOrEmail)) {
      Toast.show('Account already exists');
    } else {
      if (!values.usernameOrEmail || !values.password) {
        const account: Account = {
          instance: values.instance,
        };

        addAccount(account);
        setSelectedAccount(account);

        return void navigation.navigate(APP_NAME);
      }

      const client: LemmyHttp = new LemmyHttp(`https://${values.instance}`);
      const response = await client.login({
        username_or_email: values.usernameOrEmail,
        password: values.password,
      });

      if (!response?.jwt) return;

      const account: Account = {
        instance: values.instance,
        username: values.usernameOrEmail,
        jwt: response.jwt,
      };

      addAccount(account);
      setSelectedAccount(account);
    }

    navigation.navigate(APP_NAME);
  }

  return (
    <View style={style.container}>
      <Text>To browse an instance anonymously, do not enter a username and password, only the instance address.</Text>
      <LoginForm onCancel={() => navigation.canGoBack() && navigation.goBack()} onSubmit={handleLogin} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
    margin: 32,
  },
});
