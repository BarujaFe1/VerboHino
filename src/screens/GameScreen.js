/**
 * src/screens/GameScreen.js
 * Tela principal. Um único app com 2 tipos:
 * - Bíblia: mostra versículo e você escolhe a REFERÊNCIA correta
 * - Hinário: mostra uma estrofe e você escolhe o HINO correto
 *
 * Inclui modos (classic/survival/timeattack), 50/50, dica, timer, áudio e histórico.
 */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Button, IconButton, Snackbar, ProgressBar, SegmentedButtons, Dialog, Portal } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import VerseCard from '../components/VerseCard';
import AnswerButton from '../components/AnswerButton';
import Hearts from '../components/Hearts';

import { HistoryContext, ThemeModeContext } from '../../App';
import { addRecord } from '../utils/statistics';
import { buildAllPoolsAsync } from '../utils/dataLoader';
import { createQuestion } from '../utils/questionFactory';
import { tryLoadSound, playSound, unloadSound } from '../utils/sound';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GameScreen({ navigation }) {
  const { history, setHistory } = useContext(HistoryContext);
  const { palette, toggleTheme } = useContext(ThemeModeContext);

  // data
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [biblePool, setBiblePool] = useState([]);
  const [hymnPool, setHymnPool] = useState([]);

  // game settings
  const [gameType, setGameType] = useState('bible'); // 'bible' | 'hymn'
  const [mode, setMode] = useState('classic'); // classic | survival | timeattack
  const [difficulty, setDifficulty] = useState('easy'); // easy | medium | hard

  // state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [lives, setLives] = useState(3);
  const [helpsUsed, setHelpsUsed] = useState({ fifty: false, hint: false });

  const [q, setQ] = useState(null);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [eliminated, setEliminated] = useState(new Set());
  const [hintShown, setHintShown] = useState(false);

  // timer
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  // ui
  const [snack, setSnack] = useState({ visible: false, text: '' });
  const [gameOverVisible, setGameOverVisible] = useState(false);

  // audio
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);

  // recent ids to avoid repeats
  const recentIdsRef = useRef(new Set());
  const recentQueueRef = useRef([]);

  function showSnack(text) {
    setSnack({ visible: true, text });
  }

  // load everything
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setLoadError('');

        const bibleData = require('../../assets/arc.json');
        const hymns = require('../../assets/hinario_pronto.json');
        const commonPassages = require('../../assets/common_passages.json');
        const commonHymns = require('../../assets/common_hymns.json');

        if (!Array.isArray(bibleData) || !bibleData.length) {
          throw new Error('assets/arc.json inválido ou vazio.');
        }
        if (!Array.isArray(hymns) || !hymns.length) {
          throw new Error('assets/hinario_pronto.json inválido ou vazio.');
        }

        // sons (opcional)
        try {
          correctSoundRef.current = await tryLoadSound(require('../../assets/audio/correct.mp3'));
          wrongSoundRef.current = await tryLoadSound(require('../../assets/audio/wrong.mp3'));
        } catch {
          correctSoundRef.current = null;
          wrongSoundRef.current = null;
        }

        const { biblePool, hymnPool } = await buildAllPoolsAsync({
          bibleData,
          hymns,
          commonPassages,
          commonHymns,
        });

        if (!biblePool?.length) throw new Error('Pool da Bíblia ficou vazio (lista_bruta/arc.json).');
        if (!hymnPool?.length) throw new Error('Pool do Hinário ficou vazio (hinario_pronto.json).');

        setBiblePool(biblePool);
        setHymnPool(hymnPool);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setLoadError(
          `Erro ao carregar dados.\n\n` +
          `Verifique se existem:\n` +
          `- /assets/arc.json (Bíblia)\n` +
          `- /assets/hinario_pronto.json (Hinário)\n` +
          `- /src/data/rawList.js (sua lista_bruta completa)\n\n` +
          `Detalhe: ${String(e?.message || e)}`
        );
      }
    })();

    return () => {
      (async () => {
        await unloadSound(correctSoundRef.current);
        await unloadSound(wrongSoundRef.current);
      })();
    };
  }, []);

  // reset game when settings change
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, mode, difficulty]);

  // timeattack timer
  useEffect(() => {
    if (mode !== 'timeattack') {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (!q) return;
    if (locked) return;

    setTimeLeft(15);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 0.1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          onTimeout();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, q, locked]);

  function computeMultiplier(nextStreak) {
    return nextStreak >= 3 ? 2 : 1;
  }

  function rememberRecent(id) {
    const set = recentIdsRef.current;
    const q = recentQueueRef.current;
    set.add(id);
    q.push(id);
    // mantém últimos 20
    while (q.length > 20) {
      const old = q.shift();
      set.delete(old);
    }
  }

  function nextQuestion(initial = false) {
    const poolsReady = biblePool.length && hymnPool.length;
    if (!poolsReady) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const qq = createQuestion({
      gameType,
      biblePool,
      hymnPool,
      difficulty,
      recentIds: recentIdsRef.current,
    });

    setQ(qq);
    setSelected(null);
    setLocked(false);
    setEliminated(new Set());
    setHintShown(false);

    rememberRecent(qq.id);

    if (!initial && mode === 'timeattack') setTimeLeft(15);
  }

  function resetGame() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setScore(0);
    setStreak(0);
    setMultiplier(1);
    setLives(3);
    setHelpsUsed({ fifty: false, hint: false });
    setGameOverVisible(false);
    nextQuestion(true);
  }

  async function persistRecord({ correct }) {
    if (!q) return;
    const record = {
      type: q.type,
      correct,
      mode,
      difficulty,
      timestamp: new Date().toISOString(),
      ...(q.type === 'bible'
        ? { book: q.meta.book, ref: q.meta.ref }
        : { hymnNumero: q.meta.hymnNumero, hymnTitulo: q.meta.hymnTitulo, stanzaNumero: q.meta.stanzaNumero }),
    };
    setHistory((prev) => addRecord(prev, record));
  }

  async function handleCorrect() {
    const nextStreak = streak + 1;
    const nextMult = computeMultiplier(nextStreak);
    setScore((s) => s + 1 * nextMult);
    setStreak(nextStreak);
    setMultiplier(nextMult);

    await persistRecord({ correct: true });

    await playSound(correctSoundRef.current);
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
  }

  async function handleWrong() {
    setStreak(0);
    setMultiplier(1);

    if (mode === 'survival') setLives((l) => l - 1);

    await persistRecord({ correct: false });

    await playSound(wrongSoundRef.current);
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); } catch {}
  }

  function canContinue(nextLives) {
    if (mode !== 'survival') return true;
    return (nextLives ?? lives) > 0;
  }

  async function onAnswerPress(label) {
    if (locked || !q) return;

    setLocked(true);
    setSelected(label);
    clearInterval(timerRef.current);
    timerRef.current = null;

    const ok = label === q.correctLabel;

    if (ok) await handleCorrect();
    else await handleWrong();

    setTimeout(() => {
      if (mode === 'survival') {
        setLives((l) => {
          const nextLives = l;
          if (!canContinue(nextLives)) setGameOverVisible(true);
          else nextQuestion(false);
          return nextLives;
        });
      } else {
        nextQuestion(false);
      }
    }, 650);
  }

  async function onTimeout() {
    if (locked || !q) return;

    setLocked(true);
    setSelected('__timeout__');

    await handleWrong();
    showSnack('⏱️ Tempo esgotado!');

    setTimeout(() => {
      if (mode === 'survival') {
        setLives((l) => {
          const nextLives = l;
          if (!canContinue(nextLives)) setGameOverVisible(true);
          else nextQuestion(false);
          return nextLives;
        });
      } else {
        nextQuestion(false);
      }
    }, 650);
  }

  function use5050() {
    if (helpsUsed.fifty || locked || !q) return;

    const wrongs = q.options.filter((o) => o !== q.correctLabel);
    const toRemove = wrongs.sort(() => Math.random() - 0.5).slice(0, 2);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEliminated(new Set(toRemove));
    setHelpsUsed((h) => ({ ...h, fifty: true }));
    showSnack('50/50: 2 opções removidas.');
  }

  function useHint() {
    if (helpsUsed.hint || locked || !q) return;
    setHintShown(true);
    setHelpsUsed((h) => ({ ...h, hint: true }));
    showSnack(q.hint);
  }

  const streakLabel = useMemo(() => {
    if (!streak) return '';
    return `🔥 Sequência: ${streak}  •  x${multiplier}`;
  }, [streak, multiplier]);

  const timerVisible = mode === 'timeattack';
  const progress = Math.max(0, Math.min(1, timeLeft / 15));

  // header buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <IconButton
            icon="theme-light-dark"
            iconColor={palette.fg}
            size={22}
            onPress={toggleTheme}
            accessibilityLabel="Alternar tema"
          />
          <IconButton
            icon="chart-bar"
            iconColor={palette.fg}
            size={22}
            onPress={() => navigation.navigate('Stats')}
            accessibilityLabel="Abrir estatísticas"
          />
          <IconButton
            icon="restart"
            iconColor={palette.fg}
            size={22}
            onPress={resetGame}
            accessibilityLabel="Reiniciar"
          />
        </View>
      ),
    });
  }, [navigation, palette, toggleTheme, gameType, mode, difficulty, score, streak, multiplier]);

  const styles = useMemo(() => makeStyles(palette), [palette]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.purple} />
          <Text style={styles.loadingText}>Preparando Bíblia e Hinário…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.errorWrap}>
          <Text style={styles.title}>Quiz Bíblia + Hinário</Text>
          <Text style={styles.errorTitle}>Erro ao carregar</Text>
          <Text style={styles.errorText}>{loadError}</Text>
          <Button
            mode="contained"
            onPress={() => showSnack('Corrija os arquivos e reinicie o app.')}
            buttonColor={palette.purple}
            textColor={palette.mode === 'light' ? '#FFF' : palette.bg}
            style={{ borderRadius: 16, marginTop: 16 }}
          >
            Entendi
          </Button>
        </ScrollView>
        <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, text: '' })}>
          {snack.text}
        </Snackbar>
      </SafeAreaView>
    );
  }

  const cardTitle = q?.type === 'hymn' ? 'HINÁRIO' : 'BÍBLIA';
  const cardSubtitle = q?.type === 'hymn'
    ? `Qual é o hino? (uma estrofe)`
    : `Qual é a referência?`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>QUAL É?</Text>

        <View style={styles.topRow}>
          <Text style={styles.score}>Pontos: {score}</Text>
          {mode === 'survival' ? <Hearts palette={palette} lives={lives} /> : <View />}
        </View>

        {!!streakLabel && <Text style={styles.streak}>{streakLabel}</Text>}

        <View style={styles.segmentWrap}>
          <SegmentedButtons
            value={gameType}
            onValueChange={setGameType}
            buttons={[
              { value: 'bible', label: 'Bíblia' },
              { value: 'hymn', label: 'Hinário' },
            ]}
          />
        </View>

        <View style={styles.segmentWrap}>
          <SegmentedButtons
            value={mode}
            onValueChange={setMode}
            buttons={[
              { value: 'classic', label: 'Clássico' },
              { value: 'survival', label: 'Sobrevivência' },
              { value: 'timeattack', label: 'Relógio' },
            ]}
          />
        </View>

        <View style={styles.segmentWrap}>
          <SegmentedButtons
            value={difficulty}
            onValueChange={setDifficulty}
            buttons={[
              { value: 'easy', label: 'Fácil' },
              { value: 'medium', label: 'Médio' },
              { value: 'hard', label: 'Difícil' },
            ]}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          <VerseCard
            palette={palette}
            title={cardTitle}
            subtitle={cardSubtitle}
            text={q?.promptText ?? '—'}
            hint={hintShown ? q?.hint : ''}
          />
        </View>

        {timerVisible && (
          <View style={styles.timerWrap}>
            <ProgressBar progress={progress} color={palette.cyan} style={styles.progress} />
            <Text style={styles.timerText}>⏱️ {Math.ceil(timeLeft)}s</Text>
          </View>
        )}

        <View style={styles.helpRow}>
          <Button
            mode="contained"
            disabled={helpsUsed.fifty || locked}
            onPress={use5050}
            buttonColor={palette.purple}
            textColor={palette.mode === 'light' ? '#FFF' : palette.bg}
            style={styles.helpBtn}
          >
            50/50
          </Button>
          <Button
            mode="contained"
            disabled={helpsUsed.hint || locked}
            onPress={useHint}
            buttonColor={palette.cyan}
            textColor={palette.mode === 'light' ? '#FFF' : palette.bg}
            style={styles.helpBtn}
          >
            Dica
          </Button>
        </View>

        <View style={{ marginTop: 8 }}>
          {(q?.options ?? []).map((opt) => {
            const isCorrect = locked && opt === q.correctLabel;
            const isWrongSelected = locked && selected === opt && opt !== q.correctLabel;
            return (
              <AnswerButton
                key={opt}
                palette={palette}
                label={opt}
                eliminated={eliminated.has(opt)}
                disabled={locked}
                isCorrect={isCorrect}
                isWrongSelected={isWrongSelected}
                onPress={() => onAnswerPress(opt)}
              />
            );
          })}
        </View>
      </ScrollView>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, text: '' })}
        duration={2200}
        style={{ backgroundColor: palette.sidebar }}
      >
        {snack.text}
      </Snackbar>

      <Portal>
        <Dialog visible={gameOverVisible} onDismiss={() => {}}>
          <Dialog.Title style={{ color: palette.fg }}>Fim de jogo</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: palette.fg, lineHeight: 20 }}>
              Você ficou sem vidas no modo Sobrevivência.
              {'\n\n'}Pontuação: {score}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setMode('classic')} textColor={palette.cyan}>Ir para Clássico</Button>
            <Button onPress={resetGame} textColor={palette.purple}>Recomeçar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

function makeStyles(p) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16, paddingBottom: 26 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { color: p.comment, fontSize: 14, fontWeight: '700' },
    title: {
      textAlign: 'center',
      color: p.purple,
      fontSize: 22,
      fontWeight: '900',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    score: { color: p.green, fontSize: 16, fontWeight: '900' },
    streak: { marginTop: 8, color: p.orange, textAlign: 'center', fontSize: 14, fontWeight: '800' },
    segmentWrap: { marginTop: 10 },
    helpRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
    helpBtn: { flex: 1, borderRadius: 16 },
    timerWrap: { marginTop: 12, alignItems: 'center', gap: 6 },
    progress: { width: '100%', height: 10, borderRadius: 999, backgroundColor: p.sidebar },
    timerText: { color: p.fg, fontSize: 12, fontWeight: '800' },
    errorWrap: { padding: 18 },
    errorTitle: { color: p.red, fontSize: 18, fontWeight: '900', marginTop: 10 },
    errorText: { color: p.fg, marginTop: 10, lineHeight: 20 },
  });
}
