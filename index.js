'use strict';
normalizeRange.curry = curry;
module.exports = normalizeRange;

function normalizeRange(min, max, value) {
  var maxLessMin = max - min;
  return ((value - min) % maxLessMin + maxLessMin) % maxLessMin + min;
}

function curry(min, max) {
  return function(value) {
    return normalizeRange(min, max, value);
  };
}
