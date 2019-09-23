const Random = require('./random.js');

const DEFAULT_OPTIONS = {
  x: 0,
  y: 0,
  radius: 1,
  speed: 1,
  growthFactor: 1,
  hotspot: false,
};

const Bubble = function (options = {}) {
  Object.assign(this, DEFAULT_OPTIONS, options);
};

Bubble.prototype.currentRadius = function () {
  return this.radius / Math.pow(this.growthFactor, this.y / this.speed);
};

Bubble.prototype.update = function () {
  this.y -= this.speed;
  this.x += Random.between(-this.flutter, this.flutter);
};

Bubble.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.currentRadius(), 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
};

module.exports = Bubble;
