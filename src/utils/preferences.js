/**
 * src/utils/preferences.js
 * Função: salva/carrega preferências (tema) no AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@quiz_theme_mode_v1'; // 'light' | 'dark'

export async function loadThemeMode(defaultMode = 'dark') {
  try {
    const v = await AsyncStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
    return defaultMode;
  } catch {
    return defaultMode;
  }
}

export async function saveThemeMode(mode) {
  try {
    await AsyncStorage.setItem(THEME_KEY, mode);
  } catch {
    // ignore
  }
}
