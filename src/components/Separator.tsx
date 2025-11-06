import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  style?: object;
  marginLeft?: number;
};

export default function Separator({ style, marginLeft }: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: colors.border, marginLeft },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
  },
});

