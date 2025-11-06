import { Conversation, Message } from '../types/chat';

function nowMinus(minutes: number): number {
  return Date.now() - minutes * 60 * 1000;
}

function createMessage(
  id: string,
  conversationId: string,
  text: string,
  createdAt: number,
  read: boolean
): Message {
  return {
    id,
    conversationId,
    senderId: 'user_2',
    text,
    createdAt,
    read,
    status: 'sent',
  };
}

export const conversationsSeed: Conversation[] = [
  {
    id: 'c1',
    nickname: 'Alex Chen',
    avatarUrl: undefined,
    pinned: true,
    unreadCount: 2,
    lastMessage: createMessage('m1', 'c1', 'Lunch at 12? :smile:', nowMinus(5), false),
    updatedAt: nowMinus(5),
  },
  {
    id: 'c2',
    nickname: 'Design Team',
    avatarUrl: undefined,
    pinned: false,
    unreadCount: 0,
    lastMessage: createMessage('m2', 'c2', 'Great job on the mockups! :clap:', nowMinus(12), true),
    updatedAt: nowMinus(12),
  },
  {
    id: 'c3',
    nickname: 'Mom',
    avatarUrl: undefined,
    pinned: false,
    unreadCount: 1,
    lastMessage: createMessage('m3', 'c3', 'Call me when free', nowMinus(30), false),
    updatedAt: nowMinus(30),
  },
  {
    id: 'c4',
    nickname: 'Jordan',
    avatarUrl: undefined,
    pinned: false,
    unreadCount: 0,
    lastMessage: createMessage('m4', 'c4', 'See you later :thumbsup:', nowMinus(60), true),
    updatedAt: nowMinus(60),
  },
];


