/**
 * PATCH: App.js
 * O que muda:
 * - Título do app no header: "Verbo & Hino"
 *
 * Como aplicar:
 * - Substitua o App.js do seu projeto por este.
 */
import 'react-native-gesture-handler';

import React, { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';
import { buildPaperTheme, buildNavTheme, getPalette } from './src/theme';
import { loadThemeMode, saveThemeMode } from './src/utils/preferences';
import { loadHistory, saveHistory } from './src/utils/statistics';

export const HistoryContext = createContext({
  history: [],
  setHistory: () => {},
});

export const ThemeModeContext = createContext({
  themeMode: 'dark',
  palette: getPalette('dark'),
  toggleTheme: () => {},
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [themeMode, setThemeMode] = useState('dark');
  const palette = useMemo(() => getPalette(themeMode), [themeMode]);
  const paperTheme = useMemo(() => buildPaperTheme(palette), [palette]);
  const navTheme = useMemo(() => buildNavTheme(palette), [palette]);

  useEffect(() => {
    (async () => {
      const saved = await loadThemeMode('dark');
      setThemeMode(saved);
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark';
      saveThemeMode(next);
      return next;
    });
  }, []);

  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const h = await loadHistory();
      setHistory(h);
      setHistoryLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    saveHistory(history);
  }, [history, historyLoaded]);

  const historyValue = useMemo(() => ({ history, setHistory }), [history]);
  const themeValue = useMemo(() => ({ themeMode, palette, toggleTheme }), [themeMode, palette, toggleTheme]);

  return (
    <ThemeModeContext.Provider value={themeValue}>
      <HistoryContext.Provider value={historyValue}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer theme={navTheme}>
            <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
            <Stack.Navigator
              initialRouteName="Game"
              screenOptions={{
                headerStyle: { backgroundColor: palette.sidebar },
                headerTintColor: palette.fg,
                headerTitleStyle: { fontWeight: '800' },
                contentStyle: { backgroundColor: palette.bg },
              }}
            >
              <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Verbo & Hino' }} />
              <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Estatísticas' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </HistoryContext.Provider>
    </ThemeModeContext.Provider>
  );
}
