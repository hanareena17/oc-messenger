import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  onHome?: () => void;
  onNewChat?: () => void;
  onProfile?: () => void;
};

export default function BottomNavBar({ onHome, onNewChat, onProfile }: Props) {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]} edges={['bottom']}>
      <View style={styles.navBar}>
        <Pressable style={styles.iconBtn} onPress={onHome}>
          <Feather name="home" size={24} color={colors.primaryText} />
        </Pressable>

        <Pressable style={[styles.newChatBtn, { backgroundColor: colors.primaryText }]} onPress={onNewChat}>
          <Feather name="plus" size={18} color={colors.background} />
          <Text style={[styles.newChatText, { color: colors.background }]}>New Chat</Text>
        </Pressable>

        <Pressable style={styles.iconBtn} onPress={onProfile}>
          <Feather name="user" size={24} color={colors.primaryText} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 140,
    justifyContent: 'center',
  },
  newChatText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

