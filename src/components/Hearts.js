/**
 * src/components/Hearts.js
 * Função: indicador de vidas (modo sobrevivência).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Hearts({ palette, lives }) {
  const hearts = Array.from({ length: 3 }).map((_, i) => (i < lives ? '♥' : '♡'));
  const styles = makeStyles(palette);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Vidas</Text>
      <Text style={styles.hearts}>{hearts.join(' ')}</Text>
    </View>
  );
}

function makeStyles(p) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    label: { color: p.comment, fontSize: 12, fontWeight: '700' },
    hearts: { color: p.red, fontSize: 18, letterSpacing: 2 },
  });
}
