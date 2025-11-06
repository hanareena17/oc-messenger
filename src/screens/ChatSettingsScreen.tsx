import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  onBack?: () => void;
  conversationTitle: string;
  conversationId: string;
  onClearChat?: () => void;
  onReport?: () => void;
};

export default function ChatSettingsScreen({ onBack, conversationTitle, conversationId, onClearChat, onReport }: Props) {
  const colors = useThemeColors();
  const [dnd, setDnd] = useState(false);

  useEffect(() => {
    const key = `dnd:${conversationId}`;
    AsyncStorage.getItem(key).then((v) => {
      if (v === 'true') setDnd(true);
    }).catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    const key = `dnd:${conversationId}`;
    AsyncStorage.setItem(key, dnd ? 'true' : 'false').catch(() => {});
  }, [dnd, conversationId]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}> 
        <Pressable style={styles.navBack} onPress={onBack}><Text style={styles.navIcon}>‹</Text></Pressable>
        <Text style={[styles.navTitle, { color: colors.primaryText }]} numberOfLines={1}>{conversationTitle}</Text>
        <View style={styles.navBack} />
      </View>

      <View style={styles.section}>
        <View style={styles.row}> 
          <Text style={[styles.rowText, { color: colors.primaryText }]}>Do-not-disturb</Text>
          <Switch value={dnd} onValueChange={setDnd} />
        </View>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.row} onPress={() => onClearChat?.() ?? Alert.alert('Clear chat')}> 
          <Text style={[styles.rowText, styles.destructive]}>Clear chat</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => onReport?.() ?? Alert.alert('Reported')}> 
          <Text style={[styles.rowText, styles.destructive]}>Report</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  navBack: { width: 40, height: 32, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 22 },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700' },
  section: { marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 48 },
  rowText: { fontSize: 16 },
  destructive: { color: '#FA5252', fontWeight: '600' },
});


