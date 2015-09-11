# normalize-range 

Ensure a value that within a range. Values outside the range are "wrapped".
Angles (0˚ - 360˚) are a good example. 

[![Build Status](https://travis-ci.org/jamestalmage/normalize-range.svg?branch=master)](https://travis-ci.org/jamestalmage/normalize-range)
[![Coverage Status](https://coveralls.io/repos/jamestalmage/normalize-range/badge.svg?branch=master&service=github)](https://coveralls.io/github/jamestalmage/normalize-range?branch=master)
[![Code Climate](https://codeclimate.com/github/jamestalmage/normalize-range/badges/gpa.svg)](https://codeclimate.com/github/jamestalmage/normalize-range)
[![Dependency Status](https://david-dm.org/jamestalmage/normalize-range.svg)](https://david-dm.org/jamestalmage/normalize-range)
[![devDependency Status](https://david-dm.org/jamestalmage/normalize-range/dev-status.svg)](https://david-dm.org/jamestalmage/normalize-range#info=devDependencies)

[![NPM](https://nodei.co/npm/normalize-range.png)](https://nodei.co/npm/normalize-range/)

## Usage

```js
var normalizeRange = require('normalize-range');

normalizeRange(0, 360, 400);
//=> 40

normalizeRange(0, 360, -90);
//=> 270

// There is a convenient currying function
var normalizeAngle = normalizeRange.curry(0, 360);

normalizeRange(-30);
//=> 360
```
## API

### normalizeRange(min, max, value)

Normalizes a value to fit in a range. Ranges are between `min` (inclusively) and `max` (exclusively).
For wrapping purposes we assume `max` is functionally equivalent to `min`, and that `max + 1 => min + 1`.


```js
normalizeRange(0, 360, 0) === 0;
normalizeRange(0, 360, 360) === 0;
normalizeRange(0, 360, 361) === 1;
normalizeRange(0, 360, -1) === 359;
```

You are not restricted to whole numbers, and ranges can be negative.

```js
var π = Math.PI;

normalizeRange(-π, π, 0) === 0;
normalizeRange(-π, π, π) === 0;
normalizeRange(-π, π, 4 * π / 3) === -2 * π / 3;

```

#### min

*Required*  
Type: `number`

The minimum value (inclusive) of the range.

#### max

*Required*  
Type: `number`

The maximum value (exclusive) of the range.

#### value

*Required*  
Type: `number`

The value to be normalized.

#### returns

Type: `number`

The normalized value.

### normalizeRange.curry(min, max)

Convenience method for currying the first two values.

```js
var normalizeAngle = require('normalize-range').curry(-180, 180);

normalizeAngle(270)
//=> -90
```

## Building and Releasing

- `npm test`: tests, linting, coverage and style checks.
- `npm run watch`: autotest mode for active development.
- `npm run debug`: run tests without coverage (istanbul can obscure line #'s) 

Release via `cut-release` tool.

## License

MIT © [James Talmage](http://github.com/jamestalmage)
