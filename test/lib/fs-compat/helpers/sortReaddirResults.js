function compareDirent(a, b) {
  if (a.name > b.name) return 1;
  if (b.name > a.name) return -1;

  return 0;
}

module.exports = function sortReaddirResults(results) {
  if (!results.length) return results;
  if (results[0].name) return results.sort(compareDirent);
  return results.sort();
};
