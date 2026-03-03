/**
 * src/theme.js
 * Função: paletas Light/Dark + temas para React Native Paper e React Navigation.
 */
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { DefaultTheme as NavDefaultTheme } from '@react-navigation/native';

export function getPalette(mode) {
  if (mode === 'light') {
    return {
      mode: 'light',
      bg: '#F5F5F7',
      card: '#FFFFFF',
      sidebar: '#EFEFF4',
      fg: '#1D1D1F',
      cyan: '#007AFF',
      green: '#34C759',
      orange: '#FF9500',
      pink: '#FF2D55',
      purple: '#5856D6',
      red: '#FF3B30',
      comment: '#6E6E73',
      border: '#D2D2D7',
    };
  }
  // Dark (Dracula adapted)
  return {
    mode: 'dark',
    bg: '#13141f',
    card: '#1e1f29',
    sidebar: '#0f1019',
    fg: '#f8f8f2',
    cyan: '#8be9fd',
    green: '#50fa7b',
    orange: '#ffb86c',
    pink: '#ff79c6',
    purple: '#bd93f9',
    red: '#ff5555',
    comment: '#6272a4',
    border: '#2a2b3a',
  };
}

export function buildPaperTheme(p) {
  const base = p.mode === 'light' ? MD3LightTheme : MD3DarkTheme;
  return {
    ...base,
    roundness: 18,
    colors: {
      ...base.colors,
      background: p.bg,
      surface: p.card,
      surfaceVariant: p.card,
      onSurface: p.fg,
      onSurfaceVariant: p.comment,
      primary: p.purple,
      secondary: p.cyan,
      tertiary: p.green,
      error: p.red,
      outline: p.border,
    },
  };
}

export function buildNavTheme(p) {
  return {
    ...NavDefaultTheme,
    colors: {
      ...NavDefaultTheme.colors,
      background: p.bg,
      card: p.sidebar,
      text: p.fg,
      border: p.border,
      primary: p.purple,
      notification: p.pink,
    },
  };
}
