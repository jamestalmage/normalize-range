'use strict';
var assert = require('assert');
var normalizeRange = require('../');

describe('normalize-range', function() {
  var π = Math.PI;

  function close(a, b) {
    return Math.abs(a - b) < 0.00000001;
  }

  function name (val) {
    for (var numerator = 1; numerator <= 10; numerator++) {
      for (var denom = 1; denom <= 10; denom++) {
        if (close(Math.abs(val), (numerator * π / denom))) {
          var s = val < 0 ? '-' : '';
          if (numerator !== 1) {
            s += numerator;
          }
          s += 'π';
          if (denom !== 1) {
            s += '/' + denom;
          }
          return s;
        }
      }
    }
    return '' + val;
  }

  function test(min, max, value, expected, testName) {
    var rangeName = '[' + name(min) + '-' + name(max) + ')';
    testName = testName || (rangeName + ' ' + name(value) + ' === ' + name(expected));
    it(testName, function() {
      var result = normalizeRange(min, max, value);
      if (!close(result, expected)) {
        assert.strictEqual(
          normalizeRange(min, max, value),
          expected,
          rangeName
        );
      }
    });
  }

  var angleCurry = normalizeRange.curry(0, 360);
  function angle(value, expected) {
    test(0, 360, value, expected);

    var message = 'angleCurry(' + value + ') === ' + expected;
    it(message, function() {
      assert.strictEqual(
        angleCurry(value),
        expected,
        message
      );
    });
  }

  function angle2(value, expected) {
    test(-180, 180, value, expected);
  }

  angle(-270, 90);
  angle(-20, 340);
  angle(0, 0);
  angle(20, 20);
  angle(100, 100);
  angle(352.5, 352.5);
  angle(360, 0);
  angle(400, 40);
  angle(720, 0);

  angle2(-200, 160);
  angle2(-181, 179);
  angle2(-180, -180);
  angle2(-20, -20);
  angle2(0, 0);
  angle2(0, 0);

  test(-π, π, -π, -π);
  test(-π, π, 0, 0);
  test(-π, π, 2 * π, 0);
  test(-π, π, 2 * π / 3, 2 * π / 3);
  test(-π, π, 4 * π / 3, -2 * π / 3);
});
