/**
 * Contextos globais (histórico + tema).
 * Extraídos de App.js para telas/componentes não importarem o entrypoint.
 */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { buildNavTheme, buildPaperTheme, getPalette } from '../theme';
import { loadThemeMode, saveThemeMode } from '../utils/preferences';
import { loadHistory, saveHistory } from '../utils/statistics';

export const HistoryContext = createContext({
  history: [],
  setHistory: () => {},
});

export const ThemeModeContext = createContext({
  themeMode: 'dark',
  palette: getPalette('dark'),
  toggleTheme: () => {},
});

/** Bootstrap de estado global usado por App.js. */
export function useAppBootstrap() {
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
  const themeValue = useMemo(
    () => ({ themeMode, palette, toggleTheme }),
    [themeMode, palette, toggleTheme]
  );

  return { historyValue, themeValue, paperTheme, navTheme, themeMode };
}
