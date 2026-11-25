/**
 * Replaces the text between two marker lines and keeps the markers.
 * @param {string} text Whole file text.
 * @param {string} begin Opening marker.
 * @param {string} end Closing marker.
 * @param {string} body New text between the markers.
 * @returns {string} The updated file text.
 */
const replaceBetweenMarkers = (text, begin, end, body) => {
  const start = text.indexOf(begin);
  const stop = text.indexOf(end);
  if (start === -1 || stop === -1 || stop < start) {
    throw new Error(`Markers ${begin} and ${end} not found in order`);
  }
  return `${text.slice(0, start + begin.length)}\n${body}\n${text.slice(stop)}`;
};

export default replaceBetweenMarkers;
