// eslint-disable-next-line no-undef
var kNsPerMsBigInt = typeof BigInt === 'undefined' ? Math.pow(10, 6) : BigInt(Math.pow(10, 6));

module.exports = function patchBigIntStats(stats) {
  // doesn't need patching
  if (typeof stats.atimeMs !== 'bigint' || stats.atimeNs) return stats;

  stats.atimeNs = stats.atimeMs * kNsPerMsBigInt;
  stats.mtimeNs = stats.mtimeMs * kNsPerMsBigInt;
  stats.ctimeNs = stats.ctimeMs * kNsPerMsBigInt;
  stats.birthtimeNs = stats.birthtimeMs * kNsPerMsBigInt;
  return stats;
};
