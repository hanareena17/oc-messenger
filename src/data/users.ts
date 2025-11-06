export type UserProfile = {
  id: string;
  name: string;
  avatarUrl?: string;
  signature?: string;
  email?: string;
  about?: string;
};

export const usersById: Record<string, UserProfile> = {
  me: { id: 'me', name: 'Me', email: 'me@example.com', about: 'Available and ready to chat!', signature: 'Available' },
  user_2: { id: 'user_2', name: 'Alex Chen', signature: 'Work hard, play hard.' },
  user_3: { id: 'user_3', name: 'Design Team', signature: 'Make it delightful.' },
  user_4: { id: 'user_4', name: 'Mom', signature: 'Call me' },
  user_5: { id: 'user_5', name: 'Jordan', signature: 'On the move' },
};


