# Carbonator

Carbonate the web.

JQuery plugin based on [bubblr](https://github.com/mikeyhogarth/bubblr) by Mikey Hogarth.

## Usage

Install the library:

```
npm install --save carbonator
```

Require the module:

```javascript
require('carbonator');
```

JQuery should now be able to initialize carbonation on an HTML `div` via the `carbonate` function:

```javascript
$('div.flat').carbonate();
```

A `canvas` element will be created and appended to the `div`, and will resize automatically to match its parent.

### Options

The following options may be passed to the `carbonate` function:

| option | description | default |
|-|-|-|
| `animationInterval` | inverval between animation frame requests (ms) | `1000 / 24` (24 FPS) |
| `backgroundColor` | background color of the container element | `'transparent'` |
| `bubbleColor` | color of the bubbles | `'white'` |
| `bubbleDensity` | number of bubbles to draw per pixel of canvas area | `0.0005` |
| `bubbleFlutter` | maximum range bubble may move in either direction (px/frame) | `0.1` |
| `bubbleGrowthFactorMin` | minimum bubble growth rate | `1` (no growth) |
| `bubbleGrowthFactorMin` | possible bubble growth rate in excess of minimum | `0.002` |
| `bubbleOpacity` | opacity of the bubbles | `0.7` |
| `bubbleRadiusMin` | minimum range of each bubble (px) | `1` |
| `bubbleRadiusRange` | possible bubble radius in excess of minimum | `2` |
| `bubbleSpeedMin` | minimum movement speed of each bubble (px/frame)| `3` |
| `bubbleSpeedRange` | possible bubble movement speed in excess of minimum | `2` |
| `hotspotDensity` | number of hotspots to generate per pixel of width | `0.0025` |
| `hotspotProbabilityMin` | minimum chance per frame for hotspot to generate bubble | `0.25` |
| `hotspotProbabilityMax` | maximum chance per frame for hotspot to generate bubble | `0.75` |
| `hotspotRespawnRate` | chance per frame that hotspot will be deleted and regenerated at a different location | `1 / (24 * 10)` (about every 10 seconds) |
| `beforeDraw` | `function` to call before drawing each frame (passed `Canvas​Rendering​Context2D`) † | `undefined` |
| `afterDraw` | `function` to call after drawing each frame (passed `Canvas​Rendering​Context2D`) † | `undefined` |

† callbacks are bound to the `Carbonator` instance; internal properties may therefore be accessed through `this`, but such behavior may be subject to breaking changes

### You Might Not Need JQuery

While this library is designed to be used as a JQuery plugin, JQuery is not required and is not included as a dependency.  Alternatively, the constructor may be accessed directly from the imported module, or through a function attached to itself:

```javascript
const Carbonator = require('carbonator');

// call via constructor
new Carbonator(document.querySelector('div.flat'), options);

// call via factory method
Carbonator.carbonate(document.querySelector('div.flat'), options);
```
