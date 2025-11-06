import { Message } from '../types/chat';

function nowMinus(min: number) {
  return Date.now() - min * 60 * 1000;
}

export const messagesByConversation: Record<string, Message[]> = {
  c1: [
    { id: 'c1m1', conversationId: 'c1', senderId: 'user_2', text: 'Hey!', createdAt: nowMinus(120), read: true, status: 'sent' },
    { id: 'c1m2', conversationId: 'c1', senderId: 'me', text: 'Hi Alex 👋', createdAt: nowMinus(119), read: true, status: 'sent' },
    { id: 'c1m3', conversationId: 'c1', senderId: 'user_2', text: 'Lunch at 12? :smile:', createdAt: nowMinus(5), read: false, status: 'sent' },
  ],
  c2: [
    { id: 'c2m1', conversationId: 'c2', senderId: 'user_3', text: 'Great job on the mockups! :clap:', createdAt: nowMinus(12), read: true, status: 'sent' },
  ],
  c3: [
    { id: 'c3m1', conversationId: 'c3', senderId: 'user_4', text: 'Call me when free', createdAt: nowMinus(30), read: false, status: 'sent' },
  ],
  c4: [
    { id: 'c4m1', conversationId: 'c4', senderId: 'user_5', text: 'See you later :thumbsup:', createdAt: nowMinus(60), read: true, status: 'sent' },
  ],
};


