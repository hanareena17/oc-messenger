export type AttachmentType = 'image' | 'voice' | 'file' | 'location';

export type Attachment = {
  id: string;
  type: AttachmentType;
  uri?: string; 
  name?: string; 
  sizeBytes?: number;
  durationMs?: number; 
  latitude?: number; 
  longitude?: number;
};

export type MessageStatus = 'sending' | 'sent' | 'failed';

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string; 
  attachments?: Attachment[];
  createdAt: number; 
  read: boolean;
  status: MessageStatus;
  recallableUntil?: number; 
};

export type Conversation = {
  id: string;
  nickname: string;
  avatarUrl?: string;
  pinned: boolean;
  unreadCount: number;
  lastMessage?: Message;
  updatedAt: number; 
};


