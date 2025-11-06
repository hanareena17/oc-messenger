import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { palettes, ThemeColors, ThemeName } from './colors';

type ThemeContextValue = {
  colors: ThemeColors;
  themeName: ThemeName | 'system';
  setThemeName: (name: ThemeName | 'system') => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: palettes.light,
  themeName: 'system',
  setThemeName: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme: ColorSchemeName = useColorScheme();
  const [override, setOverride] = useState<ThemeName | 'system'>('system');
  const effective: ThemeName = override === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : override;
  const colors = useMemo(() => palettes[effective], [effective]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      themeName: override,
      setThemeName: setOverride,
      toggleTheme: () => setOverride((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [colors, override]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}

export function useTheme() {
  return useContext(ThemeContext);
}


