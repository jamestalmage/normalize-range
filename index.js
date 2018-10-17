'use strict';
module.exports = {
  wrap: wrapRange,
  average: wrapAverage,
  limit: limitRange,
  validate: validateRange,
  test: testRange,
  curry: curry,
  name: name
};

function linearMap(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function wrapAverage(min, max, values) {
  // Create a vector(x,y) that is the sum of all the unit vector versions of the angles
  var y = values
    .map(a => Math.sin(linearMap(a, min, max, 0, Math.PI * 2)))
    .reduce((a, b) => a + b);
  var x = values
    .map(a => Math.cos(linearMap(a, min, max, 0, Math.PI * 2)))
    .reduce((a, b) => a + b);

  // If the resulting vector(x,y) is very short, return undefiend
  if (x ** 2 + y ** 2 < Number.EPSILON ** 2) return;

  return wrapRange(
    min,
    max,
    linearMap(Math.atan2(y, x), 0, Math.PI * 2, min, max)
  );
}

function wrapRange(min, max, value) {
  var maxLessMin = max - min;
  return ((value - min) % maxLessMin + maxLessMin) % maxLessMin + min;
}

function limitRange(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

function validateRange(min, max, value, minExclusive, maxExclusive) {
  if (!testRange(min, max, value, minExclusive, maxExclusive)) {
    throw new Error(value + ' is outside of range [' + min + ',' + max + ')');
  }
  return value;
}

function testRange(min, max, value, minExclusive, maxExclusive) {
  return !(
       value < min ||
       value > max ||
       (maxExclusive && (value === max)) ||
       (minExclusive && (value === min))
  );
}

function name(min, max, minExcl, maxExcl) {
  return (minExcl ? '(' : '[') + min + ',' + max + (maxExcl ? ')' : ']');
}

function curry(min, max, minExclusive, maxExclusive) {
  var boundNameFn = name.bind(null, min, max, minExclusive, maxExclusive);
  return {
    wrap: wrapRange.bind(null, min, max),
    average: wrapAverage.bind(null, min, max),
    limit: limitRange.bind(null, min, max),
    validate: function(value) {
      return validateRange(min, max, value, minExclusive, maxExclusive);
    },
    test: function(value) {
      return testRange(min, max, value, minExclusive, maxExclusive);
    },
    toString: boundNameFn,
    name: boundNameFn
  };
}
