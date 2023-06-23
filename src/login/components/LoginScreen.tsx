import { StyleSheet, View } from 'react-native';
import type { NavigationList } from '../../ui/NavigationList';
import type { Login } from './LoginForm';
import { LoginForm } from './LoginForm';
import { LemmyHttp } from 'lemmy-js-client';
import type { Account } from '../../stores/AccountsStore';
import { useAccountsStore } from '../../stores/AccountsStore';
import type { DrawerScreenProps } from '@react-navigation/drawer';

export function LoginScreen({ navigation }: DrawerScreenProps<NavigationList, 'Login'>) {
  const { setSelectedAccount, addAccount } = useAccountsStore(state => ({
    setSelectedAccount: state.setSelectedAccount,
    addAccount: state.addAccount,
  }));

  async function handleLogin(values: Login) {
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

    navigation.navigate('Home');
  }

  return (
    <View style={style.container}>
      <LoginForm onCancel={() => navigation.canGoBack() && navigation.goBack()} onSubmit={handleLogin} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
