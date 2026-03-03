/**
 * src/utils/sound.js
 * Função: áudio de acerto/erro usando expo-av (SDK 54), com fallback se não existir.
 */
import { Audio } from 'expo-av';

export async function tryLoadSound(requireRef) {
  try {
    const { sound } = await Audio.Sound.createAsync(requireRef, { shouldPlay: false });
    return sound;
  } catch {
    return null;
  }
}

export async function playSound(sound) {
  try {
    if (!sound) return false;
    await sound.replayAsync();
    return true;
  } catch {
    return false;
  }
}

export async function unloadSound(sound) {
  try {
    if (!sound) return;
    await sound.unloadAsync();
  } catch {}
}
