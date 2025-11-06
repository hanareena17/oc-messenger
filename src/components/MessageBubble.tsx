import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Message } from '../types/chat';
import { parseEmojiShorthand } from '../utils/emoji';
import { formatTimeShort } from '../utils/time';
import { formatFileSize } from '../utils/format';
import { useThemeColors } from '../theme/ThemeProvider';
import Avatar from './Avatar';
import { SIZES } from '../theme/constants';

type Props = {
  message: Message;
  isMe: boolean;
  onLongPress?: (message: Message) => void;
  showAvatar?: boolean;
  avatarChar?: string;
};

export default function MessageBubble({ message, isMe, onLongPress, showAvatar, avatarChar }: Props) {
  const colors = useThemeColors();
  const content = message.text ? parseEmojiShorthand(message.text) : '';
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const imageUri = useMemo(() => message.attachments?.find((a) => a.type === 'image')?.uri, [message.attachments]);
  const fileAttachment = useMemo(() => message.attachments?.find((a) => a.type === 'file'), [message.attachments]);
  const voiceAttachment = useMemo(() => message.attachments?.find((a) => a.type === 'voice'), [message.attachments]);
  const locationAttachment = useMemo(() => message.attachments?.find((a) => a.type === 'location'), [message.attachments]);

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
      {showAvatar && !isMe && (
        <Avatar size={SIZES.avatar.small} name={avatarChar} />
      )}

      <View style={styles.bubbleColumn}>
        <Pressable
          onLongPress={() => onLongPress?.(message)}
          style={[styles.bubble, { backgroundColor: isMe ? colors.userBubble : colors.otherBubble }]}
        >
          {!!content && (
            <Text style={[styles.text, { color: colors.primaryText }]}>{content}</Text>
          )}

          {imageUri && (
            <Pressable onPress={() => setPreviewUri(imageUri)}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </Pressable>
          )}

          {voiceAttachment && (
            <View style={styles.voice}>
              <Text style={styles.voiceIcon}>▶</Text>
              <Text style={styles.voiceLabel}>Voice {voiceAttachment.durationMs ? Math.round(voiceAttachment.durationMs / 1000) + 's' : ''}</Text>
              {!message.read && <View style={styles.voiceUnread} />}
            </View>
          )}

          {fileAttachment && (
            <View style={styles.file}>
              <View style={styles.fileIcon} />
              <View style={styles.fileMeta}>
                <Text style={[styles.fileName, isMe ? styles.textMe : styles.textOther]} numberOfLines={1}>
                  {fileAttachment.name ?? 'File'}
                </Text>
                {!!fileAttachment.sizeBytes && (
                  <Text style={styles.fileSize}>{formatFileSize(fileAttachment.sizeBytes)}</Text>
                )}
              </View>
            </View>
          )}

          {locationAttachment && (
            <View style={styles.location}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={[styles.locationText, { color: colors.primaryText }]}>
                Location
              </Text>
              {locationAttachment.latitude && locationAttachment.longitude && (
                <Text style={styles.locationCoords}>
                  {locationAttachment.latitude.toFixed(4)}, {locationAttachment.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          )}

          <Text style={[styles.time, { color: colors.secondaryText }]}>{formatTimeShort(message.createdAt)}</Text>
          {message.status !== 'sent' && (
            <Text style={[styles.status, { color: colors.secondaryText }]}>
              {message.status === 'sending' ? 'Sending…' : 'Failed'}
            </Text>
          )}
        </Pressable>
      </View>

      {showAvatar && isMe && (
        <Avatar size={SIZES.avatar.small} name={avatarChar ?? 'M'} />
      )}

      <Modal visible={!!previewUri} transparent onRequestClose={() => setPreviewUri(null)}>
        <Pressable style={styles.previewBackdrop} onPress={() => setPreviewUri(null)}>
          {previewUri && <Image source={{ uri: previewUri }} style={styles.previewImage} />}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubbleColumn: { maxWidth: SIZES.bubble.maxWidth, marginHorizontal: SIZES.spacing.sm },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMe: {
    backgroundColor: '#D3F9D8',
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#F1F3F5',
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  textMe: {
    color: '#212529',
  },
  textOther: {
    color: '#212529',
  },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12, marginTop: 6, backgroundColor: '#DEE2E6' },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  voiceIcon: { fontSize: 16, color: '#495057' },
  voiceLabel: { fontSize: 14, color: '#495057' },
  voiceUnread: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FA5252' },
  file: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  fileIcon: { width: 28, height: 36, borderRadius: 4, backgroundColor: '#ADB5BD' },
  fileMeta: { flexShrink: 1 },
  fileName: { fontSize: 14 },
  fileSize: { fontSize: 12, color: '#868E96' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.05)' },
  locationIcon: { fontSize: 20 },
  locationText: { fontSize: 14, fontWeight: '600' },
  locationCoords: { fontSize: 11, color: '#868E96', marginTop: 2 },
  time: { alignSelf: 'flex-end', fontSize: 12, color: '#868E96', marginTop: 4 },
  status: {
    marginTop: 4,
    fontSize: 11,
    color: '#ADB5BD',
  },
  timeMe: {},
  timeOther: {},
  previewBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '92%', height: '70%', resizeMode: 'contain' },
});


