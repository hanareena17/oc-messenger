import React, { useMemo, useState, useCallback } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Conversation } from '../types/chat';
import { conversationsSeed } from '../data/chats';
import ChatListItem from '../components/ChatListItem';
import StoriesRow from '../components/StoriesRow';
import IconButton from '../components/IconButton';
import Separator from '../components/Separator';
import { useThemeColors, useTheme } from '../theme/ThemeProvider';
import { SIZES } from '../theme/constants';

type Props = {
  onOpenChat?: (opts: { id: string; title: string }) => void;
};

export default function ChatListScreen({ onOpenChat }: Props) {
  const colors = useThemeColors();
  const { themeName, toggleTheme } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>(conversationsSeed);
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? conversations.filter(
          (c) =>
            c.nickname.toLowerCase().includes(q) || (c.lastMessage?.text ?? '').toLowerCase().includes(q)
        )
      : conversations.slice();
   
    filtered.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
    return filtered;
  }, [conversations, query]);

  const onPressItem = useCallback((id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) onOpenChat?.({ id, title: conv.nickname });
  }, [conversations, onOpenChat]);

  const onLongPressItem = useCallback((id: string) => {
    setActiveItemId((prev) => (prev === id ? null : id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned, updatedAt: Date.now() } : c))
    );
    setActiveItemId(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveItemId(null);
  }, []);

  const renderItem = ({ item }: { item: Conversation }) => (
    <View>
      <ChatListItem conversation={item} onPress={onPressItem} onLongPress={onLongPressItem} />
      {activeItemId === item.id && (
        <View style={styles.actionsRow}>
          <Pressable onPress={() => togglePin(item.id)} style={styles.actionButton}>
            <Text style={styles.actionText}>{item.pinned ? 'Unpin' : 'Pin'}</Text>
          </Pressable>
          <Pressable onPress={() => deleteConversation(item.id)} style={[styles.actionButton, styles.deleteButton]}>
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      )}
      <Separator marginLeft={76} />
    </View>
  );

  const emptyList = (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon} />
      <Text style={styles.emptyText}>No messages yet</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, { color: colors.primaryText }]}>Messages</Text>
        <View style={styles.headerRight}>
          <IconButton
            name={themeName === 'dark' ? 'sun' : 'moon'}
            size={18}
            onPress={toggleTheme}
            style={styles.iconBtnSpacing}
          />
          <IconButton name="search" size={18} onPress={() => setShowSearch((v) => !v)} />
        </View>
      </View>

      <StoriesRow />

      {showSearch && (
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search"
            placeholderTextColor={colors.secondaryText}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { backgroundColor: colors.otherBubble, color: colors.primaryText }]}
            autoFocus
          />
        </View>
      )}

      <FlatList
        data={filteredSorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={emptyList}
        contentContainerStyle={filteredSorted.length === 0 ? styles.listEmptyContent : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  title: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: '#212529',
  },
  headerRight: { flexDirection: 'row', gap: SIZES.spacing.sm },
  iconBtnSpacing: {
    marginRight: SIZES.spacing.sm,
  },
  searchBox: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
  },
  searchInput: {
    height: 40,
    borderRadius: SIZES.borderRadius.sm,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: SIZES.spacing.md,
    color: '#212529',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
    gap: SIZES.spacing.sm,
  },
  actionButton: {
    paddingHorizontal: SIZES.spacing.md,
    height: SIZES.button.small,
    borderRadius: SIZES.borderRadius.full,
    backgroundColor: '#1C7ED6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#FA5252',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F3F5',
  },
  emptyText: {
    color: '#868E96',
    fontSize: 14,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});


