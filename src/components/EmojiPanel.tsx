import React, { useMemo } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  onSelect: (emoji: string) => void;
  onDelete: () => void;
  onSend: () => void;
};

const EMOJI_SET = [
  '😀','😄','😁','😆','😂','🤣','😊','🙂','😉','😍','😘','😜','🤗','🤔','🤨','😐','😑','😶','🙄','😏','😴','🤤','😪','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','😎','🤑','😇','🤓','😭','😢','😠','😤','😡','👍','👎','👏','🙌','🙏','👌','🤝','💪','❤️','💔','✨','🔥','⭐','🎉','🎈','🥳','🍕','🍔','🍟','🍣','🍰','☕','🍺','⚽','🏀','🏈','🎮','🎧'
];

const NUM_ROWS = 6;
const NUM_COLS = 7;
const PER_PAGE = NUM_ROWS * NUM_COLS;

export default function EmojiPanel({ onSelect, onDelete, onSend }: Props) {
  const colors = useThemeColors();
  const pages = useMemo(() => {
    const arr = [...EMOJI_SET];
    const result: string[][] = [];
    while (arr.length > 0) {
      const page = arr.splice(0, PER_PAGE - 1); 
      page.push('⌫');
      result.push(page);
    }
    return result;
  }, []);

  const { width } = Dimensions.get('window');
  const cellSize = Math.floor((width - 24 - (NUM_COLS - 1) * 8) / NUM_COLS); 

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={pages}
        keyExtractor={(_, i) => 'p' + i}
        renderItem={({ item: page }) => (
          <View style={[styles.page, { width }]}> 
            {Array.from({ length: NUM_ROWS }).map((_, r) => (
              <View key={r} style={styles.row}>
                {Array.from({ length: NUM_COLS }).map((_, c) => {
                  const idx = r * NUM_COLS + c;
                  const ch = page[idx];
                  return (
                    <Pressable
                      key={c}
                      style={[styles.cell, { width: cellSize, height: cellSize }]}
                      onPress={() => (ch === '⌫' ? onDelete() : onSelect(ch))}
                    >
                      <Text style={styles.emoji}>{ch}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      />
      <View style={styles.bottomBar}>
        <Pressable onPress={onSend} style={[styles.sendBtn, { backgroundColor: colors.accent }]}><Text style={styles.sendTxt}>Send</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F3F5' },
  page: { paddingHorizontal: 12, paddingTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cell: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', borderRadius: 8 },
  emoji: { fontSize: 22 },
  bottomBar: { alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8 },
  sendBtn: { backgroundColor: '#1C7ED6', borderRadius: 16, height: 32, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  sendTxt: { color: '#FFFFFF', fontWeight: '700' },
});


