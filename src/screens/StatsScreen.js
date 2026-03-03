/**
 * src/screens/StatsScreen.js
 * Estatísticas com toggle Bíblia/Hinário:
 * - Pie chart top 5
 * - Tabela top 15
 * - Export JSON / Import JSON / Export CSV
 */
import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Button, DataTable, Snackbar, SegmentedButtons } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

import { HistoryContext, ThemeModeContext } from '../../App';
import { overallAccuracy, accuracyByType, statsBibleByBook, statsHymnByNumero } from '../utils/statistics';
import { exportHistoryJSON, importHistoryJSON, exportCSV } from '../utils/exporters';

const chartWidth = Math.min(Dimensions.get('window').width - 32, 420);

export default function StatsScreen() {
  const { history, setHistory } = useContext(HistoryContext);
  const { palette } = useContext(ThemeModeContext);
  const [snack, setSnack] = useState({ visible: false, text: '' });

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

  const pieData = useMemo(() => {
    const paletteList = [palette.purple, palette.cyan, palette.green, palette.orange, palette.pink];
    return top5.map((r, idx) => ({
      name: r.label.length > 18 ? (r.label.slice(0, 18) + '…') : r.label,
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
      if (!res.ok) return showSnack('Arquivo inválido.');
      setHistory(res.history);
      showSnack('Histórico importado.');
    } catch {
      showSnack('Falha ao importar JSON.');
    }
  }

  async function onExportCSV() {
    try {
      const res = await exportCSV({ history, bibleByBook, hymnByNumero });
      showSnack(res.ok ? 'CSV exportado.' : 'Não foi possível compartilhar CSV.');
    } catch {
      showSnack('Falha ao exportar CSV.');
    }
  }

  const styles = useMemo(() => makeStyles(palette), [palette]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Resumo</Text>

        <View style={styles.card}>
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
              hasLegend={true}
            />
          ) : (
            <Text style={styles.muted}>Sem dados ainda. Jogue algumas rodadas.</Text>
          )}
        </View>

        <Text style={styles.h1}>Detalhes (Top 15)</Text>
        <View style={styles.card}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.tableHead}>{view === 'hymn' ? 'Hino' : 'Livro'}</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.tableHead}>Acertos</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.tableHead}>Total</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.tableHead}>%</DataTable.Title>
            </DataTable.Header>

            {rows.slice(0, 15).map((r) => (
              <DataTable.Row key={r.key}>
                <DataTable.Cell textStyle={styles.tableCell}>{r.label}</DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.tableCell}>{r.correct}</DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.tableCell}>{r.total}</DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.tableCell}>{Math.round(r.acc * 100)}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>

        <Text style={styles.h1}>Exportar / Importar</Text>
        <View style={styles.btnRow}>
          <Button mode="contained" onPress={onExportJSON} buttonColor={palette.purple} textColor={palette.mode === 'light' ? '#FFF' : palette.bg} style={styles.btn}>
            Exportar JSON
          </Button>
          <Button mode="contained" onPress={onImportJSON} buttonColor={palette.cyan} textColor={palette.mode === 'light' ? '#FFF' : palette.bg} style={styles.btn}>
            Importar JSON
          </Button>
        </View>
        <View style={styles.btnRow}>
          <Button mode="contained" onPress={onExportCSV} buttonColor={palette.green} textColor={palette.mode === 'light' ? '#FFF' : palette.bg} style={styles.btn}>
            Exportar CSV
          </Button>
        </View>
      </ScrollView>

      <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, text: '' })} duration={2200}>
        {snack.text}
      </Snackbar>
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
    muted: { color: p.comment, fontWeight: '700' },
    btnRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btn: { flex: 1, borderRadius: 16 },
    tableHead: { color: p.comment, fontSize: 12, fontWeight: '900' },
    tableCell: { color: p.fg, fontSize: 12, fontWeight: '700' },
  });
}
