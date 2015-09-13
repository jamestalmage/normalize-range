'use strict';
var assert = require('assert');
var ranges = require('../');
var namePi = require('stringify-pi');
var almostEqual = require('almost-equal');

var π = Math.PI;


function close(a, b) {
  return almostEqual(a, b, almostEqual.DBL_EPSILON, almostEqual.DBL_EPSILON);
}

function names(type, min, max, value, expected, minExcl, maxExcl) {
  var lb = minExcl ? '(' : '[';
  var rb = maxExcl ? ')' : ']';
  var rangeName = type +  ': ' + lb + namePi(min) + ',' + namePi(max) + rb;
  var testName = rangeName + ' ' + namePi(value) + ' === ' + namePi(expected);

  return {
    range: rangeName,
    test: testName
  };
}

function _test(type, min, max, value, expected, minExcl, maxExcl) {
  var n = names(type, min, max, value, expected, minExcl, maxExcl);
  it(n.test, function() {
    var result = ranges[type](min, max, value, minExcl, maxExcl);
    if (!close(result, expected)) {
      assert.strictEqual(
        result,
        expected,
        n.range
      );
    }
  });
}

describe('wrap ', function() {
  function test(min, max, value, expected) {
    return _test('wrap', min, max, value, expected, false, true);
  }

  var angleWrap = ranges.curry(0, 360).wrap;
  function angle(value, expected) {
    test(0, 360, value, expected);

    var message = 'angleWrap(' + value + ') === ' + expected;
    it(message, function() {
      assert.strictEqual(
        angleWrap(value),
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

describe('limit', function() {
  var test = _test.bind(null, 'limit');

  test(0, 10, -1, 0);
  test(0, 10, 0, 0);
  test(0, 10, 5, 5);
  test(0, 10, 10, 10);
  test(0, 10, 11, 10);
});

describe('test', function() {
  function isOk(min, max, value, minExcl, maxExcl, ok) {
    var n = names('test', min, max, value, ok ? 'ok' : 'notOk', minExcl, maxExcl);

    it(n.test, function() {
      assert.strictEqual(
        !!ok,
        ranges.test(min, max, value, minExcl, maxExcl),
        n.test
      );
    });
  }

  function ok(min, max, value, minExcl, maxExcl) {
    isOk(min, max, value, minExcl, maxExcl, true);
  }

  function notOk(min, max, value, minExcl, maxExcl) {
    isOk(min, max, value, minExcl, maxExcl, false);
  }

  notOk(0, 10, -1);
  notOk(0, 10, 0, true);
  ok(0, 10, 0);
  ok(0, 10, 9);
  ok(0, 10, 10);
  notOk(0, 10, 10, false, true);
  notOk(0, 10, 11);

  it('curried', function() {
    var c = ranges.curry(0, 10, false, true).test;
    assert.strictEqual(c(0), true);
    assert.strictEqual(c(10), false);
    assert.strictEqual(c(8), true);
    assert.strictEqual(c(11), false);
  });
});

describe('validate', function() {

  function isOk(min, max, value, minExcl, maxExcl, ok) {
    var n = names('test', min, max, value, ok ? 'ok' : 'notOk', minExcl, maxExcl);

    it(n.test, function() {
      if (ok) {
        assert.strictEqual(
          ranges.validate(min, max, value, minExcl, maxExcl),
          value,
          n.test
        );
      } else {
        assert.throws(function() {
          ranges.validate(min, max, value, minExcl, maxExcl);
        }, null, n.test);
      }

    });
  }

  function ok(min, max, value, minExcl, maxExcl) {
    isOk(min, max, value, minExcl, maxExcl, true);
  }

  function notOk(min, max, value, minExcl, maxExcl) {
    isOk(min, max, value, minExcl, maxExcl, false);
  }

  notOk(0, 10, -1);
  notOk(0, 10, 0, true);
  ok(0, 10, 0);
  ok(0, 10, 9);
  ok(0, 10, 10);
  notOk(0, 10, 10, false, true);
  notOk(0, 10, 11);

  it('curried', function() {
    var c = ranges.curry(0, 10, true, false).validate;
    assert.throws(function() {
      c(0);
    });
    assert.strictEqual(c(10), 10);
    assert.strictEqual(c(8), 8);
    assert.throws(function() {
      c(11);
    });
  });
});

describe('name', function() {
  function test(expected, varargs) {
    var args = Array.prototype.slice.call(arguments, 1);
    it(expected, function() {
      assert.strictEqual(
        ranges.name.apply(ranges, args),
        expected
      );
    });
  }

  test('[0,10]', 0, 10);
  test('[6,7]', 6, 7);
  test('(-10,7]', -10, 7, true);
  test('[-50,13)', -50, 13, false, true);
  test('(-1,1)', -1, 1, true, true);

  it('toString() on curried objs', function() {
    assert.strictEqual(
      '' + ranges.curry(1, 3, true),
      '(1,3]'
    );
  });
});
