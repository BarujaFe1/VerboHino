/**
 * src/components/AnswerButton.js
 * Função: botão de opção (Apple-ish: limpo, bordas suaves, feedback claro).
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function AnswerButton({ palette, label, onPress, disabled, eliminated, isCorrect, isWrongSelected }) {
  const styles = makeStyles(palette);

  if (eliminated) {
    return (
      <Button mode="outlined" disabled style={[styles.btn, styles.eliminated]} textColor={palette.comment}>
        —
      </Button>
    );
  }

  const buttonColor = isCorrect
    ? palette.green
    : isWrongSelected
      ? palette.red
      : palette.sidebar;

  const textColor = (isCorrect || isWrongSelected) ? (palette.mode === 'light' ? '#FFFFFF' : palette.bg) : palette.fg;

  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      style={styles.btn}
      contentStyle={styles.content}
      labelStyle={styles.label}
      buttonColor={buttonColor}
      textColor={textColor}
    >
      {label}
    </Button>
  );
}

function makeStyles(p) {
  return StyleSheet.create({
    btn: {
      borderRadius: 16,
      marginBottom: 10,
    },
    content: { paddingVertical: 10 },
    label: { fontSize: 14, letterSpacing: 0.2, fontWeight: '700' },
    eliminated: {
      backgroundColor: 'transparent',
      borderColor: p.border,
      borderWidth: 1,
      opacity: 0.55,
    },
  });
}
