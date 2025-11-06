import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../theme/ThemeProvider';
import { usersById } from '../data/users';
import Avatar from './Avatar';
import { SIZES } from '../theme/constants';

type StoryItem = {
  userId: string | null;
  name: string;
  avatarUrl?: string;
  isAddStory?: boolean;
};

const STORIES: StoryItem[] = [
  { userId: null, name: 'Add story', isAddStory: true },
  { userId: 'user_2', name: 'Alex Chen' },
  { userId: 'user_4', name: 'Mom' },
  { userId: 'user_5', name: 'Jordan' },
];

type Props = {
  onPressStory?: (userId: string) => void;
  onAddStory?: () => void;
};

export default function StoriesRow({ onPressStory, onAddStory }: Props) {
  const colors = useThemeColors();

  const renderStory = ({ item }: { item: StoryItem }) => {
    if (item.isAddStory) {
      return (
        <Pressable style={styles.storyItem} onPress={onAddStory}>
          <View style={[styles.addStoryContainer, { borderColor: colors.secondaryText }]}>
            <Feather name="plus" size={28} color={colors.primaryText} />
          </View>
          <Text style={[styles.name, { color: colors.primaryText }]} numberOfLines={1}>
            {item.name}
          </Text>
        </Pressable>
      );
    }

    const user = item.userId ? usersById[item.userId] : null;

    return (
      <Pressable
        style={styles.storyItem}
        onPress={() => item.userId && onPressStory?.(item.userId)}
      >
        <Avatar
          size={SIZES.avatar.large}
          uri={item.avatarUrl}
          name={user?.name ?? item.name}
          showBorder
          borderColor={colors.border}
        />
        <Text style={[styles.name, { color: colors.primaryText }]} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <FlatList
        horizontal
        data={STORIES}
        keyExtractor={(item, index) => item.userId ?? `add-story-${index}`}
        renderItem={renderStory}
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  content: {
    paddingHorizontal: 12,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  addStoryContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});

