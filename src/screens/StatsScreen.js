/**
 * Estatísticas com toggle Bíblia/Hinário:
 * - Pie chart top 5
 * - Tabela top 15
 * - Export JSON / Import JSON / Export CSV
 * - Empty states e confirmação de importação
 */
import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Button, DataTable, Snackbar, SegmentedButtons, Dialog, Portal } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

import { HistoryContext, ThemeModeContext } from '../context/AppContext';
import { overallAccuracy, accuracyByType, statsBibleByBook, statsHymnByNumero } from '../utils/statistics';
import { exportHistoryJSON, importHistoryJSON, exportCSV } from '../utils/exporters';

const chartWidth = Math.min(Dimensions.get('window').width - 32, 420);

export default function StatsScreen() {
  const { history, setHistory } = useContext(HistoryContext);
  const { palette } = useContext(ThemeModeContext);
  const [snack, setSnack] = useState({ visible: false, text: '' });
  const [importConfirmVisible, setImportConfirmVisible] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [clearConfirmVisible, setClearConfirmVisible] = useState(false);

  const [view, setView] = useState('bible'); // bible | hymn

  const overall = useMemo(() => overallAccuracy(history), [history]);
  const byTypeAcc = useMemo(() => accuracyByType(history), [history]);
  const bibleByBook = useMemo(() => statsBibleByBook(history), [history]);
  const hymnByNumero = useMemo(() => statsHymnByNumero(history), [history]);

  const rows = useMemo(() => {
    if (view === 'hymn') {
      const r = Object.entries(hymnByNumero).map(([num, s]) => ({
        key: num,
        label: s.titulo ? `Nº ${num} — ${s.titulo}` : `Nº ${num}`,
        total: s.total,
        correct: s.correct,
        acc: s.total ? s.correct / s.total : 0,
      }));
      r.sort((a, b) => b.total - a.total);
      return r;
    }
    const r = Object.entries(bibleByBook).map(([book, s]) => ({
      key: book,
      label: book,
      total: s.total,
      correct: s.correct,
      acc: s.total ? s.correct / s.total : 0,
    }));
    r.sort((a, b) => b.total - a.total);
    return r;
  }, [view, bibleByBook, hymnByNumero]);

  const top5 = rows.slice(0, 5);
  const top15 = rows.slice(0, 15);

  const pieData = useMemo(() => {
    const paletteList = [palette.purple, palette.cyan, palette.green, palette.orange, palette.pink];
    return top5.map((r, idx) => ({
      name: r.label.length > 18 ? `${r.label.slice(0, 18)}…` : r.label,
      population: r.total,
      color: paletteList[idx % paletteList.length],
      legendFontColor: palette.fg,
      legendFontSize: 12,
    }));
  }, [top5, palette]);

  function showSnack(text) {
    setSnack({ visible: true, text });
  }

  async function onExportJSON() {
    try {
      const res = await exportHistoryJSON(history);
      showSnack(res.ok ? 'JSON exportado.' : 'Não foi possível compartilhar JSON.');
    } catch {
      showSnack('Falha ao exportar JSON.');
    }
  }

  async function onImportJSON() {
    try {
      const res = await importHistoryJSON();
      if (res.canceled) return;
      if (!res.ok) {
        const reasonMap = {
          invalid_format: 'Arquivo JSON inválido.',
          no_uri: 'Não foi possível ler o arquivo.',
          sharing_unavailable: 'Compartilhamento indisponível.',
        };
        return showSnack(reasonMap[res.reason] || res.reason || 'Arquivo inválido.');
      }
      setPendingImport(res.history);
      setImportConfirmVisible(true);
    } catch {
      showSnack('Falha ao importar JSON.');
    }
  }

  function confirmImport() {
    const next = pendingImport ?? [];
    setHistory(next);
    setImportConfirmVisible(false);
    setPendingImport(null);
    showSnack(`Histórico substituído (${next.length} registros).`);
  }

  function cancelImport() {
    setImportConfirmVisible(false);
    setPendingImport(null);
  }

  async function onExportCSV() {
    try {
      const res = await exportCSV({ history, bibleByBook, hymnByNumero });
      showSnack(res.ok ? 'CSV exportado.' : 'Não foi possível compartilhar CSV.');
    } catch {
      showSnack('Falha ao exportar CSV.');
    }
  }

  function confirmClear() {
    setHistory([]);
    setClearConfirmVisible(false);
    showSnack('Histórico limpo.');
  }

  const styles = useMemo(() => makeStyles(palette), [palette]);
  const emptyMessage =
    view === 'hymn'
      ? 'Sem dados do Hinário ainda. Jogue algumas rodadas nesse modo.'
      : 'Sem dados da Bíblia ainda. Jogue algumas rodadas nesse modo.';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Resumo</Text>

        <View style={styles.card}>
          {history.length === 0 ? (
            <Text style={styles.muted}>
              Nenhuma partida registrada. Volte ao jogo, responda algumas perguntas e suas estatísticas aparecem aqui.
            </Text>
          ) : (
            <>
              <Text style={styles.metric}>
                Total de tentativas: <Text style={styles.metricStrong}>{history.length}</Text>
              </Text>
              <Text style={styles.metric}>
                Acurácia geral: <Text style={styles.metricStrong}>{Math.round(overall * 100)}%</Text>
              </Text>
              <Text style={styles.metric}>
                Bíblia: <Text style={styles.metricStrong}>{Math.round(byTypeAcc.bible * 100)}%</Text> • Hinário:{' '}
                <Text style={styles.metricStrong}>{Math.round(byTypeAcc.hymn * 100)}%</Text>
              </Text>
            </>
          )}
        </View>

        <Text style={styles.h1}>Visualização</Text>
        <View style={{ marginBottom: 10 }}>
          <SegmentedButtons
            value={view}
            onValueChange={setView}
            buttons={[
              { value: 'bible', label: 'Bíblia' },
              { value: 'hymn', label: 'Hinário' },
            ]}
          />
        </View>

        <Text style={styles.h1}>Top 5</Text>
        <View style={styles.card}>
          {pieData.length ? (
            <PieChart
              data={pieData}
              width={chartWidth}
              height={220}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="12"
              center={[8, 0]}
              chartConfig={{
                backgroundGradientFrom: palette.card,
                backgroundGradientTo: palette.card,
                color: () => palette.fg,
                labelColor: () => palette.fg,
              }}
              hasLegend
            />
          ) : (
            <Text style={styles.muted}>{emptyMessage}</Text>
          )}
        </View>

        <Text style={styles.h1}>Detalhes (Top 15)</Text>
        <View style={styles.card}>
          {top15.length === 0 ? (
            <Text style={styles.muted}>{emptyMessage}</Text>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={styles.tableHead}>{view === 'hymn' ? 'Hino' : 'Livro'}</DataTable.Title>
                <DataTable.Title numeric textStyle={styles.tableHead}>Acertos</DataTable.Title>
                <DataTable.Title numeric textStyle={styles.tableHead}>Total</DataTable.Title>
                <DataTable.Title numeric textStyle={styles.tableHead}>%</DataTable.Title>
              </DataTable.Header>

              {top15.map((r) => (
                <DataTable.Row key={r.key}>
                  <DataTable.Cell textStyle={styles.tableCell}>{r.label}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={styles.tableCell}>{r.correct}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={styles.tableCell}>{r.total}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={styles.tableCell}>{Math.round(r.acc * 100)}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          )}
        </View>

        <Text style={styles.h1}>Exportar / Importar</Text>
        <Text style={styles.hint}>
          Importar substitui o histórico local. Exporte um backup antes se quiser preservar o progresso atual.
        </Text>
        <View style={styles.btnRow}>
          <Button
            mode="contained"
            onPress={onExportJSON}
            buttonColor={palette.purple}
            textColor={palette.mode === 'light' ? '#FFF' : palette.bg}
            style={styles.btn}
            accessibilityLabel="Exportar histórico em JSON"
          >
            Exportar JSON
          </Button>
          <Button
            mode="contained"
            onPress={onImportJSON}
            buttonColor={palette.cyan}
            textColor={palette.mode === 'light' ? '#FFF' : palette.bg}
            style={styles.btn}
            accessibilityLabel="Importar histórico em JSON"
          >
            Importar JSON
          </Button>
        </View>
        <View style={styles.btnRow}>
          <Button
            mode="contained"
            onPress={onExportCSV}
            buttonColor={palette.green}
            textColor={palette.mode === 'light' ? '#FFF' : palette.bg}
            style={styles.btn}
            accessibilityLabel="Exportar estatísticas em CSV"
          >
            Exportar CSV
          </Button>
          <Button
            mode="outlined"
            onPress={() => setClearConfirmVisible(true)}
            textColor={palette.red}
            style={styles.btn}
            disabled={history.length === 0}
            accessibilityLabel="Limpar histórico local"
          >
            Limpar
          </Button>
        </View>
      </ScrollView>

      <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, text: '' })} duration={2200}>
        {snack.text}
      </Snackbar>

      <Portal>
        <Dialog visible={importConfirmVisible} onDismiss={cancelImport}>
          <Dialog.Title style={{ color: palette.fg }}>Substituir histórico?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: palette.fg, lineHeight: 20 }}>
              Isso apaga o histórico atual e carrega {(pendingImport ?? []).length} registros do arquivo.
              {'\n\n'}Esta ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelImport} textColor={palette.comment}>Cancelar</Button>
            <Button onPress={confirmImport} textColor={palette.purple}>Substituir</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={clearConfirmVisible} onDismiss={() => setClearConfirmVisible(false)}>
          <Dialog.Title style={{ color: palette.fg }}>Limpar histórico?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: palette.fg, lineHeight: 20 }}>
              Remove todas as {history.length} tentativas salvas neste dispositivo.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearConfirmVisible(false)} textColor={palette.comment}>Cancelar</Button>
            <Button onPress={confirmClear} textColor={palette.red}>Limpar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

function makeStyles(p) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16, paddingBottom: 28 },
    h1: { color: p.fg, fontSize: 16, fontWeight: '900', marginTop: 16, marginBottom: 10 },
    card: {
      backgroundColor: p.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: p.border,
      padding: 14,
    },
    metric: { color: p.fg, fontSize: 14, marginBottom: 6, fontWeight: '700' },
    metricStrong: { color: p.orange, fontWeight: '900' },
    muted: { color: p.comment, fontWeight: '700', lineHeight: 20 },
    hint: { color: p.comment, fontSize: 12, fontWeight: '600', marginBottom: 4, lineHeight: 18 },
    btnRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btn: { flex: 1, borderRadius: 16, minHeight: 44 },
    tableHead: { color: p.comment, fontSize: 12, fontWeight: '900' },
    tableCell: { color: p.fg, fontSize: 12, fontWeight: '700' },
  });
}
