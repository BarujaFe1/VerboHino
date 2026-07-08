const PREFIX = '@vh:';

function normalizeKey(key) {
  if (key.startsWith(PREFIX)) return key;
  return PREFIX + key;
}

const AsyncStorage = {
  async getItem(key) {
    try {
      return localStorage.getItem(normalizeKey(key));
    } catch {
      return null;
    }
  },

  async setItem(key, value) {
    try {
      localStorage.setItem(normalizeKey(key), value);
    } catch {}
  },

  async removeItem(key) {
    try {
      localStorage.removeItem(normalizeKey(key));
    } catch {}
  },

  async clear() {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {}
  },

  async getAllKeys() {
    try {
      return Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .map((k) => k.slice(PREFIX.length));
    } catch {
      return [];
    }
  },
};

module.exports = AsyncStorage;
module.exports.default = AsyncStorage;
