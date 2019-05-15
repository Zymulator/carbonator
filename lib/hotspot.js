const DEFAULT_OPTIONS = {
  x: 0,
  probability: 0.5,
};

const Hotspot = function (options = {}) {
  Object.assign(this, DEFAULT_OPTIONS, options);
};

Hotspot.prototype.generatesBubble = function () {
  return Math.random() > this.probability;
};

module.exports = Hotspot;
