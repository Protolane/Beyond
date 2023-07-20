import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const darkBackground = '../../../assets/seamless-dark.png';
const lightBackground = '../../../assets/seamless-bright.png';

export function WithAppBackground({ children }: React.PropsWithChildren<{}>) {
  const { dark } = useTheme();

  return (
    <ImageBackground style={style.container} source={dark ? require(darkBackground) : require(lightBackground)}>
      {children}
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
