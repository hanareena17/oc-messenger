import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  name: string;
  size?: number;
  onPress?: () => void;
  style?: ViewStyle;
  backgroundColor?: string;
  color?: string;
};

export default function IconButton({ name, size = 24, onPress, style, backgroundColor, color }: Props) {
  const colors = useThemeColors();
  const bg = backgroundColor ?? colors.otherBubble;
  const clr = color ?? colors.primaryText;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: bg },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Feather name={name as any} size={size} color={clr} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

