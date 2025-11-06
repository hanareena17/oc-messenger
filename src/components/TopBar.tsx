import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcons?: React.ReactNode[];
  onLeftPress?: () => void;
};

export default function TopBar({ title, leftIcon, rightIcons, onLeftPress }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {leftIcon ? (
        <Pressable style={styles.iconBtn} onPress={onLeftPress}>
          {leftIcon}
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={[styles.title, { color: colors.primaryText }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        {rightIcons?.map((icon, idx) => (
          <View key={idx} style={styles.iconBtn}>
            {icon}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

