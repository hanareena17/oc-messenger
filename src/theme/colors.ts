export type ThemeName = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  primaryText: string;
  secondaryText: string;
  userBubble: string;
  otherBubble: string;
  accent: string;
  divider: string;
  surface: string;
  border: string;
};

export const palettes: Record<ThemeName, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    primaryText: '#000000',
    secondaryText: '#999999',
    userBubble: '#DCF8C6',
    otherBubble: '#F1F1F1',
    accent: '#3483FA',
    divider: '#E9ECEF',
    surface: '#FFFFFF',
    border: '#F1F3F5',
  },
  dark: {
    background: '#121212',
    primaryText: '#FFFFFF',
    secondaryText: '#BBBBBB',
    userBubble: '#3A3A3A',
    otherBubble: '#2A2A2A',
    accent: '#3483FA',
    divider: '#2F2F2F',
    surface: '#121212',
    border: '#222222',
  },
};


