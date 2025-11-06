import React from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../theme/ThemeProvider';

type Item = { key: string; label: string; icon: string };

const ITEMS: Item[] = [
  { key: 'camera', label: 'Camera', icon: 'camera' },
  { key: 'gallery', label: 'Gallery', icon: 'image' },
  { key: 'file', label: 'File', icon: 'file' },
  { key: 'location', label: 'Location', icon: 'map-pin' },
  { key: 'card', label: 'Business Card', icon: 'credit-card' },
];

type Props = {
  onPress: (key: string) => void;
};

export default function MorePanel({ onPress }: Props) {
  const colors = useThemeColors();
  const { width } = Dimensions.get('window');
  const numCols = 4;
  const sidePadding = 12;
  const gap = 12;
  const cellWidth = Math.floor((width - sidePadding * 2 - gap * (numCols - 1)) / numCols);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={[styles.grid, { paddingHorizontal: sidePadding }]}> 
        {ITEMS.map((it) => (
          <Pressable key={it.key} onPress={() => onPress(it.key)} style={[styles.item, { width: cellWidth }]}> 
            <View style={[styles.icon, { backgroundColor: colors.otherBubble }]}>
              <Feather name={it.icon as any} size={28} color={colors.primaryText} />
            </View>
            <Text style={[styles.label, { color: colors.primaryText }]}>{it.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F3F5', paddingTop: 12, paddingBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { alignItems: 'center', marginBottom: 12 },
  icon: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#F1F3F5', alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 6, fontSize: 12, color: '#212529' },
});


