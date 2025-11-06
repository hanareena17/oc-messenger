import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Message, Attachment } from '../types/chat';
import { messagesByConversation } from '../data/messages';
import MessageBubble from '../components/MessageBubble';
import { parseEmojiShorthand } from '../utils/emoji';
import { formatTimeDivider, shouldShowDivider } from '../utils/time';
import { usersById } from '../data/users';
import EmojiPanel from '../components/EmojiPanel';
import MorePanel from '../components/MorePanel';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  conversationId: string;
  title: string;
  onBack?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: (userId: string) => void;
};

export default function ChatRoomScreen({ conversationId, title, onBack, onOpenSettings, onOpenProfile }: Props) {
  const colors = useThemeColors();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => (messagesByConversation[conversationId] ?? []).slice());
  const [actionTarget, setActionTarget] = useState<Message | null>(null);

  const invertedData = useMemo(() => [...messages].sort((a, b) => b.createdAt - a.createdAt), [messages]);
  const otherUserId = useMemo(() => {
    const firstOther = messages.find((m) => m.senderId !== 'me');
    return firstOther?.senderId ?? 'me';
  }, [messages]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: 'tmp_' + Date.now(),
      conversationId,
      senderId: 'me',
      text: parseEmojiShorthand(trimmed),
      createdAt: Date.now(),
      read: true,
      status: 'sending',
    };
    setMessages((prev) => [
      ...prev,
      newMsg,
    ]);
    setInput('');
    setShowEmoji(false);
    setShowMore(false);
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'sent' } : m)));
    }, 800);
  }, [conversationId, input]);

  const retrySend = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'sending' } : m)));
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'sent' } : m)));
    }, 600);
  }, []);

  const onLongPressMessage = useCallback((message: Message) => {
    setActionTarget(message);
  }, []);

  const copyMessage = useCallback(() => {
    setActionTarget(null);
  }, []);
  const deleteMessage = useCallback(() => {
    if (!actionTarget) return;
    setMessages((prev) => prev.filter((m) => m.id !== actionTarget.id));
    setActionTarget(null);
  }, [actionTarget]);
  const recallMessage = useCallback(() => {
    if (!actionTarget) return;
    setMessages((prev) => prev.filter((m) => m.id !== actionTarget.id));
    setActionTarget(null);
  }, [actionTarget]);

  const loadMoreHistory = useCallback(() => {
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const sendMessageWithAttachment = useCallback((attachments: Attachment[]) => {
    const newMsg: Message = {
      id: 'tmp_' + Date.now(),
      conversationId,
      senderId: 'me',
      createdAt: Date.now(),
      read: true,
      status: 'sending',
      attachments,
    };
    setMessages((prev) => [...prev, newMsg]);
    setShowMore(false);
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'sent' } : m)));
    }, 800);
  }, [conversationId]);

  const handleCamera = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const attachment: Attachment = {
          id: 'att_' + Date.now(),
          type: 'image',
          uri: asset.uri,
        };
        sendMessageWithAttachment([attachment]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
    }
  }, [sendMessageWithAttachment]);

  const handleGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const attachment: Attachment = {
          id: 'att_' + Date.now(),
          type: 'image',
          uri: asset.uri,
        };
        sendMessageWithAttachment([attachment]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
    }
  }, [sendMessageWithAttachment]);

  const handleFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const attachment: Attachment = {
          id: 'att_' + Date.now(),
          type: 'file',
          uri: asset.uri,
          name: asset.name,
          sizeBytes: asset.size,
        };
        sendMessageWithAttachment([attachment]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file');
    }
  }, [sendMessageWithAttachment]);

  const handleLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required to share location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const attachment: Attachment = {
        id: 'att_' + Date.now(),
        type: 'location',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      sendMessageWithAttachment([attachment]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  }, [sendMessageWithAttachment]);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const prev = invertedData[index + 1]; 
    const divider = shouldShowDivider(prev?.createdAt, item.createdAt);
    const isMe = item.senderId === 'me';
    const avatarChar = usersById[item.senderId]?.name?.charAt(0) ?? '?';
    return (
      <View>
        {divider && (
          <View style={styles.timeDivider}> 
            <Text style={styles.timeDividerText}>{formatTimeDivider(item.createdAt)}</Text>
          </View>
        )}
        <MessageBubble
          message={item}
          isMe={isMe}
          onLongPress={onLongPressMessage}
          showAvatar
          avatarChar={avatarChar}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <View style={[styles.navBar, { borderBottomColor: colors.border }] }>
        <Pressable style={styles.navBack} onPress={onBack}>
          <Text style={styles.navBackText}>‹</Text>
        </Pressable>
        <Pressable onPress={() => onOpenProfile?.(otherUserId)}>
          <Text style={[styles.navTitle, { color: colors.primaryText }]} numberOfLines={1}>{title}</Text>
        </Pressable>
        <Pressable style={styles.navMore} onPress={onOpenSettings}>
          <Text style={styles.navMoreText}>⋯</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <FlatList
          inverted
          data={invertedData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={loadMoreHistory}
          onEndReachedThreshold={0.2}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
        />

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Pressable onPress={() => { setShowEmoji((v) => !v); setShowMore(false); }} style={styles.iconBtn}>
            <Text style={styles.iconTxt}>😊</Text>
          </Pressable>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.otherBubble, color: colors.primaryText }]}
            placeholder="Message"
            placeholderTextColor={colors.secondaryText}
            multiline
            value={input}
            onChangeText={setInput}
          />
          <Pressable onPress={() => { setShowMore((v) => !v); setShowEmoji(false); }} style={styles.iconBtn}>
            <Text style={styles.iconTxt}>＋</Text>
          </Pressable>
          <Pressable onPress={sendMessage} style={[styles.sendBtn, { backgroundColor: colors.accent }]}>
            <Text style={styles.sendTxt}>Send</Text>
          </Pressable>
        </View>

        {showEmoji && (
          <EmojiPanel
            onSelect={(e) => setInput((prev) => prev + e)}
            onDelete={() => setInput((prev) => prev.slice(0, -1))}
            onSend={() => sendMessage()}
          />
        )}
        {showMore && (
          <MorePanel
            onPress={(key) => {
              switch (key) {
                case 'camera':
                  handleCamera();
                  break;
                case 'gallery':
                  handleGallery();
                  break;
                case 'file':
                  handleFile();
                  break;
                case 'location':
                  handleLocation();
                  break;
                case 'card':
                  // TODO: Business card
                  break;
              }
            }}
          />
        )}
      </KeyboardAvoidingView>

      <Modal transparent visible={!!actionTarget} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setActionTarget(null)}>
          <View style={styles.modalSheet}>
            <Pressable style={styles.sheetBtn} onPress={copyMessage}><Text style={styles.sheetTxt}>Copy</Text></Pressable>
            <Pressable style={styles.sheetBtn} onPress={deleteMessage}><Text style={styles.sheetTxt}>Delete</Text></Pressable>
            <Pressable style={styles.sheetBtn} onPress={recallMessage}><Text style={styles.sheetTxt}>Recall</Text></Pressable>
            <Pressable style={styles.sheetBtn} onPress={() => setActionTarget(null)}><Text style={styles.sheetTxt}>Cancel</Text></Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  navBack: { width: 40, height: 32, alignItems: 'center', justifyContent: 'center' },
  navBackText: { fontSize: 22, color: '#212529' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#212529' },
  navMore: { width: 40, height: 32, alignItems: 'center', justifyContent: 'center' },
  navMoreText: { fontSize: 22, color: '#212529' },
  flex: { flex: 1 },
  listContent: { paddingVertical: 8 },
  timeDivider: { alignItems: 'center', paddingVertical: 8 },
  timeDividerText: { fontSize: 12, color: '#868E96', backgroundColor: '#F1F3F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    backgroundColor: '#FFFFFF',
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  iconTxt: { fontSize: 20 },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#212529',
  },
  sendBtn: { marginLeft: 6, backgroundColor: '#1C7ED6', height: 36, borderRadius: 18, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  sendTxt: { color: '#FFFFFF', fontWeight: '700' },
  panel: { borderTopWidth: 1, borderTopColor: '#F1F3F5', backgroundColor: '#FFFFFF', padding: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', paddingBottom: 24 },
  sheetBtn: { height: 48, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  sheetTxt: { fontSize: 16, color: '#212529' },
});


