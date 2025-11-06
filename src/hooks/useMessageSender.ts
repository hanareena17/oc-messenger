import { useCallback, useState } from 'react';
import { Message, Attachment } from '../types/chat';
import { parseEmojiShorthand } from '../utils/emoji';

type UseMessageSenderOptions = {
  conversationId: string;
  onMessageSent?: (message: Message) => void;
};

export function useMessageSender({ conversationId, onMessageSent }: UseMessageSenderOptions) {
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());

  const createMessage = useCallback(
    (text?: string, attachments?: Attachment[]): Message => ({
      id: 'tmp_' + Date.now(),
      conversationId,
      senderId: 'me',
      text: text ? parseEmojiShorthand(text) : undefined,
      attachments,
      createdAt: Date.now(),
      read: true,
      status: 'sending',
    }),
    [conversationId]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return null;

      const newMsg = createMessage(trimmed);
      setSendingIds((prev) => new Set(prev).add(newMsg.id));
      onMessageSent?.(newMsg);

      // Simulate network delay
      setTimeout(() => {
        setSendingIds((prev) => {
          const next = new Set(prev);
          next.delete(newMsg.id);
          return next;
        });
        onMessageSent?.({ ...newMsg, status: 'sent' });
      }, 800);

      return newMsg;
    },
    [createMessage, onMessageSent]
  );

  const sendAttachment = useCallback(
    (attachments: Attachment[]) => {
      const newMsg = createMessage(undefined, attachments);
      setSendingIds((prev) => new Set(prev).add(newMsg.id));
      onMessageSent?.(newMsg);

      setTimeout(() => {
        setSendingIds((prev) => {
          const next = new Set(prev);
          next.delete(newMsg.id);
          return next;
        });
        onMessageSent?.({ ...newMsg, status: 'sent' });
      }, 800);

      return newMsg;
    },
    [createMessage, onMessageSent]
  );

  return { sendMessage, sendAttachment, sendingIds };
}

