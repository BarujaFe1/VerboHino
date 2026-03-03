/**
 * src/components/VerseCard.js
 * Função: Card do texto (versículo ou estrofe).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VerseCard({ palette, title, subtitle, text, hint }) {
  const styles = makeStyles(palette);
  return (
    <View style={styles.card}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <Text style={styles.text} selectable>{text}</Text>
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

function makeStyles(p) {
  return StyleSheet.create({
    card: {
      backgroundColor: p.card,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: p.border,
      minHeight: 190,
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: p.mode === 'light' ? 0.08 : 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    title: {
      textAlign: 'center',
      color: p.comment,
      fontSize: 12,
      letterSpacing: 0.6,
      marginBottom: 6,
      fontWeight: '700',
    },
    subtitle: {
      textAlign: 'center',
      color: p.comment,
      fontSize: 12,
      marginBottom: 12,
    },
    text: {
      color: p.fg,
      fontSize: 17,
      lineHeight: 24,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    hint: {
      marginTop: 14,
      textAlign: 'center',
      color: p.cyan,
      fontSize: 13,
      letterSpacing: 0.2,
      fontWeight: '700',
    },
  });
}
