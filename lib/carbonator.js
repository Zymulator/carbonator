const Bubble = require('./bubble.js');

const PLUGIN_NAME = 'carbonate';

let randomBetween = function (min, max) {
  return Math.random() * (max - min) + min;
};

const DEFAULT_OPTIONS = {
  animationInterval: 1000 / 24,
  backgroundColor: 'transparent',
  bubbleColor: 'white',
  bubbleOpacity: 0.7,
  bubbleRadiusMin: 1,
  bubbleRadiusRange: 2,
  bubbleSpeedMin: 3,
  bubbleSpeedRange: 2,
  bubbleDensity: 0.0005,
  // TODO: hotspotDensity (per x pixel)
};

const Carbonator = function (element, options) {
  Object.assign(this, DEFAULT_OPTIONS, options) ;

  this.bubbles = new Set();

  this.containerElement = element;
  this.canvasElement = document.createElement('canvas');
  this.containerElement.appendChild(this.canvasElement);

  this.ctx = this.canvasElement.getContext('2d');

  this.containerElement.style['background-color'] = this.backgroundColor;

  this.width = this.canvasElement.width = this.containerElement.width;
  this.height = this.canvasElement.height = this.containerElement.height;

  this.generateBubbles(this.width * this.height * this.bubbleDensity);

  this.step();

  setInterval(this.step.bind(this), this.animationInterval);
};

Carbonator.prototype.step = function() {
  requestAnimationFrame(function () {
    let oldWidth = this.width;
    let oldHeight = this.height;

    this.width = this.containerElement.clientWidth;
    this.height = this.containerElement.clientHeight;

    let deltaWidth = this.width - oldWidth;
    let deltaHeight = this.height - oldHeight;

    if (deltaWidth > 0) {
      this.canvasElement.width = this.width;
      this.generateBubbles(
        deltaWidth * this.height * this.bubbleDensity,
        { xMin: oldWidth },
      );
    }

    if (deltaHeight > 0) {
      this.canvasElement.height = this.height;
      this.generateBubbles(
        deltaHeight * this.width * this.bubbleDensity,
        { yMin: oldHeight },
      );
    }

    if (deltaHeight > 0 && deltaWidth > 0) {
      this.generateBubbles(
        deltaWidth * deltaHeight * this.bubbleDensity,
        { xMin: oldWidth, yMin: oldHeight },
      );
    }

    this.clear();
    this.updateBubbles();
    this.drawBubbles();
  }.bind(this));
};

Carbonator.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Carbonator.prototype.drawBubbles = function () {
  this.ctx.fillStyle = this.bubbleColor;
  this.ctx.globalAlpha = this.bubbleOpacity;

  for (let b of this.bubbles) {
    b.draw(this.ctx);
  }
};

Carbonator.prototype.generateBubble = function(options) {
  this.bubbles.add(new Bubble({
    x: randomBetween(options.xMin || 0, this.width),
    y: options.replace ? this.height : randomBetween(options.yMin || 0, this.height),
    radius: randomBetween(0, this.bubbleRadiusRange) + this.bubbleRadiusMin,
    speed: randomBetween(0, this.bubbleSpeedRange) + this.bubbleSpeedMin,
  }));
};

Carbonator.prototype.generateBubbles = function (count, options = {}) {
  for(let i = 0; i < count; i++) {
    this.generateBubble(options);
  }
};

Carbonator.prototype.updateBubbles = function () {
  for (let b of this.bubbles) {
    b.update();
    if (b.y < 0 || b.x > this.width || b.y > this.height) {
      if (b.y < 0) {
        this.generateBubble({ replace: true });
      }
      this.bubbles.delete(b);
    }
  }
};

try {
  const jQuery = require('jquery');

  jQuery.fn[PLUGIN_NAME] = function ( options ) {
    return this.each(function () {
      if (!jQuery.data(this, 'plugin_' + PLUGIN_NAME)) {
        jQuery.data(this, 'plugin_' + PLUGIN_NAME, new Carbonator(this, options));
      }
    });
  };
} catch (e) {
  console.log('Carbonator: JQuery not found; not initializing as a JQuery plugin');
}

module.exports = Carbonator;
