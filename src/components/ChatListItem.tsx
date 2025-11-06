import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Conversation } from '../types/chat';
import { parseEmojiShorthand } from '../utils/emoji';
import { useThemeColors } from '../theme/ThemeProvider';
import Avatar from './Avatar';
import { formatUnreadCount } from '../utils/format';
import { SIZES } from '../theme/constants';

type Props = {
  conversation: Conversation;
  onPress?: (id: string) => void;
  onLongPress?: (id: string) => void;
};

export function ChatListItem({ conversation, onPress, onLongPress }: Props) {
  const colors = useThemeColors();
  const preview = conversation.lastMessage ? parseEmojiShorthand(conversation.lastMessage.text ?? '') : '';
  const time = conversation.updatedAt;
  const timeLabel = new Date(time).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Pressable
      onPress={() => onPress?.(conversation.id)}
      onLongPress={() => onLongPress?.(conversation.id)}
      style={({ pressed }) => [styles.card, { backgroundColor: colors.surface }, pressed && styles.cardPressed]}
    >
      <View style={styles.avatarWrapper}>
        <Avatar size={SIZES.avatar.medium} uri={conversation.avatarUrl} name={conversation.nickname} />
        {conversation.pinned && <View style={styles.pinMarker} />}
      </View>

      <View style={styles.center}>
        <Text style={[styles.nickname, { color: colors.primaryText }]} numberOfLines={1}>
          {conversation.nickname}
        </Text>
        <Text style={[styles.preview, { color: colors.secondaryText }]} numberOfLines={1}>
          {preview}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.time, { color: colors.secondaryText }]}>{timeLabel}</Text>
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{formatUnreadCount(conversation.unreadCount)}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    height: SIZES.card.height,
    backgroundColor: '#FFFFFF',
  },
  cardPressed: {
    opacity: 0.85,
  },
  avatarWrapper: {
    marginRight: SIZES.spacing.md,
    position: 'relative',
  },
  pinMarker: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1C7ED6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  nickname: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    color: '#212529',
  },
  preview: {
    marginTop: SIZES.spacing.xs,
    fontSize: SIZES.fontSize.md,
    color: '#495057',
  },
  right: {
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.md,
  },
  time: {
    fontSize: SIZES.fontSize.sm,
    color: '#868E96',
    marginBottom: 6,
  },
  unreadBadge: {
    alignSelf: 'flex-end',
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FA5252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontSize.sm,
    fontWeight: '700',
  },
});

export default ChatListItem;


