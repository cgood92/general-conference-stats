module.exports = function talkTextLoader(source) {
  return JSON.stringify(JSON.parse(source).map(({ references, ...talk }) => talk));
};
