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
import React from 'react';

enum LoginErrors {
  missingTOTPToken = 'missing_totp_token',
  incorrectTOTPToken = 'incorrect_totp_token',
  wrongUsernameOrPassword = 'incorrect_login',
  noInstanceOrDisconnected = 'Network request failed',
}

export function LoginScreen({ navigation }: DrawerScreenProps<NavigationList, 'Login'>) {
  const { setSelectedAccount, addAccount, accounts } = useAccountsStore(state => ({
    setSelectedAccount: state.setSelectedAccount,
    addAccount: state.addAccount,
    accounts: state.accounts,
  }));

  const [has2FA, setHas2FA] = React.useState<boolean>(false);
  const [isBusy, setIsBusy] = React.useState<boolean>(false);

  async function handleLogin(values: Login) {
    if (accounts.find(a => a.instance === values.instance && a.username === values.usernameOrEmail)) {
      Toast.show('Account already exists');
    } else {
      setIsBusy(true);

      // anonymous instance login
      if (!values.usernameOrEmail && !values.password) {
        try {
          await new LemmyHttp(`https://${values.instance}`).login();
        } catch (error) {
          setIsBusy(false);
          if (error.message === LoginErrors.noInstanceOrDisconnected) {
            return void Toast.show('Error logging in: ' + error.message);
          }
        }

        const account: Account = {
          instance: values.instance,
        };

        addAccount(account);
        setSelectedAccount(account);

        return void navigation.navigate(APP_NAME);
      }

      try {
        if (!values.usernameOrEmail) throw new Error('Username or Email is required');
        if (!values.password) throw new Error('Password is required');

        const client: LemmyHttp = new LemmyHttp(`https://${values.instance}`);
        const response = await client.login({
          username_or_email: values.usernameOrEmail,
          password: values.password,
          totp_2fa_token: values.totpToken,
        });

        if (response.error) {
          throw new Error(response.error);
        }

        if (!response?.jwt) throw new Error('no_jwt_token');

        const account: Account = {
          instance: values.instance,
          username: values.usernameOrEmail,
          jwt: response.jwt,
        };

        addAccount(account);
        setSelectedAccount(account);

        navigation.navigate(APP_NAME);
      } catch (error) {
        setIsBusy(false);

        if (error.message === LoginErrors.missingTOTPToken) {
          setHas2FA(true);
          return void Toast.show('Please enter your 2FA token');
        }

        if (error.message === LoginErrors.incorrectTOTPToken) {
          setHas2FA(true);
          return void Toast.show('Your 2FA token is incorrect, please try again with a new token');
        }

        if (error.message === LoginErrors.wrongUsernameOrPassword || error === LoginErrors.noInstanceOrDisconnected) {
          return void Toast.show('Error logging in: ' + error.message);
        }

        return void Toast.show('Error: ' + error.message);
      }
    }
  }

  return (
    <View style={style.container}>
      <Text>To browse an instance anonymously, do not enter a username and password, only the instance address.</Text>
      <LoginForm
        has2FA={has2FA}
        onCancel={() => navigation.canGoBack() && navigation.goBack()}
        onSubmit={handleLogin}
        isBusy={isBusy}
      />
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
