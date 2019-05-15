const Random = {
  between: function (min, max) {
    return Math.random() * (max - min) + min;
  },
};

module.exports = Random;
