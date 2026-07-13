/**
 * Indicador de vidas (modo sobrevivência).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Hearts({ palette, lives }) {
  const hearts = Array.from({ length: 3 }).map((_, i) => (i < lives ? '♥' : '♡'));
  const styles = makeStyles(palette);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Vidas restantes: ${lives} de 3`}
    >
      <Text style={styles.label} importantForAccessibility="no">
        Vidas
      </Text>
      <Text style={styles.hearts} importantForAccessibility="no">
        {hearts.join(' ')}
      </Text>
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
