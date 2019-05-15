# Carbonator

Carbonate the web.

JQuery plugin based on [bubblr](https://github.com/mikeyhogarth/bubblr) by
Mikey Hogarth.

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
| `bubbleOpacity` | opacity of the bubbles | `0.7` |
| `bubbleRadiusMin` | minimum range of each bubble (px) | `1` |
| `bubbleRadiusRange` | possible bubble radius in excess of minimum | `2` |
| `bubbleSpeedMin` | minimum movement speed of each bubble (px/frame)| `3` |
| `bubbleSpeedRange` | possible bubble movement speed in excess of minimum | `2` |
| `bubbleDensity` | number of bubbles to draw per pixel of canvas area | `0.0005,` |
