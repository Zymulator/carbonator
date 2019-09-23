const Random = require('./random.js');
const Bubble = require('./bubble.js');
const Hotspot = require('./hotspot.js');

const PLUGIN_NAME = 'carbonate';

const DEFAULT_OPTIONS = {
  animationInterval: 1000 / 24,
  backgroundColor: 'transparent',
  bubbleColor: 'white',
  bubbleDensity: 0.0005,
  bubbleFlutter: 0.1,
  bubbleOpacity: 0.7,
  bubbleRadiusMin: 1,
  bubbleRadiusRange: 2,
  bubbleSpeedMin: 3,
  bubbleSpeedRange: 2,
  hotspotDensity: 0.0025,
  hotspotProbabilityMin: 0.25,
  hotspotProbabilityMax: 0.75,
  hotspotRespawnRate: 1 / (24 * 10),
};

const Carbonator = function (element, options) {
  Object.assign(this, DEFAULT_OPTIONS, options) ;

  this.bubbles = new Set();
  this.hotspots = new Set();

  this.containerElement = element;
  this.canvasElement = document.createElement('canvas');
  this.canvasElement.style['display'] = 'block';
  this.containerElement.appendChild(this.canvasElement);

  this.ctx = this.canvasElement.getContext('2d');

  this.containerElement.style['background-color'] = this.backgroundColor;

  this.width = this.canvasElement.width = this.containerElement.clientWidth;
  this.height = this.canvasElement.height = this.containerElement.clientHeight;

  this.generateBubbles(this.width * this.height * this.bubbleDensity);
  this.generateHotspots(0, this.width);

  this.step();

  setInterval(this.step.bind(this), this.animationInterval);
};

Carbonator.prototype.step = function() {
  cancelAnimationFrame(this.animationFrame);
  this.animationFrame = requestAnimationFrame(function () {
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

      this.generateHotspots(oldWidth, this.width);
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
    this.updateHotspots();

    this.beforeDraw && this.beforeDraw(this.ctx);
    this.draw();
    this.afterDraw && this.afterDraw(this.ctx);
  }.bind(this));
};

Carbonator.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Carbonator.prototype.draw = function () {
  this.ctx.fillStyle = this.bubbleColor;
  this.ctx.globalAlpha = this.bubbleOpacity;

  for (let b of this.bubbles) {
    b.draw(this.ctx);
  }
};

Carbonator.prototype.generateBubble = function(options) {
  this.bubbles.add(new Bubble({
    x: options.x || Random.between(options.xMin || 0, this.width),
    y: options.replace ? this.height : Random.between(options.yMin || 0, this.height),
    radius: Random.between(0, this.bubbleRadiusRange) + this.bubbleRadiusMin,
    speed: options.speed || Random.between(0, this.bubbleSpeedRange) + this.bubbleSpeedMin,
    hotspot: !!options.hotspot,
    flutter: this.bubbleFlutter,
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
    if (b.y < -b.radius || b.x > this.width || b.y > this.height) {
      if (b.y < -b.radius && !b.hotspot) {
        this.generateBubble({ replace: true });
      }
      this.bubbles.delete(b);
    }
  }
};

Carbonator.prototype.generateHotspot = function (xMin, xMax) {
  this.hotspots.add(new Hotspot({
    x: Random.between(xMin, xMax),
    speed: Random.between(0, this.bubbleSpeedRange) + this.bubbleSpeedMin,
    probability: Random.between(this.hotspotProbabilityMin, this.hotspotProbabilityMax),
  }))
};

Carbonator.prototype.generateHotspots = function (xMin, xMax) {
  let count = (xMax - xMin) * this.hotspotDensity;

  if (Math.random() > count - Math.floor(count)) {
    count -= 1;
  }

  for (var i = 0; i < count; i++) {
    this.generateHotspot(xMin, xMax);
  }
};

Carbonator.prototype.updateHotspots = function () {
  for (let h of this.hotspots) {
    if (h.x > this.width) {
      this.hotspots.delete(h);
    } else {
      if (h.generatesBubble()) {
        this.generateBubble({
          x: h.x,
          replace: true,
          hotspot: true,
          speed: h.speed,
        });
      }
      if (Math.random() < this.hotspotRespawnRate) {
        this.hotspots.delete(h);
        this.generateHotspot(0, this.width);
      }
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

Carbonator[PLUGIN_NAME] = function () {
  return new Carbonator(...arguments);
};

module.exports = Carbonator;
