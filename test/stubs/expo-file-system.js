let captured = null;
module.exports = {
  cacheDirectory: '/tmp/',
  EncodingType: { UTF8: 'utf8' },
  writeAsStringAsync: async (uri, content) => { captured = content; },
  readAsStringAsync: async () => '',
  __getCaptured: () => captured,
  __clear: () => { captured = null; },
};
