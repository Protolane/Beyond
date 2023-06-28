import { StyleSheet, View } from 'react-native';
import React from 'react';

export interface LevelsProps {
  level: number;
}

// TODO: create a list of string colors and use them to color the levels up to 8 levels
const levelColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'purple'];

export function Levels({ level, children }: React.PropsWithChildren<LevelsProps>) {
  return (
    <View style={styles.container}>
      {level > 0 && <View style={{ ...styles.levelBar, backgroundColor: levelColors[level - 1] }} />}
      <View style={styles.children}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  children: {
    flex: 1,
  },
  levelContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  levelBar: {
    marginLeft: 4,
    width: 3,
    height: '100%',
  },
});
