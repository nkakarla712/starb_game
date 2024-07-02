(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"object-assign":7,"util/":4}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":3,"_process":16,"inherits":2}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

module.exports = exports = globalObject.fetch;

// Needed for TypeScript and Webpack.
if (globalObject.fetch) {
	exports.default = globalObject.fetch.bind(globalObject);
}

exports.Headers = globalObject.Headers;
exports.Request = globalObject.Request;
exports.Response = globalObject.Response;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],8:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.makeNonterminalConverters = void 0;
const types_1 = require("./types");
const assert_1 = __importDefault(require("assert"));
const parser_1 = require("./parser");
/**
 * Converts string to nonterminal.
 * @param <NT> nonterminal enumeration
 * @param nonterminals required to be the runtime object for the <NT> type parameter
 * @return a pair of converters { nonterminalToString, stringToNonterminal }
 *              one takes a string (any alphabetic case) and returns the nonterminal it names
 *              the other takes a nonterminal and returns its string name, using the Typescript source capitalization.
 *         Both converters throw GrammarError if the conversion can't be done.
 * @throws GrammarError if NT has a name collision (two nonterminal names that differ only in capitalization,
 *       e.g. ROOT and root).
 */
function makeNonterminalConverters(nonterminals) {
    // "canonical name" is a case-independent name (canonicalized to lowercase)
    // "source name" is the name capitalized as in the Typescript source definition of NT
    const nonterminalForCanonicalName = new Map();
    const sourceNameForNonterminal = new Map();
    for (const key of Object.keys(nonterminals)) {
        // in Typescript, the nonterminals object combines both a NT->name mapping and name->NT mapping.
        // https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime
        // So filter just to keys that are valid Parserlib nonterminal names
        if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(key)) {
            const sourceName = key;
            const canonicalName = key.toLowerCase();
            const nt = nonterminals[sourceName];
            if (nonterminalForCanonicalName.has(canonicalName)) {
                throw new types_1.GrammarError('name collision in nonterminal enumeration: '
                    + sourceNameForNonterminal.get(nonterminalForCanonicalName.get(canonicalName))
                    + ' and ' + sourceName
                    + ' are the same when compared case-insensitively');
            }
            nonterminalForCanonicalName.set(canonicalName, nt);
            sourceNameForNonterminal.set(nt, sourceName);
        }
    }
    //console.error(sourceNameForNonterminal);
    function stringToNonterminal(name) {
        const canonicalName = name.toLowerCase();
        if (!nonterminalForCanonicalName.has(canonicalName)) {
            throw new types_1.GrammarError('grammar uses nonterminal ' + name + ', which is not found in the nonterminal enumeration passed to compile()');
        }
        return nonterminalForCanonicalName.get(canonicalName);
    }
    function nonterminalToString(nt) {
        if (!sourceNameForNonterminal.has(nt)) {
            throw new types_1.GrammarError('nonterminal ' + nt + ' is not found in the nonterminal enumeration passed to compile()');
        }
        return sourceNameForNonterminal.get(nt);
    }
    return { stringToNonterminal, nonterminalToString };
}
exports.makeNonterminalConverters = makeNonterminalConverters;
var GrammarNT;
(function (GrammarNT) {
    GrammarNT[GrammarNT["GRAMMAR"] = 0] = "GRAMMAR";
    GrammarNT[GrammarNT["PRODUCTION"] = 1] = "PRODUCTION";
    GrammarNT[GrammarNT["SKIPBLOCK"] = 2] = "SKIPBLOCK";
    GrammarNT[GrammarNT["UNION"] = 3] = "UNION";
    GrammarNT[GrammarNT["CONCATENATION"] = 4] = "CONCATENATION";
    GrammarNT[GrammarNT["REPETITION"] = 5] = "REPETITION";
    GrammarNT[GrammarNT["REPEATOPERATOR"] = 6] = "REPEATOPERATOR";
    GrammarNT[GrammarNT["UNIT"] = 7] = "UNIT";
    GrammarNT[GrammarNT["NONTERMINAL"] = 8] = "NONTERMINAL";
    GrammarNT[GrammarNT["TERMINAL"] = 9] = "TERMINAL";
    GrammarNT[GrammarNT["QUOTEDSTRING"] = 10] = "QUOTEDSTRING";
    GrammarNT[GrammarNT["NUMBER"] = 11] = "NUMBER";
    GrammarNT[GrammarNT["RANGE"] = 12] = "RANGE";
    GrammarNT[GrammarNT["UPPERBOUND"] = 13] = "UPPERBOUND";
    GrammarNT[GrammarNT["LOWERBOUND"] = 14] = "LOWERBOUND";
    GrammarNT[GrammarNT["CHARACTERSET"] = 15] = "CHARACTERSET";
    GrammarNT[GrammarNT["ANYCHAR"] = 16] = "ANYCHAR";
    GrammarNT[GrammarNT["CHARACTERCLASS"] = 17] = "CHARACTERCLASS";
    GrammarNT[GrammarNT["WHITESPACE"] = 18] = "WHITESPACE";
    GrammarNT[GrammarNT["ONELINECOMMENT"] = 19] = "ONELINECOMMENT";
    GrammarNT[GrammarNT["BLOCKCOMMENT"] = 20] = "BLOCKCOMMENT";
    GrammarNT[GrammarNT["SKIP"] = 21] = "SKIP";
})(GrammarNT || (GrammarNT = {}));
;
function ntt(nonterminal) {
    return (0, parser_1.nt)(nonterminal, GrammarNT[nonterminal]);
}
const grammarGrammar = new Map();
// grammar ::= ( production | skipBlock )+
grammarGrammar.set(GrammarNT.GRAMMAR, (0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.star)((0, parser_1.cat)((0, parser_1.or)(ntt(GrammarNT.PRODUCTION), ntt(GrammarNT.SKIPBLOCK)), ntt(GrammarNT.SKIP)))));
// skipBlock ::= '@skip' nonterminal '{' production* '}'
grammarGrammar.set(GrammarNT.SKIPBLOCK, (0, parser_1.cat)((0, parser_1.str)("@skip"), ntt(GrammarNT.SKIP), (0, parser_1.failfast)(ntt(GrammarNT.NONTERMINAL)), ntt(GrammarNT.SKIP), (0, parser_1.str)('{'), (0, parser_1.failfast)((0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.PRODUCTION), ntt(GrammarNT.SKIP))), (0, parser_1.str)('}')))));
// production ::= nonterminal '::=' union ';'
grammarGrammar.set(GrammarNT.PRODUCTION, (0, parser_1.cat)(ntt(GrammarNT.NONTERMINAL), ntt(GrammarNT.SKIP), (0, parser_1.str)("::="), (0, parser_1.failfast)((0, parser_1.cat)(ntt(GrammarNT.SKIP), ntt(GrammarNT.UNION), ntt(GrammarNT.SKIP), (0, parser_1.str)(';')))));
// union :: = concatenation ('|' concatenation)*
grammarGrammar.set(GrammarNT.UNION, (0, parser_1.cat)(ntt(GrammarNT.CONCATENATION), (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.str)('|'), ntt(GrammarNT.SKIP), ntt(GrammarNT.CONCATENATION)))));
// concatenation :: = repetition* 
grammarGrammar.set(GrammarNT.CONCATENATION, (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.REPETITION), ntt(GrammarNT.SKIP))));
// repetition ::= unit repeatOperator?
grammarGrammar.set(GrammarNT.REPETITION, (0, parser_1.cat)(ntt(GrammarNT.UNIT), ntt(GrammarNT.SKIP), (0, parser_1.option)(ntt(GrammarNT.REPEATOPERATOR))));
// repeatOperator ::= [*+?] | '{' ( number | range | upperBound | lowerBound ) '}'
grammarGrammar.set(GrammarNT.REPEATOPERATOR, (0, parser_1.or)((0, parser_1.regex)("[*+?]"), (0, parser_1.cat)((0, parser_1.str)("{"), (0, parser_1.or)(ntt(GrammarNT.NUMBER), ntt(GrammarNT.RANGE), ntt(GrammarNT.UPPERBOUND), ntt(GrammarNT.LOWERBOUND)), (0, parser_1.str)("}"))));
// number ::= [0-9]+
grammarGrammar.set(GrammarNT.NUMBER, (0, parser_1.plus)((0, parser_1.regex)("[0-9]")));
// range ::= number ',' number
grammarGrammar.set(GrammarNT.RANGE, (0, parser_1.cat)(ntt(GrammarNT.NUMBER), (0, parser_1.str)(","), ntt(GrammarNT.NUMBER)));
// upperBound ::= ',' number
grammarGrammar.set(GrammarNT.UPPERBOUND, (0, parser_1.cat)((0, parser_1.str)(","), ntt(GrammarNT.NUMBER)));
// lowerBound ::= number ','
grammarGrammar.set(GrammarNT.LOWERBOUND, (0, parser_1.cat)(ntt(GrammarNT.NUMBER), (0, parser_1.str)(",")));
// unit ::= nonterminal | terminal | '(' union ')'
grammarGrammar.set(GrammarNT.UNIT, (0, parser_1.or)(ntt(GrammarNT.NONTERMINAL), ntt(GrammarNT.TERMINAL), (0, parser_1.cat)((0, parser_1.str)('('), ntt(GrammarNT.SKIP), ntt(GrammarNT.UNION), ntt(GrammarNT.SKIP), (0, parser_1.str)(')'))));
// nonterminal ::= [a-zA-Z_][a-zA-Z_0-9]*
grammarGrammar.set(GrammarNT.NONTERMINAL, (0, parser_1.cat)((0, parser_1.regex)("[a-zA-Z_]"), (0, parser_1.star)((0, parser_1.regex)("[a-zA-Z_0-9]"))));
// terminal ::= quotedString | characterSet | anyChar | characterClass
grammarGrammar.set(GrammarNT.TERMINAL, (0, parser_1.or)(ntt(GrammarNT.QUOTEDSTRING), ntt(GrammarNT.CHARACTERSET), ntt(GrammarNT.ANYCHAR), ntt(GrammarNT.CHARACTERCLASS)));
// quotedString ::= "'" ([^'\r\n\\] | '\\' . )* "'" | '"' ([^"\r\n\\] | '\\' . )* '"'
grammarGrammar.set(GrammarNT.QUOTEDSTRING, (0, parser_1.or)((0, parser_1.cat)((0, parser_1.str)("'"), (0, parser_1.failfast)((0, parser_1.star)((0, parser_1.or)((0, parser_1.regex)("[^'\r\n\\\\]"), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)("."))))), (0, parser_1.str)("'")), (0, parser_1.cat)((0, parser_1.str)('"'), (0, parser_1.failfast)((0, parser_1.star)((0, parser_1.or)((0, parser_1.regex)('[^"\r\n\\\\]'), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)("."))))), (0, parser_1.str)('"'))));
// characterSet ::= '[' ([^\]\r\n\\] | '\\' . )+ ']'
grammarGrammar.set(GrammarNT.CHARACTERSET, (0, parser_1.cat)((0, parser_1.str)('['), (0, parser_1.failfast)((0, parser_1.cat)((0, parser_1.plus)((0, parser_1.or)((0, parser_1.regex)("[^\\]\r\n\\\\]"), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)(".")))))), (0, parser_1.str)(']')));
// anyChar ::= '.'
grammarGrammar.set(GrammarNT.ANYCHAR, (0, parser_1.str)('.'));
// characterClass ::= '\\' [dsw]
grammarGrammar.set(GrammarNT.CHARACTERCLASS, (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.failfast)((0, parser_1.regex)("[dsw]"))));
// whitespace ::= [ \t\r\n]
grammarGrammar.set(GrammarNT.WHITESPACE, (0, parser_1.regex)("[ \t\r\n]"));
grammarGrammar.set(GrammarNT.ONELINECOMMENT, (0, parser_1.cat)((0, parser_1.str)("//"), (0, parser_1.star)((0, parser_1.regex)("[^\r\n]")), (0, parser_1.or)((0, parser_1.str)("\r\n"), (0, parser_1.str)('\n'), (0, parser_1.str)('\r'))));
grammarGrammar.set(GrammarNT.BLOCKCOMMENT, (0, parser_1.cat)((0, parser_1.str)("/*"), (0, parser_1.cat)((0, parser_1.star)((0, parser_1.regex)("[^*]")), (0, parser_1.str)('*')), (0, parser_1.star)((0, parser_1.cat)((0, parser_1.regex)("[^/]"), (0, parser_1.star)((0, parser_1.regex)("[^*]")), (0, parser_1.str)('*'))), (0, parser_1.str)('/')));
grammarGrammar.set(GrammarNT.SKIP, (0, parser_1.star)((0, parser_1.or)(ntt(GrammarNT.WHITESPACE), ntt(GrammarNT.ONELINECOMMENT), ntt(GrammarNT.BLOCKCOMMENT))));
const grammarParser = new parser_1.InternalParser(grammarGrammar, ntt(GrammarNT.GRAMMAR), (nt) => GrammarNT[nt]);
/**
 * Compile a Parser from a grammar represented as a string.
 * @param <NT> a Typescript Enum with one symbol for each nonterminal used in the grammar,
 *        matching the nonterminals when compared case-insensitively (so ROOT and Root and root are the same).
 * @param grammar the grammar to use
 * @param nonterminals the runtime object of the nonterminals enum. For example, if
 *             enum Nonterminals { root, a, b, c };
 *        then Nonterminals must be explicitly passed as this runtime parameter
 *              compile(grammar, Nonterminals, Nonterminals.root);
 *        (in addition to being implicitly used for the type parameter NT)
 * @param rootNonterminal the desired root nonterminal in the grammar
 * @return a parser for the given grammar that will start parsing at rootNonterminal.
 * @throws ParseError if the grammar has a syntax error
 */
function compile(grammar, nonterminals, rootNonterminal) {
    const { stringToNonterminal, nonterminalToString } = makeNonterminalConverters(nonterminals);
    const grammarTree = (() => {
        try {
            return grammarParser.parse(grammar);
        }
        catch (e) {
            throw (e instanceof types_1.InternalParseError) ? new types_1.GrammarError("grammar doesn't compile", e) : e;
        }
    })();
    const definitions = new Map();
    const nonterminalsDefined = new Set(); // on lefthand-side of some production
    const nonterminalsUsed = new Set(); // on righthand-side of some production
    // productions outside @skip blocks
    makeProductions(grammarTree.childrenByName(GrammarNT.PRODUCTION), null);
    // productions inside @skip blocks
    for (const skipBlock of grammarTree.childrenByName(GrammarNT.SKIPBLOCK)) {
        makeSkipBlock(skipBlock);
    }
    for (const nt of nonterminalsUsed) {
        if (!nonterminalsDefined.has(nt)) {
            throw new types_1.GrammarError("grammar is missing a definition for " + nonterminalToString(nt));
        }
    }
    if (!nonterminalsDefined.has(rootNonterminal)) {
        throw new types_1.GrammarError("grammar is missing a definition for the root nonterminal " + nonterminalToString(rootNonterminal));
    }
    return new parser_1.InternalParser(definitions, (0, parser_1.nt)(rootNonterminal, nonterminalToString(rootNonterminal)), nonterminalToString);
    function makeProductions(productions, skip) {
        for (const production of productions) {
            const nonterminalName = production.childrenByName(GrammarNT.NONTERMINAL)[0].text;
            const nonterminal = stringToNonterminal(nonterminalName);
            nonterminalsDefined.add(nonterminal);
            let expression = makeGrammarTerm(production.childrenByName(GrammarNT.UNION)[0], skip);
            if (skip)
                expression = (0, parser_1.cat)(skip, expression, skip);
            if (definitions.has(nonterminal)) {
                // grammar already has a production for this nonterminal; or expression onto it
                definitions.set(nonterminal, (0, parser_1.or)(definitions.get(nonterminal), expression));
            }
            else {
                definitions.set(nonterminal, expression);
            }
        }
    }
    function makeSkipBlock(skipBlock) {
        const nonterminalName = skipBlock.childrenByName(GrammarNT.NONTERMINAL)[0].text;
        const nonterminal = stringToNonterminal(nonterminalName);
        nonterminalsUsed.add(nonterminal);
        const skipTerm = (0, parser_1.skip)((0, parser_1.nt)(nonterminal, nonterminalName));
        makeProductions(skipBlock.childrenByName(GrammarNT.PRODUCTION), skipTerm);
    }
    function makeGrammarTerm(tree, skip) {
        switch (tree.name) {
            case GrammarNT.UNION: {
                const childexprs = tree.childrenByName(GrammarNT.CONCATENATION).map(child => makeGrammarTerm(child, skip));
                return childexprs.length == 1 ? childexprs[0] : (0, parser_1.or)(...childexprs);
            }
            case GrammarNT.CONCATENATION: {
                let childexprs = tree.childrenByName(GrammarNT.REPETITION).map(child => makeGrammarTerm(child, skip));
                if (skip) {
                    // insert skip between each pair of children
                    let childrenWithSkips = [];
                    for (const child of childexprs) {
                        if (childrenWithSkips.length > 0)
                            childrenWithSkips.push(skip);
                        childrenWithSkips.push(child);
                    }
                    childexprs = childrenWithSkips;
                }
                return (childexprs.length == 1) ? childexprs[0] : (0, parser_1.cat)(...childexprs);
            }
            case GrammarNT.REPETITION: {
                const unit = makeGrammarTerm(tree.childrenByName(GrammarNT.UNIT)[0], skip);
                const op = tree.childrenByName(GrammarNT.REPEATOPERATOR)[0];
                if (!op) {
                    return unit;
                }
                else {
                    const unitWithSkip = skip ? (0, parser_1.cat)(unit, skip) : unit;
                    //console.log('op is', op);
                    switch (op.text) {
                        case '*': return (0, parser_1.star)(unitWithSkip);
                        case '+': return (0, parser_1.plus)(unitWithSkip);
                        case '?': return (0, parser_1.option)(unitWithSkip);
                        default: {
                            // op is {n,m} or one of its variants
                            const range = op.children[0];
                            switch (range.name) {
                                case GrammarNT.NUMBER: {
                                    const n = parseInt(range.text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(n, n));
                                    break;
                                }
                                case GrammarNT.RANGE: {
                                    const n = parseInt(range.children[0].text);
                                    const m = parseInt(range.children[1].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(n, m));
                                    break;
                                }
                                case GrammarNT.UPPERBOUND: {
                                    const m = parseInt(range.children[0].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(0, m));
                                    break;
                                }
                                case GrammarNT.LOWERBOUND: {
                                    const n = parseInt(range.children[0].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.AtLeast(n));
                                    break;
                                }
                                default:
                                    throw new Error('internal error: unknown range: ' + range.name);
                            }
                        }
                    }
                }
            }
            case GrammarNT.UNIT:
                return makeGrammarTerm(tree.childrenByName(GrammarNT.NONTERMINAL)[0]
                    || tree.childrenByName(GrammarNT.TERMINAL)[0]
                    || tree.childrenByName(GrammarNT.UNION)[0], skip);
            case GrammarNT.NONTERMINAL: {
                const nonterminal = stringToNonterminal(tree.text);
                nonterminalsUsed.add(nonterminal);
                return (0, parser_1.nt)(nonterminal, tree.text);
            }
            case GrammarNT.TERMINAL:
                switch (tree.children[0].name) {
                    case GrammarNT.QUOTEDSTRING:
                        return (0, parser_1.str)(stripQuotesAndReplaceEscapeSequences(tree.text));
                    case GrammarNT.CHARACTERSET: // e.g. [abc]
                    case GrammarNT.ANYCHAR: // e.g.  .
                    case GrammarNT.CHARACTERCLASS: // e.g.  \d  \s  \w
                        return (0, parser_1.regex)(tree.text);
                    default:
                        throw new Error('internal error: unknown literal: ' + tree.children[0]);
                }
            default:
                throw new Error('internal error: unknown grammar rule: ' + tree.name);
        }
    }
    /**
     * Strip starting and ending quotes.
     * Replace \t, \r, \n with their character codes.
     * Replaces all other \x with literal x.
     */
    function stripQuotesAndReplaceEscapeSequences(s) {
        (0, assert_1.default)(s[0] == '"' || s[0] == "'");
        s = s.substring(1, s.length - 1);
        s = s.replace(/\\(.)/g, (match, escapedChar) => {
            switch (escapedChar) {
                case 't': return '\t';
                case 'r': return '\r';
                case 'n': return '\n';
                default: return escapedChar;
            }
        });
        return s;
    }
}
exports.compile = compile;

},{"./parser":10,"./types":12,"assert":1}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = exports.snippet = exports.escapeForReading = exports.toColumn = exports.toLine = exports.describeLocation = exports.makeErrorMessage = void 0;
/**
 * Make a human-readable error message explaining a parse error and where it was found in the input.
 * @param message brief message stating what error occurred
 * @param nonterminalName name of deepest nonterminal that parser was trying to match when parse failed
 * @param expectedText human-readable description of what string literals the parser was expecting there;
 *            e.g. ";", "[ \r\n\t]", "1|2|3"
 * @param stringBeingParsed original input to parse()
 * @param pos offset in stringBeingParsed where error occurred
 * @param nameOfStringBeingParsed human-readable description of where stringBeingParsed came from;
 *             e.g. "grammar" if stringBeingParsed was the input to Parser.compile(),
 *             or "string being parsed" if stringBeingParsed was the input to Parser.parse()
 * @return a multiline human-readable message that states the error, its location in the input,
 *         what text was expected and what text was actually found.
 */
function makeErrorMessage(message, nonterminalName, expectedText, stringBeingParsed, pos, nameOfStringBeingParsed) {
    let result = message;
    if (result.length > 0)
        result += "\n";
    result +=
        "Error at " + describeLocation(stringBeingParsed, pos) + " of " + nameOfStringBeingParsed + "\n"
            + "  trying to match " + nonterminalName.toUpperCase() + "\n"
            + "  expected " + escapeForReading(expectedText, "")
            + ((stringBeingParsed.length > 0)
                ? "\n   but saw " + snippet(stringBeingParsed, pos)
                : "");
    return result;
}
exports.makeErrorMessage = makeErrorMessage;
/**
 * @param string to describe
 * @param pos offset in string, 0<=pos<string.length()
 * @return a human-readable description of the location of the character at offset pos in string
 * (using offset and/or line/column if appropriate)
 */
function describeLocation(s, pos) {
    let result = "offset " + pos;
    if (s.indexOf('\n') != -1) {
        result += " (line " + toLine(s, pos) + " column " + toColumn(s, pos) + ")";
    }
    return result;
}
exports.describeLocation = describeLocation;
/**
 * Translates a string offset into a line number.
 * @param string in which offset occurs
 * @param pos offset in string, 0<=pos<string.length()
 * @return the 1-based line number of the character at offset pos in string,
 * as if string were being viewed in a text editor
 */
function toLine(s, pos) {
    let lineCount = 1;
    for (let newline = s.indexOf('\n'); newline != -1 && newline < pos; newline = s.indexOf('\n', newline + 1)) {
        ++lineCount;
    }
    return lineCount;
}
exports.toLine = toLine;
/**
 * Translates a string offset into a column number.
 * @param string in which offset occurs
 * @param pos offset in string, 0<=pos<string.length()
 * @return the 1-based column number of the character at offset pos in string,
 * as if string were being viewed in a text editor with tab size 1 (i.e. a tab is treated like a space)
 */
function toColumn(s, pos) {
    const lastNewlineBeforePos = s.lastIndexOf('\n', pos - 1);
    const totalSizeOfPrecedingLines = (lastNewlineBeforePos != -1) ? lastNewlineBeforePos + 1 : 0;
    return pos - totalSizeOfPrecedingLines + 1;
}
exports.toColumn = toColumn;
/**
* Replace common unprintable characters by their escape codes, for human reading.
* Should be idempotent, i.e. if x = escapeForReading(y), then x.equals(escapeForReading(x)).
* @param string to escape
* @param quote quotes to put around string, or "" if no quotes required
* @return string with escape codes replaced, preceded and followed by quote, with a human-readable legend appended to the end
*         explaining what the replacement characters mean.
*/
function escapeForReading(s, quote) {
    let result = s;
    const legend = [];
    for (const { unprintableChar, humanReadableVersion, description } of ESCAPES) {
        if (result.includes(unprintableChar)) {
            result = result.replace(unprintableChar, humanReadableVersion);
            legend.push(humanReadableVersion + " means " + description);
        }
    }
    result = quote + result + quote;
    if (legend.length > 0) {
        result += " (where " + legend.join(", ") + ")";
    }
    return result;
}
exports.escapeForReading = escapeForReading;
const ESCAPES = [
    {
        unprintableChar: "\n",
        humanReadableVersion: "\u2424",
        description: "newline"
    },
    {
        unprintableChar: "\r",
        humanReadableVersion: "\u240D",
        description: "carriage return"
    },
    {
        unprintableChar: "\t",
        humanReadableVersion: "\u21E5",
        description: "tab"
    },
];
/**
 * @param string to shorten
 * @param pos offset in string, 0<=pos<string.length()
 * @return a short snippet of the part of string starting at offset pos,
 * in human-readable form
 */
function snippet(s, pos) {
    const maxCharsToShow = 10;
    const end = Math.min(pos + maxCharsToShow, s.length);
    let result = s.substring(pos, end) + (end < s.length ? "..." : "");
    if (result.length == 0)
        result = "end of string";
    return escapeForReading(result, "");
}
exports.snippet = snippet;
/**
 * Indent a multi-line string by preceding each line with prefix.
 * @param string string to indent
 * @param prefix prefix to use for indenting
 * @return string with prefix inserted at the start of each line
 */
function indent(s, prefix) {
    let result = "";
    let charsCopied = 0;
    do {
        const newline = s.indexOf('\n', charsCopied);
        const endOfLine = newline != -1 ? newline + 1 : s.length;
        result += prefix + s.substring(charsCopied, endOfLine);
        charsCopied = endOfLine;
    } while (charsCopied < s.length);
    return result;
}
exports.indent = indent;

},{}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserState = exports.FailedParse = exports.SuccessfulParse = exports.InternalParser = exports.failfast = exports.skip = exports.option = exports.plus = exports.star = exports.repeat = exports.ZERO_OR_ONE = exports.ONE_OR_MORE = exports.ZERO_OR_MORE = exports.Between = exports.AtLeast = exports.or = exports.cat = exports.str = exports.regex = exports.nt = void 0;
const assert_1 = __importDefault(require("assert"));
const types_1 = require("./types");
const parsetree_1 = require("./parsetree");
function nt(nonterminal, nonterminalName) {
    return {
        parse(s, pos, definitions, state) {
            const gt = definitions.get(nonterminal);
            if (gt === undefined)
                throw new types_1.GrammarError("nonterminal has no definition: " + nonterminalName);
            // console.error("entering", nonterminalName);
            state.enter(pos, nonterminal);
            let pr = gt.parse(s, pos, definitions, state);
            state.leave(nonterminal);
            // console.error("leaving", nonterminalName, "with result", pr);
            if (!pr.failed && !state.isEmpty()) {
                const tree = pr.tree;
                const newTree = state.makeParseTree(tree.start, tree.text, [tree]);
                pr = pr.replaceTree(newTree);
            }
            return pr;
        },
        toString() {
            return nonterminalName;
        }
    };
}
exports.nt = nt;
function regex(regexSource) {
    let regex = new RegExp('^' + regexSource + '$', 's');
    return {
        parse(s, pos, definitions, state) {
            if (pos >= s.length) {
                return state.makeFailedParse(pos, regexSource);
            }
            const l = s.substring(pos, pos + 1);
            if (regex.test(l)) {
                return state.makeSuccessfulParse(pos, pos + 1, l);
            }
            return state.makeFailedParse(pos, regexSource);
        },
        toString() {
            return regexSource;
        }
    };
}
exports.regex = regex;
function str(str) {
    return {
        parse(s, pos, definitions, state) {
            const newpos = pos + str.length;
            if (newpos > s.length) {
                return state.makeFailedParse(pos, str);
            }
            const l = s.substring(pos, newpos);
            if (l === str) {
                return state.makeSuccessfulParse(pos, newpos, l);
            }
            return state.makeFailedParse(pos, str);
        },
        toString() {
            return "'" + str.replace(/'\r\n\t\\/, "\\$&") + "'";
        }
    };
}
exports.str = str;
function cat(...terms) {
    return {
        parse(s, pos, definitions, state) {
            let prout = state.makeSuccessfulParse(pos, pos);
            for (const gt of terms) {
                const pr = gt.parse(s, pos, definitions, state);
                if (pr.failed)
                    return pr;
                pos = pr.pos;
                prout = prout.mergeResult(pr);
            }
            return prout;
        },
        toString() {
            return "(" + terms.map(term => term.toString()).join(" ") + ")";
        }
    };
}
exports.cat = cat;
/**
 * @param choices must be nonempty
 */
function or(...choices) {
    (0, assert_1.default)(choices.length > 0);
    return {
        parse(s, pos, definitions, state) {
            const successes = [];
            const failures = [];
            choices.forEach((choice) => {
                const result = choice.parse(s, pos, definitions, state);
                if (result.failed) {
                    failures.push(result);
                }
                else {
                    successes.push(result);
                }
            });
            if (successes.length > 0) {
                const longestSuccesses = longestResults(successes);
                (0, assert_1.default)(longestSuccesses.length > 0);
                return longestSuccesses[0];
            }
            const longestFailures = longestResults(failures);
            (0, assert_1.default)(longestFailures.length > 0);
            return state.makeFailedParse(longestFailures[0].pos, longestFailures.map((result) => result.expectedText).join("|"));
        },
        toString() {
            return "(" + choices.map(choice => choice.toString()).join("|") + ")";
        }
    };
}
exports.or = or;
class AtLeast {
    constructor(min) {
        this.min = min;
    }
    tooLow(n) { return n < this.min; }
    tooHigh(n) { return false; }
    toString() {
        switch (this.min) {
            case 0: return "*";
            case 1: return "+";
            default: return "{" + this.min + ",}";
        }
    }
}
exports.AtLeast = AtLeast;
class Between {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    tooLow(n) { return n < this.min; }
    tooHigh(n) { return n > this.max; }
    toString() {
        if (this.min == 0) {
            return (this.max == 1) ? "?" : "{," + this.max + "}";
        }
        else {
            return "{" + this.min + "," + this.max + "}";
        }
    }
}
exports.Between = Between;
exports.ZERO_OR_MORE = new AtLeast(0);
exports.ONE_OR_MORE = new AtLeast(1);
exports.ZERO_OR_ONE = new Between(0, 1);
function repeat(gt, howmany) {
    return {
        parse(s, pos, definitions, state) {
            let prout = state.makeSuccessfulParse(pos, pos);
            for (let timesMatched = 0; howmany.tooLow(timesMatched) || !howmany.tooHigh(timesMatched + 1); ++timesMatched) {
                const pr = gt.parse(s, pos, definitions, state);
                if (pr.failed) {
                    // no match
                    if (howmany.tooLow(timesMatched)) {
                        return pr;
                    }
                    return prout.addLastFailure(pr);
                }
                else {
                    if (pr.pos == pos) {
                        // matched the empty string, and we already have enough.
                        // we may get into an infinite loop if howmany.tooHigh() never returns false,
                        // so return successful match at this point
                        return prout;
                    }
                    // otherwise advance the position and merge pr into prout
                    pos = pr.pos;
                    prout = prout.mergeResult(pr);
                }
            }
            return prout;
        },
        toString() {
            return gt.toString() + howmany.toString();
        }
    };
}
exports.repeat = repeat;
function star(gt) {
    return repeat(gt, exports.ZERO_OR_MORE);
}
exports.star = star;
function plus(gt) {
    return repeat(gt, exports.ONE_OR_MORE);
}
exports.plus = plus;
function option(gt) {
    return repeat(gt, exports.ZERO_OR_ONE);
}
exports.option = option;
function skip(nonterminal) {
    const repetition = star(nonterminal);
    return {
        parse(s, pos, definitions, state) {
            state.enterSkip();
            let pr = repetition.parse(s, pos, definitions, state);
            state.leaveSkip();
            if (pr.failed) {
                // succeed anyway
                pr = state.makeSuccessfulParse(pos, pos);
            }
            return pr;
        },
        toString() {
            return "(?<skip>" + repetition + ")";
        }
    };
}
exports.skip = skip;
function failfast(gt) {
    return {
        parse(s, pos, definitions, state) {
            let pr = gt.parse(s, pos, definitions, state);
            if (pr.failed)
                throw new types_1.InternalParseError("", pr.nonterminalName, pr.expectedText, "", pr.pos);
            return pr;
        },
        toString() {
            return 'failfast(' + gt + ')';
        }
    };
}
exports.failfast = failfast;
class InternalParser {
    constructor(definitions, start, nonterminalToString) {
        this.definitions = definitions;
        this.start = start;
        this.nonterminalToString = nonterminalToString;
        this.checkRep();
    }
    checkRep() {
    }
    parse(textToParse) {
        let pr = (() => {
            try {
                return this.start.parse(textToParse, 0, this.definitions, new ParserState(this.nonterminalToString));
            }
            catch (e) {
                if (e instanceof types_1.InternalParseError) {
                    // rethrow the exception, augmented by the original text, so that the error message is better
                    throw new types_1.InternalParseError("string does not match grammar", e.nonterminalName, e.expectedText, textToParse, e.pos);
                }
                else {
                    throw e;
                }
            }
        })();
        if (pr.failed) {
            throw new types_1.InternalParseError("string does not match grammar", pr.nonterminalName, pr.expectedText, textToParse, pr.pos);
        }
        if (pr.pos < textToParse.length) {
            const message = "only part of the string matches the grammar; the rest did not parse";
            throw (pr.lastFailure
                ? new types_1.InternalParseError(message, pr.lastFailure.nonterminalName, pr.lastFailure.expectedText, textToParse, pr.lastFailure.pos)
                : new types_1.InternalParseError(message, this.start.toString(), "end of string", textToParse, pr.pos));
        }
        return pr.tree;
    }
    ;
    toString() {
        return Array.from(this.definitions, ([nonterminal, rule]) => this.nonterminalToString(nonterminal) + '::=' + rule + ';').join("\n");
    }
}
exports.InternalParser = InternalParser;
class SuccessfulParse {
    constructor(pos, tree, lastFailure) {
        this.pos = pos;
        this.tree = tree;
        this.lastFailure = lastFailure;
        this.failed = false;
    }
    replaceTree(tree) {
        return new SuccessfulParse(this.pos, tree, this.lastFailure);
    }
    mergeResult(that) {
        (0, assert_1.default)(!that.failed);
        //console.log('merging', this, 'with', that);
        return new SuccessfulParse(that.pos, this.tree.concat(that.tree), laterResult(this.lastFailure, that.lastFailure));
    }
    /**
     * Keep track of a failing parse result that prevented this tree from matching more of the input string.
     * This deeper failure is usually more informative to the user, so we'll display it in the error message.
     * @param newLastFailure a failing ParseResult<NT> that stopped this tree's parse (but didn't prevent this from succeeding)
     * @return a new ParseResult<NT> identical to this one but with lastFailure added to it
     */
    addLastFailure(newLastFailure) {
        (0, assert_1.default)(newLastFailure.failed);
        return new SuccessfulParse(this.pos, this.tree, laterResult(this.lastFailure, newLastFailure));
    }
}
exports.SuccessfulParse = SuccessfulParse;
class FailedParse {
    constructor(pos, nonterminalName, expectedText) {
        this.pos = pos;
        this.nonterminalName = nonterminalName;
        this.expectedText = expectedText;
        this.failed = true;
    }
}
exports.FailedParse = FailedParse;
/**
 * @param result1
 * @param result2
 * @return whichever of result1 or result2 has the mximum position, or undefined if both are undefined
 */
function laterResult(result1, result2) {
    if (result1 && result2)
        return result1.pos >= result2.pos ? result1 : result2;
    else
        return result1 || result2;
}
/**
 * @param results
 * @return the results in the list with maximum pos.  Empty if list is empty.
 */
function longestResults(results) {
    return results.reduce((longestResultsSoFar, result) => {
        if (longestResultsSoFar.length == 0 || result.pos > longestResultsSoFar[0].pos) {
            // result wins
            return [result];
        }
        else if (result.pos == longestResultsSoFar[0].pos) {
            // result is tied
            longestResultsSoFar.push(result);
            return longestResultsSoFar;
        }
        else {
            // result loses
            return longestResultsSoFar;
        }
    }, []);
}
class ParserState {
    constructor(nonterminalToString) {
        this.nonterminalToString = nonterminalToString;
        this.stack = [];
        this.first = new Map();
        this.skipDepth = 0;
    }
    enter(pos, nonterminal) {
        if (!this.first.has(nonterminal)) {
            this.first.set(nonterminal, []);
        }
        const s = this.first.get(nonterminal);
        if (s.length > 0 && s[s.length - 1] == pos) {
            throw new types_1.GrammarError("detected left recursion in rule for " + this.nonterminalToString(nonterminal));
        }
        s.push(pos);
        this.stack.push(nonterminal);
    }
    leave(nonterminal) {
        (0, assert_1.default)(this.first.has(nonterminal) && this.first.get(nonterminal).length > 0);
        this.first.get(nonterminal).pop();
        const last = this.stack.pop();
        (0, assert_1.default)(last === nonterminal);
    }
    enterSkip() {
        //console.error('entering skip');
        ++this.skipDepth;
    }
    leaveSkip() {
        //console.error('leaving skip');
        --this.skipDepth;
        (0, assert_1.default)(this.skipDepth >= 0);
    }
    isEmpty() {
        return this.stack.length == 0;
    }
    get currentNonterminal() {
        return this.stack[this.stack.length - 1];
    }
    get currentNonterminalName() {
        return this.currentNonterminal !== undefined ? this.nonterminalToString(this.currentNonterminal) : undefined;
    }
    // requires: !isEmpty()
    makeParseTree(pos, text = '', children = []) {
        (0, assert_1.default)(!this.isEmpty());
        return new parsetree_1.InternalParseTree(this.currentNonterminal, this.currentNonterminalName, pos, text, children, this.skipDepth > 0);
    }
    // requires !isEmpty()
    makeSuccessfulParse(fromPos, toPos, text = '', children = []) {
        (0, assert_1.default)(!this.isEmpty());
        return new SuccessfulParse(toPos, this.makeParseTree(fromPos, text, children));
    }
    // requires !isEmpty()
    makeFailedParse(atPos, expectedText) {
        (0, assert_1.default)(!this.isEmpty());
        return new FailedParse(atPos, this.currentNonterminalName, expectedText);
    }
}
exports.ParserState = ParserState;

},{"./parsetree":11,"./types":12,"assert":1}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalParseTree = void 0;
const display_1 = require("./display");
class InternalParseTree {
    constructor(name, nonterminalName, start, text, allChildren, isSkipped) {
        this.name = name;
        this.nonterminalName = nonterminalName;
        this.start = start;
        this.text = text;
        this.allChildren = allChildren;
        this.isSkipped = isSkipped;
        this.checkRep();
        Object.freeze(this.allChildren);
        // can't freeze(this) because of beneficent mutation delayed computation-with-caching for children() and childrenByName()
    }
    checkRep() {
        // FIXME
    }
    get end() {
        return this.start + this.text.length;
    }
    childrenByName(name) {
        if (!this._childrenByName) {
            this._childrenByName = new Map();
            for (const child of this.allChildren) {
                if (!this._childrenByName.has(child.name)) {
                    this._childrenByName.set(child.name, []);
                }
                this._childrenByName.get(child.name).push(child);
            }
            for (const childList of this._childrenByName.values()) {
                Object.freeze(childList);
            }
        }
        this.checkRep();
        return this._childrenByName.get(name) || [];
    }
    get children() {
        if (!this._children) {
            this._children = this.allChildren.filter(child => !child.isSkipped);
            Object.freeze(this._children);
        }
        this.checkRep();
        return this._children;
    }
    concat(that) {
        return new InternalParseTree(this.name, this.nonterminalName, this.start, this.text + that.text, this.allChildren.concat(that.allChildren), this.isSkipped && that.isSkipped);
    }
    toString() {
        let s = (this.isSkipped ? "@skip " : "") + this.nonterminalName;
        if (this.children.length == 0) {
            s += ":" + (0, display_1.escapeForReading)(this.text, "\"");
        }
        else {
            let t = "";
            let offsetReachedSoFar = this.start;
            for (const pt of this.allChildren) {
                if (offsetReachedSoFar < pt.start) {
                    // previous child and current child have a gap between them that must have been matched as a terminal
                    // in the rule for this node.  Insert it as a quoted string.
                    const terminal = this.text.substring(offsetReachedSoFar - this.start, pt.start - this.start);
                    t += "\n" + (0, display_1.escapeForReading)(terminal, "\"");
                }
                t += "\n" + pt;
                offsetReachedSoFar = pt.end;
            }
            if (offsetReachedSoFar < this.end) {
                // final child and end of this node have a gap -- treat it the same as above.
                const terminal = this.text.substring(offsetReachedSoFar - this.start);
                t += "\n" + (0, display_1.escapeForReading)(terminal, "\"");
            }
            const smallEnoughForOneLine = 50;
            if (t.length <= smallEnoughForOneLine) {
                s += " { " + t.substring(1) // remove initial newline
                    .replace("\n", ", ")
                    + " }";
            }
            else {
                s += " {" + (0, display_1.indent)(t, "  ") + "\n}";
            }
        }
        return s;
    }
}
exports.InternalParseTree = InternalParseTree;

},{"./display":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarError = exports.InternalParseError = exports.ParseError = void 0;
const display_1 = require("./display");
/**
 * Exception thrown when a sequence of characters doesn't match a grammar
 */
class ParseError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ParseError = ParseError;
class InternalParseError extends ParseError {
    constructor(message, nonterminalName, expectedText, textBeingParsed, pos) {
        super((0, display_1.makeErrorMessage)(message, nonterminalName, expectedText, textBeingParsed, pos, "string being parsed"));
        this.nonterminalName = nonterminalName;
        this.expectedText = expectedText;
        this.textBeingParsed = textBeingParsed;
        this.pos = pos;
    }
}
exports.InternalParseError = InternalParseError;
class GrammarError extends ParseError {
    constructor(message, e) {
        super(e ? (0, display_1.makeErrorMessage)(message, e.nonterminalName, e.expectedText, e.textBeingParsed, e.pos, "grammar")
            : message);
    }
}
exports.GrammarError = GrammarError;

},{"./display":9}],13:[function(require,module,exports){
(function (__dirname){(function (){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAsHtml = exports.visualizeAsUrl = void 0;
const compiler_1 = require("./compiler");
const parserlib_1 = require("../parserlib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function emptyIterator() {
    return {
        next() { return { done: true }; }
    };
}
function getIterator(list) {
    return list[Symbol.iterator]();
}
const MAX_URL_LENGTH_FOR_DESKTOP_BROWSE = 2020;
/**
 * Visualizes a parse tree using a URL that can be pasted into your web browser.
 * @param parseTree tree to visualize
 * @param <NT> the enumeration of symbols in the parse tree's grammar
 * @return url that shows a visualization of the parse tree
 */
function visualizeAsUrl(parseTree, nonterminals) {
    const base = "http://web.mit.edu/6.031/www/parserlib/" + parserlib_1.VERSION + "/visualizer.html";
    const code = expressionForDisplay(parseTree, nonterminals);
    const url = base + '?code=' + fixedEncodeURIComponent(code);
    if (url.length > MAX_URL_LENGTH_FOR_DESKTOP_BROWSE) {
        // display alternate instructions to the console
        console.error('Visualization URL is too long for web browser and/or web server.\n'
            + 'Instead, go to ' + base + '\n'
            + 'and copy and paste this code into the textbox:\n'
            + code);
    }
    return url;
}
exports.visualizeAsUrl = visualizeAsUrl;
const visualizerHtmlFile = path_1.default.resolve(__dirname, '../../src/visualizer.html');
/**
 * Visualizes a parse tree as a string of HTML that can be displayed in a web browser.
 * @param parseTree tree to visualize
 * @param <NT> the enumeration of symbols in the parse tree's grammar
 * @return string of HTML that shows a visualization of the parse tree
 */
function visualizeAsHtml(parseTree, nonterminals) {
    const html = fs_1.default.readFileSync(visualizerHtmlFile, 'utf8');
    const code = expressionForDisplay(parseTree, nonterminals);
    const result = html.replace(/\/\/CODEHERE/, "return '" + fixedEncodeURIComponent(code) + "';");
    return result;
}
exports.visualizeAsHtml = visualizeAsHtml;
function expressionForDisplay(parseTree, nonterminals) {
    const { nonterminalToString } = (0, compiler_1.makeNonterminalConverters)(nonterminals);
    return forDisplay(parseTree, [], parseTree);
    function forDisplay(node, siblings, parent) {
        const name = nonterminalToString(node.name).toLowerCase();
        let s = "nd(";
        if (node.children.length == 0) {
            s += "\"" + name + "\",nd(\"'" + cleanString(node.text) + "'\"),";
        }
        else {
            s += "\"" + name + "\",";
            const children = node.allChildren.slice(); // make a copy for shifting
            const firstChild = children.shift();
            let childrenExpression = forDisplay(firstChild, children, node);
            if (node.start < firstChild.start) {
                // node and its first child have a gap between them that must have been matched as a terminal
                // in the rule for node.  Insert it as a quoted string.
                childrenExpression = precedeByTerminal(node.text.substring(0, firstChild.start - node.start), childrenExpression);
            }
            s += childrenExpression + ",";
        }
        if (siblings.length > 0) {
            const sibling = siblings.shift();
            let siblingExpression = forDisplay(sibling, siblings, parent);
            if (node.end < sibling.start) {
                // node and its sibling have a gap between them that must have been matched as a terminal
                // in the rule for parent.  Insert it as a quoted string.
                siblingExpression = precedeByTerminal(parent.text.substring(node.end - parent.start, sibling.start - parent.start), siblingExpression);
            }
            s += siblingExpression;
        }
        else {
            let siblingExpression = "uu";
            if (node.end < parent.end) {
                // There's a gap between the end of node and the end of its parent, which must be a terminal matched by parent.
                // Insert it as a quoted string.
                siblingExpression = precedeByTerminal(parent.text.substring(node.end - parent.start), siblingExpression);
            }
            s += siblingExpression;
        }
        if (node.isSkipped) {
            s += ",true";
        }
        s += ")";
        return s;
    }
    function precedeByTerminal(terminal, expression) {
        return "nd(\"'" + cleanString(terminal) + "'\", uu, " + expression + ")";
    }
    function cleanString(s) {
        let rvalue = s.replace(/\\/g, "\\\\");
        rvalue = rvalue.replace(/"/g, "\\\"");
        rvalue = rvalue.replace(/\n/g, "\\n");
        rvalue = rvalue.replace(/\r/g, "\\r");
        return rvalue;
    }
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function fixedEncodeURIComponent(s) {
    return encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
}

}).call(this)}).call(this,"/node_modules/parserlib/internal")

},{"../parserlib":14,"./compiler":8,"fs":5,"path":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAsHtml = exports.visualizeAsUrl = exports.compile = exports.ParseError = exports.VERSION = void 0;
exports.VERSION = "3.2.3";
var types_1 = require("./internal/types");
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return types_1.ParseError; } });
;
var compiler_1 = require("./internal/compiler");
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return compiler_1.compile; } });
var visualizer_1 = require("./internal/visualizer");
Object.defineProperty(exports, "visualizeAsUrl", { enumerable: true, get: function () { return visualizer_1.visualizeAsUrl; } });
Object.defineProperty(exports, "visualizeAsHtml", { enumerable: true, get: function () { return visualizer_1.visualizeAsHtml; } });

},{"./internal/compiler":8,"./internal/types":12,"./internal/visualizer":13}],15:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))

},{"_process":16}],16:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puzzle = exports.Spot = void 0;
const assert_1 = __importDefault(require("assert"));
const PUZZLE_SIZE = 10;
/**
 * A mutable spot object that represents a location where a star can be placed in the game Star Battle, it also
 * has a defined region it belongs to.
 */
class Spot {
    // AF(row, column, star, region) = a spot on a gameboard of star battle at the row 'row' and column 'column'
    //                                 the spot belongs to the region 'region' and has a star at the spot if 'star'
    //                                 is true, otherwise it doesn't have a star
    //
    // RI:
    //   1 <= (row, column, & region) <= 10
    //   
    // SRE: 
    //   All instance variables are immutable, private and only star is not readonly. No opeations except getAdjacent return mutable types
    //   so safe from rep exposure and all inputs to constructor are also immutable
    //   getAdjacent does not return any of the rep and simply returns a new array of immutable objects so safe from rep exposure
    /**
     * Creates a spot with the values given to it
     *
     * @param row row coordinate that the spot is located at
     * @param column column coordinate that the spot is located at
     * @param star true if there is a star at this spot on the gameboard
     * @param region region that the spot belongs to
     */
    constructor(row, column, star, region) {
        this.row = row;
        this.column = column;
        this.star = star;
        this.region = region;
        this.checkRep();
    }
    checkRep() {
        (0, assert_1.default)(this.row >= 1 && this.row <= PUZZLE_SIZE);
        (0, assert_1.default)(this.column >= 1 && this.column <= PUZZLE_SIZE);
        (0, assert_1.default)(this.region >= 1 && this.region <= PUZZLE_SIZE);
    }
    /**
     * @returns row of spot. will be between 1-10 inclusive
     */
    getRow() {
        this.checkRep();
        return this.row;
    }
    /**
     * @returns column of spot. will be between 1-10 inclusive
     */
    getColumn() {
        this.checkRep();
        return this.column;
    }
    /**
     * changes the boolean of the star to the opposite state
     */
    toggleStar() {
        this.star = !this.star;
        this.checkRep();
    }
    /**
     * @returns true iff the spot has a star at it, otherwise false
     */
    hasStar() {
        this.checkRep();
        return this.star;
    }
    /**
     * @returns region of spot. will be between 1-10 inclusive
     */
    getRegion() {
        this.checkRep();
        return this.region;
    }
    /**
     * Gets the list of coordiantes of adjacent spots to the current spot
     *
     * @returns list of coordinate pairs that represent all valid adjacent spots (horizontally, vertically, and diagonally) to the
     *          current spot object. Omits any spots that are outside the range of the board or equal to the spot itself.
     */
    getAdjacent() {
        this.checkRep();
        //get all adjacent spots
        const allSpots = [];
        for (const x of [-1, 0, 1]) {
            for (const y of [-1, 0, 1]) {
                allSpots.push([this.getRow() + x, this.getColumn() + y]);
            }
        }
        //construct new array that only has valid adjacent boxes
        const filteredArr = [];
        for (const coord of allSpots) {
            let toAdd = true;
            if (coord[0] === this.getRow() && coord[1] === this.getColumn()) {
                toAdd = false;
            }
            if (coord[0] < 1 || coord[0] > PUZZLE_SIZE) {
                toAdd = false;
            }
            if (coord[1] < 1 || coord[1] > PUZZLE_SIZE) {
                toAdd = false;
            }
            if (toAdd) {
                filteredArr.push(coord);
            }
        }
        return filteredArr;
    }
    /**
     * Equality is defined as being located at the same coordinate pair
     *
     * @param that a second spot object to compare to the object
     * @returns true iff the row and column coordinate of the two spots are the same
     */
    equalValue(that) {
        if (that.getColumn() === this.column && that.getRow() === this.row) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @returns a parsable string representation of the spot ADT
     */
    toParseableString() {
        return this.row + ',' + this.column;
    }
    /**
     * @returns a human readable representation of the spot ADT
     */
    toString() {
        return this.row + ', ' + this.column + ', ' + this.region + ', ' + this.star;
    }
}
exports.Spot = Spot;
/**
 * An immutable Puzzle for a 10x10 game of Star Battle. As described in the project handout, it is build of 100
 * locations, which belong to a region and may or may not have a star in them. The puzzle can be in an empty, partially
 * completed, or solved game state as defined in the handout.
 */
class Puzzle {
    /**
     * Creates a new immutable puzzle object by deconstructing maps and making deep copies of spot objects
     *
     * @param regionMap map mapping every row and column pair (in format rowxcol) to the region that is in. Every row column pair must be in the map
     * @param starMap map mapping every row and column pair (in format rowxcol) to a boolean that is true if there is a star there and false otherwise
     *                Every row column pair must be in the map (row and columns are 1 indexed)
     * @throws error if either starMap or regionMap does not every row and column pair in it or there is not exactly 100 locations listed in each
     */
    constructor(regionMap, starMap) {
        //ensure exactly 100 locations exist in inputs (fail fast)
        (0, assert_1.default)([...regionMap.keys()].length === PUZZLE_SIZE ** 2, 'puzzle is the wrong length');
        (0, assert_1.default)([...starMap.keys()].length === PUZZLE_SIZE ** 2, 'puzzle is the wrong length');
        //create new board with cooresponding spot values
        const newBoard = [];
        for (let row = 1; row <= PUZZLE_SIZE; row++) {
            for (let column = 1; column <= PUZZLE_SIZE; column++) {
                const region = regionMap.get(this.getStringLocation(row, column)) ?? assert_1.default.fail('regionMap doesnt have row,column pair');
                const hasStar = starMap.get(this.getStringLocation(row, column)) ?? assert_1.default.fail('starMap doesnt have row,column pair');
                newBoard.push(new Spot(row, column, hasStar, region));
            }
        }
        this.board = newBoard;
        this.checkRep();
    }
    checkRep() {
        (0, assert_1.default)(this.board.length === PUZZLE_SIZE * PUZZLE_SIZE);
    }
    /**
     * Get string version of row and column coordinate pair
     *
     * @param row row coordinate
     * @param col column coordinate
     * @returns string representation of the row and column to be hashed
     */
    getStringLocation(row, col) {
        return row + ',' + col;
    }
    /**
     * Converts coordinates pair to an index for the 1D board
     *
     * @param row coordinate to convert
     * @param column coordinate to convert
     * @returns the index of the corresponding spot for the 1D board
     * @throws error if the row or column values are outside the scope of the board
     */
    coordsToIndex(row, column) {
        (0, assert_1.default)(row >= 1 && row <= PUZZLE_SIZE);
        (0, assert_1.default)(column >= 1 && column <= PUZZLE_SIZE);
        return (column - 1) + PUZZLE_SIZE * (row - 1);
    }
    /**
     * Check if the given coordinate pair has a star in it
     *
     * @param row the row coordinate to check
     * @param column the column coordinate to check
     * @returns true iff the spot has a star, otherwise false
     * @throws error if row and column are outside the range of the board
     */
    hasStar(row, column) {
        this.checkRep();
        const indexToCheck = this.coordsToIndex(row, column);
        const spotToCheck = this.board[indexToCheck] ?? assert_1.default.fail('index out of array');
        return spotToCheck.hasStar();
    }
    /**
     * Gets the region at the given coordinate pair
     *
     * @param row the row coordinate to check
     * @param column the column coordinate to check
     * @returns the region at the coordinate pair
     * @throws error if row and column are outside the range of the board
     */
    getRegion(row, column) {
        this.checkRep();
        const indexToCheck = this.coordsToIndex(row, column);
        const spot = this.board[indexToCheck] ?? assert_1.default.fail('index out of array');
        return spot.getRegion();
    }
    /**
     * Returns a new puzzle with the star at the given coordinate pair updated to the opposite state
     *
     * @param row the row coordinate to update
     * @param column the column coordinate to update
     * @returns a new Puzzle to reflect the updated star state at the given coordinate pair
     * @throws error if the row and column are not on the board
     */
    toggleStar(row, column) {
        this.checkRep();
        const regionMap = new Map();
        const starMap = new Map();
        //for each spot, add to the new maps
        for (const spot of this.board) {
            regionMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), spot.getRegion());
            //if spot to flip the star, flip the star value
            if (spot.getRow() === row && spot.getColumn() == column) {
                starMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), !spot.hasStar());
            }
            else {
                starMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), spot.hasStar());
            }
        }
        return new Puzzle(regionMap, starMap);
    }
    /**
     * Checks if the puzzle is solved based on the rules of Star Battle as defined in the project handout:
     *       There can be no adjacent stars (horizontally, vertically, or diagonally adjacent)
     *       There must be two stars in every region
     *       There must be two stars in every row
     *       There must be two stars in every column
     *
     * @returns true iff the Puzzle is solved, otherwise false
     */
    isSolved() {
        this.checkRep();
        //CHECK HAS 20 STARS AND NONE ADJACENT
        let starCount = 0;
        for (const spot of this.board) {
            if (spot.hasStar()) {
                starCount++;
            }
            for (const neighborCoords of spot.getAdjacent()) {
                if ((this.board[this.coordsToIndex(neighborCoords[0], neighborCoords[1])] ?? assert_1.default.fail('broken getAdjacent')).hasStar()) {
                    if (spot.hasStar()) {
                        return false;
                    }
                }
            }
        }
        //Check not more than 2 in same row
        for (let i = 0; i < this.board.length; i += PUZZLE_SIZE) {
            let rowCount = 0;
            for (let w = i; w < i + PUZZLE_SIZE; w++) {
                if (this.board[w]?.hasStar() ?? assert_1.default.fail('same row broken' + i + ', ' + w)) {
                    rowCount++;
                }
            }
            if (rowCount !== 2) {
                return false;
            }
        }
        //Check not more than 2 in same column
        for (let i = 0; i < PUZZLE_SIZE; i++) {
            let columnCount = 0;
            for (let w = i; w < this.board.length; w += PUZZLE_SIZE) {
                if (this.board[w]?.hasStar() ?? assert_1.default.fail('same col broken')) {
                    columnCount++;
                }
            }
            if (columnCount !== 2) {
                return false;
            }
        }
        //exactly 2 in each region of the map
        //build new star map
        const starMap = new Map();
        for (let i = 1; i < PUZZLE_SIZE + 1; i++) {
            starMap.set(i, []);
        }
        //enter the stars into the map
        for (const spot of this.board) {
            const region = spot.getRegion();
            if (spot.hasStar()) {
                (starMap.get(region) ?? assert_1.default.fail()).push(spot);
            }
        }
        //ensure that each starList is exactly 2 stars long
        for (const regionStarList of starMap.values()) {
            if (regionStarList.length !== 2) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if the puzzle is blank
     *
     * @returns true iff there are no stars on the entire board, otherwise false
     */
    isBlank() {
        let starCount = 0;
        for (const spot of this.board) {
            if (spot.hasStar()) {
                starCount++;
            }
        }
        return starCount === 0;
    }
    /**
     * Returns a copy of the Puzzle, cleared of all stars
     *
     * @returns a new puzzle with the same regions as current but with no stars
     */
    clearPuzzle() {
        const regionMap = new Map();
        const starMap = new Map();
        for (const spot of this.board) {
            regionMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), spot.getRegion());
            starMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), false);
        }
        return new Puzzle(regionMap, starMap);
    }
    /**
     * Returns maps needed for toString functionality
     *
     * @returns regionMap that maps each region number to a parsable string that lists the coordinates in that map
     *          starMap that maps each region number to a parsable string that represents the stars in the region
     */
    getToStringMaps() {
        const regionMap = new Map();
        const starMap = new Map();
        //for each spot on the board, check if it has a star and add to corresponding map
        for (const spot of this.board) {
            if (!spot.hasStar()) {
                regionMap.set(spot.getRegion(), (regionMap.get(spot.getRegion()) ?? '') + ' ' + spot.toParseableString());
            }
            else {
                starMap.set(spot.getRegion(), (starMap.get(spot.getRegion()) ?? '') + spot.toParseableString() + ' ');
            }
        }
        return {
            regionMap: regionMap,
            starMap: starMap
        };
    }
    /**
     * @returns a parsable string representation of the Puzzle ADT
     */
    toParseableString() {
        const maps = this.getToStringMaps();
        let returnString = PUZZLE_SIZE + 'x' + PUZZLE_SIZE + '\n';
        for (let i = 1; i <= PUZZLE_SIZE; i++) {
            const starList = maps.starMap.get(i);
            if (starList !== undefined) {
                returnString += starList;
            }
            returnString += '|' + maps.regionMap.get(i) ?? assert_1.default.fail('does not have all the regions');
            returnString += '\n';
        }
        return returnString;
    }
    /**
     * @returns a human readable string representation of the Puzzle ADT
     */
    toString() {
        return this.toParseableString();
    }
}
exports.Puzzle = Puzzle;

},{"assert":1}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePuzzle = void 0;
const PuzzleADT_1 = require("./PuzzleADT");
const parserlib_1 = require("parserlib");
/**
 * Parser for Star Battle puzzles.
 */
const grammar = `
    BOARD ::= COMMENT* '10x10' [\\n] ROW{10} ;
    COMMENT ::= WHITESPACE* '#' [^\\n]+ [\\n]* ;
    ROW ::= (WHITESPACE* STARS* '|' SPOTS+ [\\n]*) ;
    STARS ::= WHITESPACE* LOCATION WHITESPACE ;
    SPOTS ::= WHITESPACE LOCATION ;
    LOCATION ::= NUM ',' NUM ;
    NUM ::= [0-9]+ ;
    WHITESPACE ::= [ \\t\\r]+ ;
`;
var PuzzleGrammar;
(function (PuzzleGrammar) {
    PuzzleGrammar[PuzzleGrammar["Board"] = 0] = "Board";
    PuzzleGrammar[PuzzleGrammar["Row"] = 1] = "Row";
    PuzzleGrammar[PuzzleGrammar["Stars"] = 2] = "Stars";
    PuzzleGrammar[PuzzleGrammar["Spots"] = 3] = "Spots";
    PuzzleGrammar[PuzzleGrammar["Location"] = 4] = "Location";
    PuzzleGrammar[PuzzleGrammar["Num"] = 5] = "Num";
    PuzzleGrammar[PuzzleGrammar["Whitespace"] = 6] = "Whitespace";
    PuzzleGrammar[PuzzleGrammar["Comment"] = 7] = "Comment";
})(PuzzleGrammar || (PuzzleGrammar = {}));
// compile the grammar into a parser
const parser = (0, parserlib_1.compile)(grammar, PuzzleGrammar, PuzzleGrammar.Board);
/**
 * Parse a string into an puzzle.
 *
 * @param puzzleString string representation of a star battle puzzle
 * @returns puzzle object that the puzzleString represents
 * @throws ParseError if the string doesn't match the puzzle grammar or if the inputted puzzle has != 100 locations, != 10 regions, or is not 10x10
 */
function parsePuzzle(puzzleString) {
    const parseTree = parser.parse(puzzleString); // create parse tree
    // display the parse tree in various ways, for debugging only if we need to change the grammar in the future
    // console.log("parse tree:\n" + parseTree);
    // console.log(visualizeAsUrl(parseTree, PuzzleGrammar));
    const puzzle = makePuzzle(parseTree); // convert parse tree to a Puzzle object
    return puzzle;
}
exports.parsePuzzle = parsePuzzle;
/**
 * Convert a parse tree into an Puzzle:
 *
 * @param parseTree ParseTree containing stars and spots in their respective regions according to the grammar for star battle puzzles
 * @returns Puzzle object corresponding to the parseTree
 * @throws ParseError if the string doesn't match the puzzle grammar or if the inputted puzzle has != 100 locations, != 10 regions, or is not 10x10
 */
function makePuzzle(parseTree) {
    const rows = parseTree.childrenByName(PuzzleGrammar.Row);
    const regionMap = new Map(); // initialize structures for Puzzle constructor 
    const starMap = new Map();
    let region = 1;
    for (const row of rows) { // a row contains the spots and stars of a region
        const stars = row.childrenByName(PuzzleGrammar.Stars);
        const spots = row.childrenByName(PuzzleGrammar.Spots);
        //iterate through stars and add them to the star and region maps
        for (const star of stars) {
            const spotLocation = star.text.split(',').map((num) => num.trim()); // split star into [row, column] in order to trim whitespace
            starMap.set(spotLocation[0] + ',' + spotLocation[1], true);
            regionMap.set(spotLocation[0] + ',' + spotLocation[1], region);
        }
        //iterate through the empty spots and add them to the star and region maps
        for (const spot of spots) {
            const spotLocation = spot.text.split(',').map((num) => num.trim());
            starMap.set(spotLocation[0] + ',' + spotLocation[1], false);
            regionMap.set(spotLocation[0] + ',' + spotLocation[1], region);
        }
        region++; // next row in loop is the next region, so increment
    }
    return new PuzzleADT_1.Puzzle(regionMap, starMap);
}
/**
 * Main function. Parses and then reprints an example expression. Mainly used for debugging in this file.
 */
function main() {
    const solvedInput = `# Star Battle Puzzles by KrazyDad, Volume 1, Book 1, Number 1
# from https://krazydad.com/starbattle/
# (also shown in the project handout)
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
`;
    const blankInput = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
    console.log(parsePuzzle(solvedInput));
    // console.log(parsePuzzle(blankInput));
}
if (require.main === module) {
    main();
}

},{"./PuzzleADT":17,"parserlib":14}],19:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const assert_1 = __importDefault(require("assert"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const PuzzleParser_1 = require("./PuzzleParser");
const PUZZLE_SIZE = 10;
const BOX_SIZE = 42;
// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];
// semitransparent versions of those colors
const BACKGROUNDS = COLORS.map((color) => color + '60');
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
const PUZZLE = "kd-6-31-6";
/**
 * Mutable Client ADT, as described in the Star Battle project handout.
 */
class Client {
    constructor() {
        this.puzzle = undefined;
    }
    checkRep() {
        (0, assert_1.default)(true);
    }
    /**
     * Requests a empty puzzle from the server and sets the puzzle instance variable to the puzzle received
     *
     * @param file puzzle file to load a puzzle from
     */
    async requestPuzzle(file = PUZZLE) {
        const serverResponse = await (0, node_fetch_1.default)(`http://localhost:8789/puzzle?puzzleName=${file}`); // send request to server
        const puzzleString = await serverResponse.text(); // empty puzzleString has been sent
        this.puzzle = (0, PuzzleParser_1.parsePuzzle)(puzzleString); // parse string into Puzzle and set to instance variable
    }
    /**
     * Sets the puzzle attribute of the client to a new puzzle with star toggled
     *
     * @param row the row coordinate at which to add/remove the new star. Must be 1-10.
     * @param column the column coordinate at which to add/remove the new star. Must be 1-10.
     */
    toggleStar(row, column) {
        (0, assert_1.default)(this.puzzle, "no puzzle has been loaded yet");
        this.puzzle = this.puzzle.toggleStar(row, column);
        this.checkRep();
    }
    /**
     * Get the region of the current coordinate
     *
     * @param row the row coordinate. Must be 1-10.
     * @param column the column coordinate. Must be 1-10.
     * @returns the region of the coordinate.
     */
    getRegion(row, column) {
        this.checkRep();
        (0, assert_1.default)(this.puzzle, "no puzzle has been loaded yet");
        return this.puzzle.getRegion(row, column);
    }
    /**
     * Checks if the specific row and col of the puzzle has a star
     *
     * @param row the row coordinate to check. Must be 1-10.
     * @param column the column coordinate to check. Must be 1-10.
     * @returns true iff there is a star present at the coordinate
     */
    hasStar(row, column) {
        this.checkRep();
        (0, assert_1.default)(this.puzzle, "no puzzle has been loaded yet");
        return this.puzzle.hasStar(row, column);
    }
    /**
     * Evaluates if the current puzzle in the client is solved or not
     *
     * @returns true if the current star battle puzzle used by the client is solved as defined in the rules of
     *          star battle in the project handout, otherwise false
     */
    isPuzzleSolved() {
        this.checkRep();
        (0, assert_1.default)(this.puzzle, "no puzzle has been loaded yet");
        return this.puzzle.isSolved();
    }
    /**
     * Draws the puzzle onto the canvas
     *
     * @param canvas the canvas on which to draw the puzzle
     * @param clearFirst whether the canvas should first be cleared
     */
    drawPuzzle(canvas, clearFirst = false) {
        const context = canvas.getContext('2d');
        (0, assert_1.default)(context, 'unable to get canvas drawing context');
        if (clearFirst) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        context.save(); // save original context settings before we translate and change colors
        for (let column = 0; column < PUZZLE_SIZE; column++) {
            for (let row = 0; row < PUZZLE_SIZE; row++) {
                const region = this.getRegion(row + 1, column + 1);
                // draw the outer outline box centered on the origin (which is now (x,y))
                context.strokeStyle = BACKGROUNDS[region - 1] ?? assert_1.default.fail('failed');
                context.lineWidth = 4;
                context.strokeRect(BOX_SIZE * column, BOX_SIZE * row, BOX_SIZE, BOX_SIZE);
                context.fillStyle = BACKGROUNDS[region - 1] ?? assert_1.default.fail('failed');
                context.fillRect(BOX_SIZE * column, BOX_SIZE * row, BOX_SIZE, BOX_SIZE);
                context.restore(); // reset the origin and styles back to defaults
            }
        }
        const numSides = 5; // parameters for the stars to be drawn on the puzzle
        const outerRad = 12;
        const innerRad = 6;
        for (let column = 0; column < PUZZLE_SIZE; column++) {
            for (let row = 0; row < PUZZLE_SIZE; row++) {
                const star = this.hasStar(row + 1, column + 1);
                if (star) {
                    this.drawStar(context, BOX_SIZE * column + BOX_SIZE / 2, BOX_SIZE * row + BOX_SIZE / 2, numSides, outerRad, innerRad);
                }
            }
        }
        this.checkRep();
    }
    /**
     * Draws a star on the puzzle
     *
     * @param context on which to draw the star
     * @param cx the center x coord
     * @param cy the center y coord
     * @param spikes the number of spikes on the star
     * @param outerRadius the outer radius of the star
     * @param innerRadius the inner radius of the star
     *
     * function code modified from this stack overflow post:
     * https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
     */
    drawStar(context, cx, cy, spikes, outerRadius, innerRadius) {
        const THREE = 3;
        let rot = Math.PI / 2 * THREE;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        if (context === null) {
            throw new Error('context is null');
        }
        else {
            context.beginPath();
            context.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                context.lineTo(x, y);
                rot += step;
                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                context.lineTo(x, y);
                rot += step;
            }
            context.lineTo(cx, cy - outerRadius);
            context.closePath();
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            context.stroke();
            context.fillStyle = 'black';
            context.fill();
        }
        this.checkRep();
    }
    /**
     * Handles a click by toggling a star at the clicked area of the canvas
     *
     * @param canvas the canvas on which to draw
     * @param x the x coordinate of the click
     * @param y the y coordinate of the click
     */
    handleClick(canvas, x, y) {
        const row = this.discretizeClick(y);
        const column = this.discretizeClick(x);
        this.toggleStar(row, column);
        this.drawPuzzle(canvas, true);
        this.checkRep();
    }
    /**
     * Converts a coordinate to a discretized area on an axis
     *
     * @param coordinate to convert to a discrete area on the canvas
     * @returns discrete area at which the coordinate corresponds
     */
    discretizeClick(coordinate) {
        this.checkRep();
        if (coordinate > 0) {
            return Math.ceil(coordinate / BOX_SIZE);
        }
        else {
            return 1;
        }
    }
}
exports.Client = Client;
/**
 * Print a message by appending it to an HTML element.
 *
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea, message) {
    outputArea.innerText += message + '\n'; // append the message to the output area
    outputArea.scrollTop = outputArea.scrollHeight; // scroll the output area so that what we just printed is visible
}
/**
 * Runs the webpage where Star Battle is player
 */
async function main() {
    const client = new Client();
    await client.requestPuzzle();
    // output area for printing
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    // canvas for drawing
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    client.drawPuzzle(canvas);
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event) => {
        client.handleClick(canvas, event.offsetX, event.offsetY);
        if (client.isPuzzleSolved()) {
            printOutput(outputArea, `You have solved the puzzle!`);
        }
    });
    // add initial instructions to the output area
    printOutput(outputArea, `Click the board to begin playing!`);
}
main().catch(error => { throw new Error('cannot run main correctly'); });

},{"./PuzzleParser":18,"assert":1,"node-fetch":6}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9hc3NlcnQvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Fzc2VydC9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWZldGNoL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvY29tcGlsZXIuanMiLCJub2RlX21vZHVsZXMvcGFyc2VybGliL2ludGVybmFsL2Rpc3BsYXkuanMiLCJub2RlX21vZHVsZXMvcGFyc2VybGliL2ludGVybmFsL3BhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvcGFyc2V0cmVlLmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlcmxpYi9pbnRlcm5hbC90eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvdmlzdWFsaXplci5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvcGFyc2VybGliLmpzIiwibm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvUHV6emxlQURULnRzIiwic3JjL1B1enpsZVBhcnNlci50cyIsInNyYy9TdGFyYkNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q2xJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFMUIsZ0RBQWdEO0lBQ2hELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFpQixFQUFFLEVBQUU7UUFDbkQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekQsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDekIsV0FBVyxDQUFDLFVBQVUsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1NBQzFEO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCw4Q0FBOEM7SUFDOUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuLy8gY29tcGFyZSBhbmQgaXNCdWZmZXIgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9ibG9iLzY4MGU5ZTVlNDg4ZjIyYWFjMjc1OTlhNTdkYzg0NGE2MzE1OTI4ZGQvaW5kZXguanNcbi8vIG9yaWdpbmFsIG5vdGljZTpcblxuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB2YXIgeCA9IGEubGVuZ3RoO1xuICB2YXIgeSA9IGIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldO1xuICAgICAgeSA9IGJbaV07XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKHkgPCB4KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5mdW5jdGlvbiBpc0J1ZmZlcihiKSB7XG4gIGlmIChnbG9iYWwuQnVmZmVyICYmIHR5cGVvZiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIoYik7XG4gIH1cbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcik7XG59XG5cbi8vIGJhc2VkIG9uIG5vZGUgYXNzZXJ0LCBvcmlnaW5hbCBub3RpY2U6XG4vLyBOQjogVGhlIFVSTCB0byB0aGUgQ29tbW9uSlMgc3BlYyBpcyBrZXB0IGp1c3QgZm9yIHRyYWRpdGlvbi5cbi8vICAgICBub2RlLWFzc2VydCBoYXMgZXZvbHZlZCBhIGxvdCBzaW5jZSB0aGVuLCBib3RoIGluIEFQSSBhbmQgYmVoYXZpb3IuXG5cbi8vIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1VuaXRfVGVzdGluZy8xLjBcbi8vXG4vLyBUSElTIElTIE5PVCBURVNURUQgTk9SIExJS0VMWSBUTyBXT1JLIE9VVFNJREUgVjghXG4vL1xuLy8gT3JpZ2luYWxseSBmcm9tIG5hcndoYWwuanMgKGh0dHA6Ly9uYXJ3aGFsanMub3JnKVxuLy8gQ29weXJpZ2h0IChjKSAyMDA5IFRob21hcyBSb2JpbnNvbiA8Mjgwbm9ydGguY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0b1xuLy8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbi8vIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuLy8gc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgZnVuY3Rpb25zSGF2ZU5hbWVzID0gKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvbygpIHt9Lm5hbWUgPT09ICdmb28nO1xufSgpKTtcbmZ1bmN0aW9uIHBUb1N0cmluZyAob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbn1cbmZ1bmN0aW9uIGlzVmlldyhhcnJidWYpIHtcbiAgaWYgKGlzQnVmZmVyKGFycmJ1ZikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KGFycmJ1Zik7XG4gIH1cbiAgaWYgKCFhcnJidWYpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGFycmJ1ZiBpbnN0YW5jZW9mIERhdGFWaWV3KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGFycmJ1Zi5idWZmZXIgJiYgYXJyYnVmLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxudmFyIHJlZ2V4ID0gL1xccypmdW5jdGlvblxccysoW15cXChcXHNdKilcXHMqLztcbi8vIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvZnVuY3Rpb24ucHJvdG90eXBlLm5hbWUvYmxvYi9hZGVlZWVjOGJmY2M2MDY4YjE4N2Q3ZDlmYjNkNWJiMWQzYTMwODk5L2ltcGxlbWVudGF0aW9uLmpzXG5mdW5jdGlvbiBnZXROYW1lKGZ1bmMpIHtcbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcykge1xuICAgIHJldHVybiBmdW5jLm5hbWU7XG4gIH1cbiAgdmFyIHN0ciA9IGZ1bmMudG9TdHJpbmcoKTtcbiAgdmFyIG1hdGNoID0gc3RyLm1hdGNoKHJlZ2V4KTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IGdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgICAgIHZhciBpZHggPSBvdXQuaW5kZXhPZignXFxuJyArIGZuX25hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGJlZm9yZSBpdCAoYW5kIGl0cyBsaW5lKVxuICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YWNrID0gb3V0O1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuZnVuY3Rpb24gaW5zcGVjdChzb21ldGhpbmcpIHtcbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcyB8fCAhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpIHtcbiAgICByZXR1cm4gdXRpbC5pbnNwZWN0KHNvbWV0aGluZyk7XG4gIH1cbiAgdmFyIHJhd25hbWUgPSBnZXROYW1lKHNvbWV0aGluZyk7XG4gIHZhciBuYW1lID0gcmF3bmFtZSA/ICc6ICcgKyByYXduYW1lIDogJyc7XG4gIHJldHVybiAnW0Z1bmN0aW9uJyArICBuYW1lICsgJ10nO1xufVxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuYWN0dWFsKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5leHBlY3RlZCksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQuZGVlcFN0cmljdEVxdWFsID0gZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcFN0cmljdEVxdWFsJywgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcykge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICYmIGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBjb21wYXJlKGFjdHVhbCwgZXhwZWN0ZWQpID09PSAwO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICgoYWN0dWFsID09PSBudWxsIHx8IHR5cGVvZiBhY3R1YWwgIT09ICdvYmplY3QnKSAmJlxuICAgICAgICAgICAgIChleHBlY3RlZCA9PT0gbnVsbCB8fCB0eXBlb2YgZXhwZWN0ZWQgIT09ICdvYmplY3QnKSkge1xuICAgIHJldHVybiBzdHJpY3QgPyBhY3R1YWwgPT09IGV4cGVjdGVkIDogYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIElmIGJvdGggdmFsdWVzIGFyZSBpbnN0YW5jZXMgb2YgdHlwZWQgYXJyYXlzLCB3cmFwIHRoZWlyIHVuZGVybHlpbmdcbiAgLy8gQXJyYXlCdWZmZXJzIGluIGEgQnVmZmVyIGVhY2ggdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2VcbiAgLy8gVGhpcyBvcHRpbWl6YXRpb24gcmVxdWlyZXMgdGhlIGFycmF5cyB0byBoYXZlIHRoZSBzYW1lIHR5cGUgYXMgY2hlY2tlZCBieVxuICAvLyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIChha2EgcFRvU3RyaW5nKS4gTmV2ZXIgcGVyZm9ybSBiaW5hcnlcbiAgLy8gY29tcGFyaXNvbnMgZm9yIEZsb2F0KkFycmF5cywgdGhvdWdoLCBzaW5jZSBlLmcuICswID09PSAtMCBidXQgdGhlaXJcbiAgLy8gYml0IHBhdHRlcm5zIGFyZSBub3QgaWRlbnRpY2FsLlxuICB9IGVsc2UgaWYgKGlzVmlldyhhY3R1YWwpICYmIGlzVmlldyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICBwVG9TdHJpbmcoYWN0dWFsKSA9PT0gcFRvU3RyaW5nKGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgICEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5IHx8XG4gICAgICAgICAgICAgICBhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUobmV3IFVpbnQ4QXJyYXkoYWN0dWFsLmJ1ZmZlciksXG4gICAgICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoZXhwZWN0ZWQuYnVmZmVyKSkgPT09IDA7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICE9PSBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbWVtb3MgPSBtZW1vcyB8fCB7YWN0dWFsOiBbXSwgZXhwZWN0ZWQ6IFtdfTtcblxuICAgIHZhciBhY3R1YWxJbmRleCA9IG1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7XG4gICAgaWYgKGFjdHVhbEluZGV4ICE9PSAtMSkge1xuICAgICAgaWYgKGFjdHVhbEluZGV4ID09PSBtZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vcy5hY3R1YWwucHVzaChhY3R1YWwpO1xuICAgIG1lbW9zLmV4cGVjdGVkLnB1c2goZXhwZWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIsIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpIHtcbiAgaWYgKGEgPT09IG51bGwgfHwgYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwgfHwgYiA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gaWYgb25lIGlzIGEgcHJpbWl0aXZlLCB0aGUgb3RoZXIgbXVzdCBiZSBzYW1lXG4gIGlmICh1dGlsLmlzUHJpbWl0aXZlKGEpIHx8IHV0aWwuaXNQcmltaXRpdmUoYikpXG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIGlmIChzdHJpY3QgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGEpICE9PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB2YXIgYUlzQXJncyA9IGlzQXJndW1lbnRzKGEpO1xuICB2YXIgYklzQXJncyA9IGlzQXJndW1lbnRzKGIpO1xuICBpZiAoKGFJc0FyZ3MgJiYgIWJJc0FyZ3MpIHx8ICghYUlzQXJncyAmJiBiSXNBcmdzKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChhSXNBcmdzKSB7XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiLCBzdHJpY3QpO1xuICB9XG4gIHZhciBrYSA9IG9iamVjdEtleXMoYSk7XG4gIHZhciBrYiA9IG9iamVjdEtleXMoYik7XG4gIHZhciBrZXksIGk7XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT09IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9PSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbCA9IG5vdERlZXBTdHJpY3RFcXVhbDtcbmZ1bmN0aW9uIG5vdERlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcFN0cmljdEVxdWFsJywgbm90RGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufVxuXG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJZ25vcmUuICBUaGUgaW5zdGFuY2VvZiBjaGVjayBkb2Vzbid0IHdvcmsgZm9yIGFycm93IGZ1bmN0aW9ucy5cbiAgfVxuXG4gIGlmIChFcnJvci5pc1Byb3RvdHlwZU9mKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlO1xufVxuXG5mdW5jdGlvbiBfdHJ5QmxvY2soYmxvY2spIHtcbiAgdmFyIGVycm9yO1xuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodHlwZW9mIGJsb2NrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJibG9ja1wiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgYWN0dWFsID0gX3RyeUJsb2NrKGJsb2NrKTtcblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIHZhciB1c2VyUHJvdmlkZWRNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnO1xuICB2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiB1dGlsLmlzRXJyb3IoYWN0dWFsKTtcbiAgdmFyIGlzVW5leHBlY3RlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgIWV4cGVjdGVkO1xuXG4gIGlmICgoaXNVbndhbnRlZEV4Y2VwdGlvbiAmJlxuICAgICAgdXNlclByb3ZpZGVkTWVzc2FnZSAmJlxuICAgICAgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8XG4gICAgICBpc1VuZXhwZWN0ZWRFeGNlcHRpb24pIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3ModHJ1ZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKGZhbHNlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikgdGhyb3cgZXJyOyB9O1xuXG4vLyBFeHBvc2UgYSBzdHJpY3Qgb25seSB2YXJpYW50IG9mIGFzc2VydFxuZnVuY3Rpb24gc3RyaWN0KHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIHN0cmljdCk7XG59XG5hc3NlcnQuc3RyaWN0ID0gb2JqZWN0QXNzaWduKHN0cmljdCwgYXNzZXJ0LCB7XG4gIGVxdWFsOiBhc3NlcnQuc3RyaWN0RXF1YWwsXG4gIGRlZXBFcXVhbDogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCxcbiAgbm90RXF1YWw6IGFzc2VydC5ub3RTdHJpY3RFcXVhbCxcbiAgbm90RGVlcEVxdWFsOiBhc3NlcnQubm90RGVlcFN0cmljdEVxdWFsXG59KTtcbmFzc2VydC5zdHJpY3Quc3RyaWN0ID0gYXNzZXJ0LnN0cmljdDtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCIiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmVmOiBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1nbG9iYWxcbnZhciBnZXRHbG9iYWwgPSBmdW5jdGlvbiAoKSB7XG5cdC8vIHRoZSBvbmx5IHJlbGlhYmxlIG1lYW5zIHRvIGdldCB0aGUgZ2xvYmFsIG9iamVjdCBpc1xuXHQvLyBgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKWBcblx0Ly8gSG93ZXZlciwgdGhpcyBjYXVzZXMgQ1NQIHZpb2xhdGlvbnMgaW4gQ2hyb21lIGFwcHMuXG5cdGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHNlbGY7IH1cblx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiB3aW5kb3c7IH1cblx0aWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBnbG9iYWw7IH1cblx0dGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9jYXRlIGdsb2JhbCBvYmplY3QnKTtcbn1cblxudmFyIGdsb2JhbE9iamVjdCA9IGdldEdsb2JhbCgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBnbG9iYWxPYmplY3QuZmV0Y2g7XG5cbi8vIE5lZWRlZCBmb3IgVHlwZVNjcmlwdCBhbmQgV2VicGFjay5cbmlmIChnbG9iYWxPYmplY3QuZmV0Y2gpIHtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gZ2xvYmFsT2JqZWN0LmZldGNoLmJpbmQoZ2xvYmFsT2JqZWN0KTtcbn1cblxuZXhwb3J0cy5IZWFkZXJzID0gZ2xvYmFsT2JqZWN0LkhlYWRlcnM7XG5leHBvcnRzLlJlcXVlc3QgPSBnbG9iYWxPYmplY3QuUmVxdWVzdDtcbmV4cG9ydHMuUmVzcG9uc2UgPSBnbG9iYWxPYmplY3QuUmVzcG9uc2U7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbXBpbGUgPSBleHBvcnRzLm1ha2VOb250ZXJtaW5hbENvbnZlcnRlcnMgPSB2b2lkIDA7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5jb25zdCBhc3NlcnRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNvbnN0IHBhcnNlcl8xID0gcmVxdWlyZShcIi4vcGFyc2VyXCIpO1xuLyoqXG4gKiBDb252ZXJ0cyBzdHJpbmcgdG8gbm9udGVybWluYWwuXG4gKiBAcGFyYW0gPE5UPiBub250ZXJtaW5hbCBlbnVtZXJhdGlvblxuICogQHBhcmFtIG5vbnRlcm1pbmFscyByZXF1aXJlZCB0byBiZSB0aGUgcnVudGltZSBvYmplY3QgZm9yIHRoZSA8TlQ+IHR5cGUgcGFyYW1ldGVyXG4gKiBAcmV0dXJuIGEgcGFpciBvZiBjb252ZXJ0ZXJzIHsgbm9udGVybWluYWxUb1N0cmluZywgc3RyaW5nVG9Ob250ZXJtaW5hbCB9XG4gKiAgICAgICAgICAgICAgb25lIHRha2VzIGEgc3RyaW5nIChhbnkgYWxwaGFiZXRpYyBjYXNlKSBhbmQgcmV0dXJucyB0aGUgbm9udGVybWluYWwgaXQgbmFtZXNcbiAqICAgICAgICAgICAgICB0aGUgb3RoZXIgdGFrZXMgYSBub250ZXJtaW5hbCBhbmQgcmV0dXJucyBpdHMgc3RyaW5nIG5hbWUsIHVzaW5nIHRoZSBUeXBlc2NyaXB0IHNvdXJjZSBjYXBpdGFsaXphdGlvbi5cbiAqICAgICAgICAgQm90aCBjb252ZXJ0ZXJzIHRocm93IEdyYW1tYXJFcnJvciBpZiB0aGUgY29udmVyc2lvbiBjYW4ndCBiZSBkb25lLlxuICogQHRocm93cyBHcmFtbWFyRXJyb3IgaWYgTlQgaGFzIGEgbmFtZSBjb2xsaXNpb24gKHR3byBub250ZXJtaW5hbCBuYW1lcyB0aGF0IGRpZmZlciBvbmx5IGluIGNhcGl0YWxpemF0aW9uLFxuICogICAgICAgZS5nLiBST09UIGFuZCByb290KS5cbiAqL1xuZnVuY3Rpb24gbWFrZU5vbnRlcm1pbmFsQ29udmVydGVycyhub250ZXJtaW5hbHMpIHtcbiAgICAvLyBcImNhbm9uaWNhbCBuYW1lXCIgaXMgYSBjYXNlLWluZGVwZW5kZW50IG5hbWUgKGNhbm9uaWNhbGl6ZWQgdG8gbG93ZXJjYXNlKVxuICAgIC8vIFwic291cmNlIG5hbWVcIiBpcyB0aGUgbmFtZSBjYXBpdGFsaXplZCBhcyBpbiB0aGUgVHlwZXNjcmlwdCBzb3VyY2UgZGVmaW5pdGlvbiBvZiBOVFxuICAgIGNvbnN0IG5vbnRlcm1pbmFsRm9yQ2Fub25pY2FsTmFtZSA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBzb3VyY2VOYW1lRm9yTm9udGVybWluYWwgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobm9udGVybWluYWxzKSkge1xuICAgICAgICAvLyBpbiBUeXBlc2NyaXB0LCB0aGUgbm9udGVybWluYWxzIG9iamVjdCBjb21iaW5lcyBib3RoIGEgTlQtPm5hbWUgbWFwcGluZyBhbmQgbmFtZS0+TlQgbWFwcGluZy5cbiAgICAgICAgLy8gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svZW51bXMuaHRtbCNlbnVtcy1hdC1ydW50aW1lXG4gICAgICAgIC8vIFNvIGZpbHRlciBqdXN0IHRvIGtleXMgdGhhdCBhcmUgdmFsaWQgUGFyc2VybGliIG5vbnRlcm1pbmFsIG5hbWVzXG4gICAgICAgIGlmICgvXlthLXpBLVpfXVthLXpBLVpfMC05XSokLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZU5hbWUgPSBrZXk7XG4gICAgICAgICAgICBjb25zdCBjYW5vbmljYWxOYW1lID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBudCA9IG5vbnRlcm1pbmFsc1tzb3VyY2VOYW1lXTtcbiAgICAgICAgICAgIGlmIChub250ZXJtaW5hbEZvckNhbm9uaWNhbE5hbWUuaGFzKGNhbm9uaWNhbE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKCduYW1lIGNvbGxpc2lvbiBpbiBub250ZXJtaW5hbCBlbnVtZXJhdGlvbjogJ1xuICAgICAgICAgICAgICAgICAgICArIHNvdXJjZU5hbWVGb3JOb250ZXJtaW5hbC5nZXQobm9udGVybWluYWxGb3JDYW5vbmljYWxOYW1lLmdldChjYW5vbmljYWxOYW1lKSlcbiAgICAgICAgICAgICAgICAgICAgKyAnIGFuZCAnICsgc291cmNlTmFtZVxuICAgICAgICAgICAgICAgICAgICArICcgYXJlIHRoZSBzYW1lIHdoZW4gY29tcGFyZWQgY2FzZS1pbnNlbnNpdGl2ZWx5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub250ZXJtaW5hbEZvckNhbm9uaWNhbE5hbWUuc2V0KGNhbm9uaWNhbE5hbWUsIG50KTtcbiAgICAgICAgICAgIHNvdXJjZU5hbWVGb3JOb250ZXJtaW5hbC5zZXQobnQsIHNvdXJjZU5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5lcnJvcihzb3VyY2VOYW1lRm9yTm9udGVybWluYWwpO1xuICAgIGZ1bmN0aW9uIHN0cmluZ1RvTm9udGVybWluYWwobmFtZSkge1xuICAgICAgICBjb25zdCBjYW5vbmljYWxOYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIW5vbnRlcm1pbmFsRm9yQ2Fub25pY2FsTmFtZS5oYXMoY2Fub25pY2FsTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcignZ3JhbW1hciB1c2VzIG5vbnRlcm1pbmFsICcgKyBuYW1lICsgJywgd2hpY2ggaXMgbm90IGZvdW5kIGluIHRoZSBub250ZXJtaW5hbCBlbnVtZXJhdGlvbiBwYXNzZWQgdG8gY29tcGlsZSgpJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vbnRlcm1pbmFsRm9yQ2Fub25pY2FsTmFtZS5nZXQoY2Fub25pY2FsTmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5vbnRlcm1pbmFsVG9TdHJpbmcobnQpIHtcbiAgICAgICAgaWYgKCFzb3VyY2VOYW1lRm9yTm9udGVybWluYWwuaGFzKG50KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKCdub250ZXJtaW5hbCAnICsgbnQgKyAnIGlzIG5vdCBmb3VuZCBpbiB0aGUgbm9udGVybWluYWwgZW51bWVyYXRpb24gcGFzc2VkIHRvIGNvbXBpbGUoKScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VyY2VOYW1lRm9yTm9udGVybWluYWwuZ2V0KG50KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RyaW5nVG9Ob250ZXJtaW5hbCwgbm9udGVybWluYWxUb1N0cmluZyB9O1xufVxuZXhwb3J0cy5tYWtlTm9udGVybWluYWxDb252ZXJ0ZXJzID0gbWFrZU5vbnRlcm1pbmFsQ29udmVydGVycztcbnZhciBHcmFtbWFyTlQ7XG4oZnVuY3Rpb24gKEdyYW1tYXJOVCkge1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJHUkFNTUFSXCJdID0gMF0gPSBcIkdSQU1NQVJcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiUFJPRFVDVElPTlwiXSA9IDFdID0gXCJQUk9EVUNUSU9OXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlNLSVBCTE9DS1wiXSA9IDJdID0gXCJTS0lQQkxPQ0tcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiVU5JT05cIl0gPSAzXSA9IFwiVU5JT05cIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiQ09OQ0FURU5BVElPTlwiXSA9IDRdID0gXCJDT05DQVRFTkFUSU9OXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlJFUEVUSVRJT05cIl0gPSA1XSA9IFwiUkVQRVRJVElPTlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJSRVBFQVRPUEVSQVRPUlwiXSA9IDZdID0gXCJSRVBFQVRPUEVSQVRPUlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJVTklUXCJdID0gN10gPSBcIlVOSVRcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiTk9OVEVSTUlOQUxcIl0gPSA4XSA9IFwiTk9OVEVSTUlOQUxcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiVEVSTUlOQUxcIl0gPSA5XSA9IFwiVEVSTUlOQUxcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiUVVPVEVEU1RSSU5HXCJdID0gMTBdID0gXCJRVU9URURTVFJJTkdcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiTlVNQkVSXCJdID0gMTFdID0gXCJOVU1CRVJcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiUkFOR0VcIl0gPSAxMl0gPSBcIlJBTkdFXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlVQUEVSQk9VTkRcIl0gPSAxM10gPSBcIlVQUEVSQk9VTkRcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiTE9XRVJCT1VORFwiXSA9IDE0XSA9IFwiTE9XRVJCT1VORFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJDSEFSQUNURVJTRVRcIl0gPSAxNV0gPSBcIkNIQVJBQ1RFUlNFVFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJBTllDSEFSXCJdID0gMTZdID0gXCJBTllDSEFSXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkNIQVJBQ1RFUkNMQVNTXCJdID0gMTddID0gXCJDSEFSQUNURVJDTEFTU1wiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJXSElURVNQQUNFXCJdID0gMThdID0gXCJXSElURVNQQUNFXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIk9ORUxJTkVDT01NRU5UXCJdID0gMTldID0gXCJPTkVMSU5FQ09NTUVOVFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJCTE9DS0NPTU1FTlRcIl0gPSAyMF0gPSBcIkJMT0NLQ09NTUVOVFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJTS0lQXCJdID0gMjFdID0gXCJTS0lQXCI7XG59KShHcmFtbWFyTlQgfHwgKEdyYW1tYXJOVCA9IHt9KSk7XG47XG5mdW5jdGlvbiBudHQobm9udGVybWluYWwpIHtcbiAgICByZXR1cm4gKDAsIHBhcnNlcl8xLm50KShub250ZXJtaW5hbCwgR3JhbW1hck5UW25vbnRlcm1pbmFsXSk7XG59XG5jb25zdCBncmFtbWFyR3JhbW1hciA9IG5ldyBNYXAoKTtcbi8vIGdyYW1tYXIgOjo9ICggcHJvZHVjdGlvbiB8IHNraXBCbG9jayApK1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5HUkFNTUFSLCAoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLm9yKShudHQoR3JhbW1hck5ULlBST0RVQ1RJT04pLCBudHQoR3JhbW1hck5ULlNLSVBCTE9DSykpLCBudHQoR3JhbW1hck5ULlNLSVApKSkpKTtcbi8vIHNraXBCbG9jayA6Oj0gJ0Bza2lwJyBub250ZXJtaW5hbCAneycgcHJvZHVjdGlvbiogJ30nXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlNLSVBCTE9DSywgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoXCJAc2tpcFwiKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KShudHQoR3JhbW1hck5ULk5PTlRFUk1JTkFMKSksIG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdHIpKCd7JyksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkoKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuUFJPRFVDVElPTiksIG50dChHcmFtbWFyTlQuU0tJUCkpKSwgKDAsIHBhcnNlcl8xLnN0cikoJ30nKSkpKSk7XG4vLyBwcm9kdWN0aW9uIDo6PSBub250ZXJtaW5hbCAnOjo9JyB1bmlvbiAnOydcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuUFJPRFVDVElPTiwgKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5OT05URVJNSU5BTCksIG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdHIpKFwiOjo9XCIpLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKCgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuU0tJUCksIG50dChHcmFtbWFyTlQuVU5JT04pLCBudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RyKSgnOycpKSkpKTtcbi8vIHVuaW9uIDo6ID0gY29uY2F0ZW5hdGlvbiAoJ3wnIGNvbmNhdGVuYXRpb24pKlxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5VTklPTiwgKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5DT05DQVRFTkFUSU9OKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdHIpKCd8JyksIG50dChHcmFtbWFyTlQuU0tJUCksIG50dChHcmFtbWFyTlQuQ09OQ0FURU5BVElPTikpKSkpO1xuLy8gY29uY2F0ZW5hdGlvbiA6OiA9IHJlcGV0aXRpb24qIFxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5DT05DQVRFTkFUSU9OLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5SRVBFVElUSU9OKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSkpKTtcbi8vIHJlcGV0aXRpb24gOjo9IHVuaXQgcmVwZWF0T3BlcmF0b3I/XG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlJFUEVUSVRJT04sICgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuVU5JVCksIG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5vcHRpb24pKG50dChHcmFtbWFyTlQuUkVQRUFUT1BFUkFUT1IpKSkpO1xuLy8gcmVwZWF0T3BlcmF0b3IgOjo9IFsqKz9dIHwgJ3snICggbnVtYmVyIHwgcmFuZ2UgfCB1cHBlckJvdW5kIHwgbG93ZXJCb3VuZCApICd9J1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5SRVBFQVRPUEVSQVRPUiwgKDAsIHBhcnNlcl8xLm9yKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiWyorP11cIiksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKFwie1wiKSwgKDAsIHBhcnNlcl8xLm9yKShudHQoR3JhbW1hck5ULk5VTUJFUiksIG50dChHcmFtbWFyTlQuUkFOR0UpLCBudHQoR3JhbW1hck5ULlVQUEVSQk9VTkQpLCBudHQoR3JhbW1hck5ULkxPV0VSQk9VTkQpKSwgKDAsIHBhcnNlcl8xLnN0cikoXCJ9XCIpKSkpO1xuLy8gbnVtYmVyIDo6PSBbMC05XStcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuTlVNQkVSLCAoMCwgcGFyc2VyXzEucGx1cykoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlswLTldXCIpKSk7XG4vLyByYW5nZSA6Oj0gbnVtYmVyICcsJyBudW1iZXJcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuUkFOR0UsICgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuTlVNQkVSKSwgKDAsIHBhcnNlcl8xLnN0cikoXCIsXCIpLCBudHQoR3JhbW1hck5ULk5VTUJFUikpKTtcbi8vIHVwcGVyQm91bmQgOjo9ICcsJyBudW1iZXJcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuVVBQRVJCT1VORCwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoXCIsXCIpLCBudHQoR3JhbW1hck5ULk5VTUJFUikpKTtcbi8vIGxvd2VyQm91bmQgOjo9IG51bWJlciAnLCdcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuTE9XRVJCT1VORCwgKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5OVU1CRVIpLCAoMCwgcGFyc2VyXzEuc3RyKShcIixcIikpKTtcbi8vIHVuaXQgOjo9IG5vbnRlcm1pbmFsIHwgdGVybWluYWwgfCAnKCcgdW5pb24gJyknXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlVOSVQsICgwLCBwYXJzZXJfMS5vcikobnR0KEdyYW1tYXJOVC5OT05URVJNSU5BTCksIG50dChHcmFtbWFyTlQuVEVSTUlOQUwpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnKCcpLCBudHQoR3JhbW1hck5ULlNLSVApLCBudHQoR3JhbW1hck5ULlVOSU9OKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0cikoJyknKSkpKTtcbi8vIG5vbnRlcm1pbmFsIDo6PSBbYS16QS1aX11bYS16QS1aXzAtOV0qXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULk5PTlRFUk1JTkFMLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW2EtekEtWl9dXCIpLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlthLXpBLVpfMC05XVwiKSkpKTtcbi8vIHRlcm1pbmFsIDo6PSBxdW90ZWRTdHJpbmcgfCBjaGFyYWN0ZXJTZXQgfCBhbnlDaGFyIHwgY2hhcmFjdGVyQ2xhc3NcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuVEVSTUlOQUwsICgwLCBwYXJzZXJfMS5vcikobnR0KEdyYW1tYXJOVC5RVU9URURTVFJJTkcpLCBudHQoR3JhbW1hck5ULkNIQVJBQ1RFUlNFVCksIG50dChHcmFtbWFyTlQuQU5ZQ0hBUiksIG50dChHcmFtbWFyTlQuQ0hBUkFDVEVSQ0xBU1MpKSk7XG4vLyBxdW90ZWRTdHJpbmcgOjo9IFwiJ1wiIChbXidcXHJcXG5cXFxcXSB8ICdcXFxcJyAuICkqIFwiJ1wiIHwgJ1wiJyAoW15cIlxcclxcblxcXFxdIHwgJ1xcXFwnIC4gKSogJ1wiJ1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5RVU9URURTVFJJTkcsICgwLCBwYXJzZXJfMS5vcikoKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoXCInXCIpLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKCgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEub3IpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbXidcXHJcXG5cXFxcXFxcXF1cIiksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCdcXFxcJyksICgwLCBwYXJzZXJfMS5yZWdleCkoXCIuXCIpKSkpKSwgKDAsIHBhcnNlcl8xLnN0cikoXCInXCIpKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJ1wiJyksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkoKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5vcikoKDAsIHBhcnNlcl8xLnJlZ2V4KSgnW15cIlxcclxcblxcXFxcXFxcXScpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnXFxcXCcpLCAoMCwgcGFyc2VyXzEucmVnZXgpKFwiLlwiKSkpKSksICgwLCBwYXJzZXJfMS5zdHIpKCdcIicpKSkpO1xuLy8gY2hhcmFjdGVyU2V0IDo6PSAnWycgKFteXFxdXFxyXFxuXFxcXF0gfCAnXFxcXCcgLiApKyAnXSdcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuQ0hBUkFDVEVSU0VULCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnWycpLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKCgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5wbHVzKSgoMCwgcGFyc2VyXzEub3IpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbXlxcXFxdXFxyXFxuXFxcXFxcXFxdXCIpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnXFxcXCcpLCAoMCwgcGFyc2VyXzEucmVnZXgpKFwiLlwiKSkpKSkpLCAoMCwgcGFyc2VyXzEuc3RyKSgnXScpKSk7XG4vLyBhbnlDaGFyIDo6PSAnLidcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuQU5ZQ0hBUiwgKDAsIHBhcnNlcl8xLnN0cikoJy4nKSk7XG4vLyBjaGFyYWN0ZXJDbGFzcyA6Oj0gJ1xcXFwnIFtkc3ddXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkNIQVJBQ1RFUkNMQVNTLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnXFxcXCcpLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbZHN3XVwiKSkpKTtcbi8vIHdoaXRlc3BhY2UgOjo9IFsgXFx0XFxyXFxuXVxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5XSElURVNQQUNFLCAoMCwgcGFyc2VyXzEucmVnZXgpKFwiWyBcXHRcXHJcXG5dXCIpKTtcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuT05FTElORUNPTU1FTlQsICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKFwiLy9cIiksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW15cXHJcXG5dXCIpKSwgKDAsIHBhcnNlcl8xLm9yKSgoMCwgcGFyc2VyXzEuc3RyKShcIlxcclxcblwiKSwgKDAsIHBhcnNlcl8xLnN0cikoJ1xcbicpLCAoMCwgcGFyc2VyXzEuc3RyKSgnXFxyJykpKSk7XG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkJMT0NLQ09NTUVOVCwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoXCIvKlwiKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbXipdXCIpKSwgKDAsIHBhcnNlcl8xLnN0cikoJyonKSksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW14vXVwiKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbXipdXCIpKSwgKDAsIHBhcnNlcl8xLnN0cikoJyonKSkpLCAoMCwgcGFyc2VyXzEuc3RyKSgnLycpKSk7XG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlNLSVAsICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEub3IpKG50dChHcmFtbWFyTlQuV0hJVEVTUEFDRSksIG50dChHcmFtbWFyTlQuT05FTElORUNPTU1FTlQpLCBudHQoR3JhbW1hck5ULkJMT0NLQ09NTUVOVCkpKSk7XG5jb25zdCBncmFtbWFyUGFyc2VyID0gbmV3IHBhcnNlcl8xLkludGVybmFsUGFyc2VyKGdyYW1tYXJHcmFtbWFyLCBudHQoR3JhbW1hck5ULkdSQU1NQVIpLCAobnQpID0+IEdyYW1tYXJOVFtudF0pO1xuLyoqXG4gKiBDb21waWxlIGEgUGFyc2VyIGZyb20gYSBncmFtbWFyIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nLlxuICogQHBhcmFtIDxOVD4gYSBUeXBlc2NyaXB0IEVudW0gd2l0aCBvbmUgc3ltYm9sIGZvciBlYWNoIG5vbnRlcm1pbmFsIHVzZWQgaW4gdGhlIGdyYW1tYXIsXG4gKiAgICAgICAgbWF0Y2hpbmcgdGhlIG5vbnRlcm1pbmFscyB3aGVuIGNvbXBhcmVkIGNhc2UtaW5zZW5zaXRpdmVseSAoc28gUk9PVCBhbmQgUm9vdCBhbmQgcm9vdCBhcmUgdGhlIHNhbWUpLlxuICogQHBhcmFtIGdyYW1tYXIgdGhlIGdyYW1tYXIgdG8gdXNlXG4gKiBAcGFyYW0gbm9udGVybWluYWxzIHRoZSBydW50aW1lIG9iamVjdCBvZiB0aGUgbm9udGVybWluYWxzIGVudW0uIEZvciBleGFtcGxlLCBpZlxuICogICAgICAgICAgICAgZW51bSBOb250ZXJtaW5hbHMgeyByb290LCBhLCBiLCBjIH07XG4gKiAgICAgICAgdGhlbiBOb250ZXJtaW5hbHMgbXVzdCBiZSBleHBsaWNpdGx5IHBhc3NlZCBhcyB0aGlzIHJ1bnRpbWUgcGFyYW1ldGVyXG4gKiAgICAgICAgICAgICAgY29tcGlsZShncmFtbWFyLCBOb250ZXJtaW5hbHMsIE5vbnRlcm1pbmFscy5yb290KTtcbiAqICAgICAgICAoaW4gYWRkaXRpb24gdG8gYmVpbmcgaW1wbGljaXRseSB1c2VkIGZvciB0aGUgdHlwZSBwYXJhbWV0ZXIgTlQpXG4gKiBAcGFyYW0gcm9vdE5vbnRlcm1pbmFsIHRoZSBkZXNpcmVkIHJvb3Qgbm9udGVybWluYWwgaW4gdGhlIGdyYW1tYXJcbiAqIEByZXR1cm4gYSBwYXJzZXIgZm9yIHRoZSBnaXZlbiBncmFtbWFyIHRoYXQgd2lsbCBzdGFydCBwYXJzaW5nIGF0IHJvb3ROb250ZXJtaW5hbC5cbiAqIEB0aHJvd3MgUGFyc2VFcnJvciBpZiB0aGUgZ3JhbW1hciBoYXMgYSBzeW50YXggZXJyb3JcbiAqL1xuZnVuY3Rpb24gY29tcGlsZShncmFtbWFyLCBub250ZXJtaW5hbHMsIHJvb3ROb250ZXJtaW5hbCkge1xuICAgIGNvbnN0IHsgc3RyaW5nVG9Ob250ZXJtaW5hbCwgbm9udGVybWluYWxUb1N0cmluZyB9ID0gbWFrZU5vbnRlcm1pbmFsQ29udmVydGVycyhub250ZXJtaW5hbHMpO1xuICAgIGNvbnN0IGdyYW1tYXJUcmVlID0gKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBncmFtbWFyUGFyc2VyLnBhcnNlKGdyYW1tYXIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyAoZSBpbnN0YW5jZW9mIHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKSA/IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcihcImdyYW1tYXIgZG9lc24ndCBjb21waWxlXCIsIGUpIDogZTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3Qgbm9udGVybWluYWxzRGVmaW5lZCA9IG5ldyBTZXQoKTsgLy8gb24gbGVmdGhhbmQtc2lkZSBvZiBzb21lIHByb2R1Y3Rpb25cbiAgICBjb25zdCBub250ZXJtaW5hbHNVc2VkID0gbmV3IFNldCgpOyAvLyBvbiByaWdodGhhbmQtc2lkZSBvZiBzb21lIHByb2R1Y3Rpb25cbiAgICAvLyBwcm9kdWN0aW9ucyBvdXRzaWRlIEBza2lwIGJsb2Nrc1xuICAgIG1ha2VQcm9kdWN0aW9ucyhncmFtbWFyVHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuUFJPRFVDVElPTiksIG51bGwpO1xuICAgIC8vIHByb2R1Y3Rpb25zIGluc2lkZSBAc2tpcCBibG9ja3NcbiAgICBmb3IgKGNvbnN0IHNraXBCbG9jayBvZiBncmFtbWFyVHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuU0tJUEJMT0NLKSkge1xuICAgICAgICBtYWtlU2tpcEJsb2NrKHNraXBCbG9jayk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgbnQgb2Ygbm9udGVybWluYWxzVXNlZCkge1xuICAgICAgICBpZiAoIW5vbnRlcm1pbmFsc0RlZmluZWQuaGFzKG50KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKFwiZ3JhbW1hciBpcyBtaXNzaW5nIGEgZGVmaW5pdGlvbiBmb3IgXCIgKyBub250ZXJtaW5hbFRvU3RyaW5nKG50KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFub250ZXJtaW5hbHNEZWZpbmVkLmhhcyhyb290Tm9udGVybWluYWwpKSB7XG4gICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcihcImdyYW1tYXIgaXMgbWlzc2luZyBhIGRlZmluaXRpb24gZm9yIHRoZSByb290IG5vbnRlcm1pbmFsIFwiICsgbm9udGVybWluYWxUb1N0cmluZyhyb290Tm9udGVybWluYWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBwYXJzZXJfMS5JbnRlcm5hbFBhcnNlcihkZWZpbml0aW9ucywgKDAsIHBhcnNlcl8xLm50KShyb290Tm9udGVybWluYWwsIG5vbnRlcm1pbmFsVG9TdHJpbmcocm9vdE5vbnRlcm1pbmFsKSksIG5vbnRlcm1pbmFsVG9TdHJpbmcpO1xuICAgIGZ1bmN0aW9uIG1ha2VQcm9kdWN0aW9ucyhwcm9kdWN0aW9ucywgc2tpcCkge1xuICAgICAgICBmb3IgKGNvbnN0IHByb2R1Y3Rpb24gb2YgcHJvZHVjdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vbnRlcm1pbmFsTmFtZSA9IHByb2R1Y3Rpb24uY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULk5PTlRFUk1JTkFMKVswXS50ZXh0O1xuICAgICAgICAgICAgY29uc3Qgbm9udGVybWluYWwgPSBzdHJpbmdUb05vbnRlcm1pbmFsKG5vbnRlcm1pbmFsTmFtZSk7XG4gICAgICAgICAgICBub250ZXJtaW5hbHNEZWZpbmVkLmFkZChub250ZXJtaW5hbCk7XG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IG1ha2VHcmFtbWFyVGVybShwcm9kdWN0aW9uLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5VTklPTilbMF0sIHNraXApO1xuICAgICAgICAgICAgaWYgKHNraXApXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICgwLCBwYXJzZXJfMS5jYXQpKHNraXAsIGV4cHJlc3Npb24sIHNraXApO1xuICAgICAgICAgICAgaWYgKGRlZmluaXRpb25zLmhhcyhub250ZXJtaW5hbCkpIHtcbiAgICAgICAgICAgICAgICAvLyBncmFtbWFyIGFscmVhZHkgaGFzIGEgcHJvZHVjdGlvbiBmb3IgdGhpcyBub250ZXJtaW5hbDsgb3IgZXhwcmVzc2lvbiBvbnRvIGl0XG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbnMuc2V0KG5vbnRlcm1pbmFsLCAoMCwgcGFyc2VyXzEub3IpKGRlZmluaXRpb25zLmdldChub250ZXJtaW5hbCksIGV4cHJlc3Npb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmluaXRpb25zLnNldChub250ZXJtaW5hbCwgZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZVNraXBCbG9jayhza2lwQmxvY2spIHtcbiAgICAgICAgY29uc3Qgbm9udGVybWluYWxOYW1lID0gc2tpcEJsb2NrLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5OT05URVJNSU5BTClbMF0udGV4dDtcbiAgICAgICAgY29uc3Qgbm9udGVybWluYWwgPSBzdHJpbmdUb05vbnRlcm1pbmFsKG5vbnRlcm1pbmFsTmFtZSk7XG4gICAgICAgIG5vbnRlcm1pbmFsc1VzZWQuYWRkKG5vbnRlcm1pbmFsKTtcbiAgICAgICAgY29uc3Qgc2tpcFRlcm0gPSAoMCwgcGFyc2VyXzEuc2tpcCkoKDAsIHBhcnNlcl8xLm50KShub250ZXJtaW5hbCwgbm9udGVybWluYWxOYW1lKSk7XG4gICAgICAgIG1ha2VQcm9kdWN0aW9ucyhza2lwQmxvY2suY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlBST0RVQ1RJT04pLCBza2lwVGVybSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VHcmFtbWFyVGVybSh0cmVlLCBza2lwKSB7XG4gICAgICAgIHN3aXRjaCAodHJlZS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5VTklPTjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkZXhwcnMgPSB0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5DT05DQVRFTkFUSU9OKS5tYXAoY2hpbGQgPT4gbWFrZUdyYW1tYXJUZXJtKGNoaWxkLCBza2lwKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkZXhwcnMubGVuZ3RoID09IDEgPyBjaGlsZGV4cHJzWzBdIDogKDAsIHBhcnNlcl8xLm9yKSguLi5jaGlsZGV4cHJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULkNPTkNBVEVOQVRJT046IHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRleHBycyA9IHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlJFUEVUSVRJT04pLm1hcChjaGlsZCA9PiBtYWtlR3JhbW1hclRlcm0oY2hpbGQsIHNraXApKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpbnNlcnQgc2tpcCBiZXR3ZWVuIGVhY2ggcGFpciBvZiBjaGlsZHJlblxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW5XaXRoU2tpcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZGV4cHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW5XaXRoU2tpcHMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbldpdGhTa2lwcy5wdXNoKHNraXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5XaXRoU2tpcHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2hpbGRleHBycyA9IGNoaWxkcmVuV2l0aFNraXBzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKGNoaWxkZXhwcnMubGVuZ3RoID09IDEpID8gY2hpbGRleHByc1swXSA6ICgwLCBwYXJzZXJfMS5jYXQpKC4uLmNoaWxkZXhwcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuUkVQRVRJVElPTjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXQgPSBtYWtlR3JhbW1hclRlcm0odHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuVU5JVClbMF0sIHNraXApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wID0gdHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuUkVQRUFUT1BFUkFUT1IpWzBdO1xuICAgICAgICAgICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1bml0V2l0aFNraXAgPSBza2lwID8gKDAsIHBhcnNlcl8xLmNhdCkodW5pdCwgc2tpcCkgOiB1bml0O1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvcCBpcycsIG9wKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChvcC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcqJzogcmV0dXJuICgwLCBwYXJzZXJfMS5zdGFyKSh1bml0V2l0aFNraXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnKyc6IHJldHVybiAoMCwgcGFyc2VyXzEucGx1cykodW5pdFdpdGhTa2lwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJz8nOiByZXR1cm4gKDAsIHBhcnNlcl8xLm9wdGlvbikodW5pdFdpdGhTa2lwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcCBpcyB7bixtfSBvciBvbmUgb2YgaXRzIHZhcmlhbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBvcC5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJhbmdlLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuTlVNQkVSOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gcGFyc2VJbnQocmFuZ2UudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLnJlcGVhdCkodW5pdFdpdGhTa2lwLCBuZXcgcGFyc2VyXzEuQmV0d2VlbihuLCBuKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5SQU5HRToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHBhcnNlSW50KHJhbmdlLmNoaWxkcmVuWzBdLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbSA9IHBhcnNlSW50KHJhbmdlLmNoaWxkcmVuWzFdLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5yZXBlYXQpKHVuaXRXaXRoU2tpcCwgbmV3IHBhcnNlcl8xLkJldHdlZW4obiwgbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuVVBQRVJCT1VORDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbSA9IHBhcnNlSW50KHJhbmdlLmNoaWxkcmVuWzBdLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5yZXBlYXQpKHVuaXRXaXRoU2tpcCwgbmV3IHBhcnNlcl8xLkJldHdlZW4oMCwgbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuTE9XRVJCT1VORDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHBhcnNlSW50KHJhbmdlLmNoaWxkcmVuWzBdLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5yZXBlYXQpKHVuaXRXaXRoU2tpcCwgbmV3IHBhcnNlcl8xLkF0TGVhc3QobikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW50ZXJuYWwgZXJyb3I6IHVua25vd24gcmFuZ2U6ICcgKyByYW5nZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5VTklUOlxuICAgICAgICAgICAgICAgIHJldHVybiBtYWtlR3JhbW1hclRlcm0odHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuTk9OVEVSTUlOQUwpWzBdXG4gICAgICAgICAgICAgICAgICAgIHx8IHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlRFUk1JTkFMKVswXVxuICAgICAgICAgICAgICAgICAgICB8fCB0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5VTklPTilbMF0sIHNraXApO1xuICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuTk9OVEVSTUlOQUw6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBub250ZXJtaW5hbCA9IHN0cmluZ1RvTm9udGVybWluYWwodHJlZS50ZXh0KTtcbiAgICAgICAgICAgICAgICBub250ZXJtaW5hbHNVc2VkLmFkZChub250ZXJtaW5hbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5udCkobm9udGVybWluYWwsIHRyZWUudGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5URVJNSU5BTDpcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRyZWUuY2hpbGRyZW5bMF0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5RVU9URURTVFJJTkc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLnN0cikoc3RyaXBRdW90ZXNBbmRSZXBsYWNlRXNjYXBlU2VxdWVuY2VzKHRyZWUudGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5DSEFSQUNURVJTRVQ6IC8vIGUuZy4gW2FiY11cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuQU5ZQ0hBUjogLy8gZS5nLiAgLlxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5DSEFSQUNURVJDTEFTUzogLy8gZS5nLiAgXFxkICBcXHMgIFxcd1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5yZWdleCkodHJlZS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW50ZXJuYWwgZXJyb3I6IHVua25vd24gbGl0ZXJhbDogJyArIHRyZWUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnRlcm5hbCBlcnJvcjogdW5rbm93biBncmFtbWFyIHJ1bGU6ICcgKyB0cmVlLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0cmlwIHN0YXJ0aW5nIGFuZCBlbmRpbmcgcXVvdGVzLlxuICAgICAqIFJlcGxhY2UgXFx0LCBcXHIsIFxcbiB3aXRoIHRoZWlyIGNoYXJhY3RlciBjb2Rlcy5cbiAgICAgKiBSZXBsYWNlcyBhbGwgb3RoZXIgXFx4IHdpdGggbGl0ZXJhbCB4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0cmlwUXVvdGVzQW5kUmVwbGFjZUVzY2FwZVNlcXVlbmNlcyhzKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShzWzBdID09ICdcIicgfHwgc1swXSA9PSBcIidcIik7XG4gICAgICAgIHMgPSBzLnN1YnN0cmluZygxLCBzLmxlbmd0aCAtIDEpO1xuICAgICAgICBzID0gcy5yZXBsYWNlKC9cXFxcKC4pL2csIChtYXRjaCwgZXNjYXBlZENoYXIpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXNjYXBlZENoYXIpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0JzogcmV0dXJuICdcXHQnO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3InOiByZXR1cm4gJ1xccic7XG4gICAgICAgICAgICAgICAgY2FzZSAnbic6IHJldHVybiAnXFxuJztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZXNjYXBlZENoYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG59XG5leHBvcnRzLmNvbXBpbGUgPSBjb21waWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGlsZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluZGVudCA9IGV4cG9ydHMuc25pcHBldCA9IGV4cG9ydHMuZXNjYXBlRm9yUmVhZGluZyA9IGV4cG9ydHMudG9Db2x1bW4gPSBleHBvcnRzLnRvTGluZSA9IGV4cG9ydHMuZGVzY3JpYmVMb2NhdGlvbiA9IGV4cG9ydHMubWFrZUVycm9yTWVzc2FnZSA9IHZvaWQgMDtcbi8qKlxuICogTWFrZSBhIGh1bWFuLXJlYWRhYmxlIGVycm9yIG1lc3NhZ2UgZXhwbGFpbmluZyBhIHBhcnNlIGVycm9yIGFuZCB3aGVyZSBpdCB3YXMgZm91bmQgaW4gdGhlIGlucHV0LlxuICogQHBhcmFtIG1lc3NhZ2UgYnJpZWYgbWVzc2FnZSBzdGF0aW5nIHdoYXQgZXJyb3Igb2NjdXJyZWRcbiAqIEBwYXJhbSBub250ZXJtaW5hbE5hbWUgbmFtZSBvZiBkZWVwZXN0IG5vbnRlcm1pbmFsIHRoYXQgcGFyc2VyIHdhcyB0cnlpbmcgdG8gbWF0Y2ggd2hlbiBwYXJzZSBmYWlsZWRcbiAqIEBwYXJhbSBleHBlY3RlZFRleHQgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24gb2Ygd2hhdCBzdHJpbmcgbGl0ZXJhbHMgdGhlIHBhcnNlciB3YXMgZXhwZWN0aW5nIHRoZXJlO1xuICogICAgICAgICAgICBlLmcuIFwiO1wiLCBcIlsgXFxyXFxuXFx0XVwiLCBcIjF8MnwzXCJcbiAqIEBwYXJhbSBzdHJpbmdCZWluZ1BhcnNlZCBvcmlnaW5hbCBpbnB1dCB0byBwYXJzZSgpXG4gKiBAcGFyYW0gcG9zIG9mZnNldCBpbiBzdHJpbmdCZWluZ1BhcnNlZCB3aGVyZSBlcnJvciBvY2N1cnJlZFxuICogQHBhcmFtIG5hbWVPZlN0cmluZ0JlaW5nUGFyc2VkIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uIG9mIHdoZXJlIHN0cmluZ0JlaW5nUGFyc2VkIGNhbWUgZnJvbTtcbiAqICAgICAgICAgICAgIGUuZy4gXCJncmFtbWFyXCIgaWYgc3RyaW5nQmVpbmdQYXJzZWQgd2FzIHRoZSBpbnB1dCB0byBQYXJzZXIuY29tcGlsZSgpLFxuICogICAgICAgICAgICAgb3IgXCJzdHJpbmcgYmVpbmcgcGFyc2VkXCIgaWYgc3RyaW5nQmVpbmdQYXJzZWQgd2FzIHRoZSBpbnB1dCB0byBQYXJzZXIucGFyc2UoKVxuICogQHJldHVybiBhIG11bHRpbGluZSBodW1hbi1yZWFkYWJsZSBtZXNzYWdlIHRoYXQgc3RhdGVzIHRoZSBlcnJvciwgaXRzIGxvY2F0aW9uIGluIHRoZSBpbnB1dCxcbiAqICAgICAgICAgd2hhdCB0ZXh0IHdhcyBleHBlY3RlZCBhbmQgd2hhdCB0ZXh0IHdhcyBhY3R1YWxseSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gbWFrZUVycm9yTWVzc2FnZShtZXNzYWdlLCBub250ZXJtaW5hbE5hbWUsIGV4cGVjdGVkVGV4dCwgc3RyaW5nQmVpbmdQYXJzZWQsIHBvcywgbmFtZU9mU3RyaW5nQmVpbmdQYXJzZWQpIHtcbiAgICBsZXQgcmVzdWx0ID0gbWVzc2FnZTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApXG4gICAgICAgIHJlc3VsdCArPSBcIlxcblwiO1xuICAgIHJlc3VsdCArPVxuICAgICAgICBcIkVycm9yIGF0IFwiICsgZGVzY3JpYmVMb2NhdGlvbihzdHJpbmdCZWluZ1BhcnNlZCwgcG9zKSArIFwiIG9mIFwiICsgbmFtZU9mU3RyaW5nQmVpbmdQYXJzZWQgKyBcIlxcblwiXG4gICAgICAgICAgICArIFwiICB0cnlpbmcgdG8gbWF0Y2ggXCIgKyBub250ZXJtaW5hbE5hbWUudG9VcHBlckNhc2UoKSArIFwiXFxuXCJcbiAgICAgICAgICAgICsgXCIgIGV4cGVjdGVkIFwiICsgZXNjYXBlRm9yUmVhZGluZyhleHBlY3RlZFRleHQsIFwiXCIpXG4gICAgICAgICAgICArICgoc3RyaW5nQmVpbmdQYXJzZWQubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICA/IFwiXFxuICAgYnV0IHNhdyBcIiArIHNuaXBwZXQoc3RyaW5nQmVpbmdQYXJzZWQsIHBvcylcbiAgICAgICAgICAgICAgICA6IFwiXCIpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLm1ha2VFcnJvck1lc3NhZ2UgPSBtYWtlRXJyb3JNZXNzYWdlO1xuLyoqXG4gKiBAcGFyYW0gc3RyaW5nIHRvIGRlc2NyaWJlXG4gKiBAcGFyYW0gcG9zIG9mZnNldCBpbiBzdHJpbmcsIDA8PXBvczxzdHJpbmcubGVuZ3RoKClcbiAqIEByZXR1cm4gYSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvbiBvZiB0aGUgbG9jYXRpb24gb2YgdGhlIGNoYXJhY3RlciBhdCBvZmZzZXQgcG9zIGluIHN0cmluZ1xuICogKHVzaW5nIG9mZnNldCBhbmQvb3IgbGluZS9jb2x1bW4gaWYgYXBwcm9wcmlhdGUpXG4gKi9cbmZ1bmN0aW9uIGRlc2NyaWJlTG9jYXRpb24ocywgcG9zKSB7XG4gICAgbGV0IHJlc3VsdCA9IFwib2Zmc2V0IFwiICsgcG9zO1xuICAgIGlmIChzLmluZGV4T2YoJ1xcbicpICE9IC0xKSB7XG4gICAgICAgIHJlc3VsdCArPSBcIiAobGluZSBcIiArIHRvTGluZShzLCBwb3MpICsgXCIgY29sdW1uIFwiICsgdG9Db2x1bW4ocywgcG9zKSArIFwiKVwiO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5kZXNjcmliZUxvY2F0aW9uID0gZGVzY3JpYmVMb2NhdGlvbjtcbi8qKlxuICogVHJhbnNsYXRlcyBhIHN0cmluZyBvZmZzZXQgaW50byBhIGxpbmUgbnVtYmVyLlxuICogQHBhcmFtIHN0cmluZyBpbiB3aGljaCBvZmZzZXQgb2NjdXJzXG4gKiBAcGFyYW0gcG9zIG9mZnNldCBpbiBzdHJpbmcsIDA8PXBvczxzdHJpbmcubGVuZ3RoKClcbiAqIEByZXR1cm4gdGhlIDEtYmFzZWQgbGluZSBudW1iZXIgb2YgdGhlIGNoYXJhY3RlciBhdCBvZmZzZXQgcG9zIGluIHN0cmluZyxcbiAqIGFzIGlmIHN0cmluZyB3ZXJlIGJlaW5nIHZpZXdlZCBpbiBhIHRleHQgZWRpdG9yXG4gKi9cbmZ1bmN0aW9uIHRvTGluZShzLCBwb3MpIHtcbiAgICBsZXQgbGluZUNvdW50ID0gMTtcbiAgICBmb3IgKGxldCBuZXdsaW5lID0gcy5pbmRleE9mKCdcXG4nKTsgbmV3bGluZSAhPSAtMSAmJiBuZXdsaW5lIDwgcG9zOyBuZXdsaW5lID0gcy5pbmRleE9mKCdcXG4nLCBuZXdsaW5lICsgMSkpIHtcbiAgICAgICAgKytsaW5lQ291bnQ7XG4gICAgfVxuICAgIHJldHVybiBsaW5lQ291bnQ7XG59XG5leHBvcnRzLnRvTGluZSA9IHRvTGluZTtcbi8qKlxuICogVHJhbnNsYXRlcyBhIHN0cmluZyBvZmZzZXQgaW50byBhIGNvbHVtbiBudW1iZXIuXG4gKiBAcGFyYW0gc3RyaW5nIGluIHdoaWNoIG9mZnNldCBvY2N1cnNcbiAqIEBwYXJhbSBwb3Mgb2Zmc2V0IGluIHN0cmluZywgMDw9cG9zPHN0cmluZy5sZW5ndGgoKVxuICogQHJldHVybiB0aGUgMS1iYXNlZCBjb2x1bW4gbnVtYmVyIG9mIHRoZSBjaGFyYWN0ZXIgYXQgb2Zmc2V0IHBvcyBpbiBzdHJpbmcsXG4gKiBhcyBpZiBzdHJpbmcgd2VyZSBiZWluZyB2aWV3ZWQgaW4gYSB0ZXh0IGVkaXRvciB3aXRoIHRhYiBzaXplIDEgKGkuZS4gYSB0YWIgaXMgdHJlYXRlZCBsaWtlIGEgc3BhY2UpXG4gKi9cbmZ1bmN0aW9uIHRvQ29sdW1uKHMsIHBvcykge1xuICAgIGNvbnN0IGxhc3ROZXdsaW5lQmVmb3JlUG9zID0gcy5sYXN0SW5kZXhPZignXFxuJywgcG9zIC0gMSk7XG4gICAgY29uc3QgdG90YWxTaXplT2ZQcmVjZWRpbmdMaW5lcyA9IChsYXN0TmV3bGluZUJlZm9yZVBvcyAhPSAtMSkgPyBsYXN0TmV3bGluZUJlZm9yZVBvcyArIDEgOiAwO1xuICAgIHJldHVybiBwb3MgLSB0b3RhbFNpemVPZlByZWNlZGluZ0xpbmVzICsgMTtcbn1cbmV4cG9ydHMudG9Db2x1bW4gPSB0b0NvbHVtbjtcbi8qKlxuKiBSZXBsYWNlIGNvbW1vbiB1bnByaW50YWJsZSBjaGFyYWN0ZXJzIGJ5IHRoZWlyIGVzY2FwZSBjb2RlcywgZm9yIGh1bWFuIHJlYWRpbmcuXG4qIFNob3VsZCBiZSBpZGVtcG90ZW50LCBpLmUuIGlmIHggPSBlc2NhcGVGb3JSZWFkaW5nKHkpLCB0aGVuIHguZXF1YWxzKGVzY2FwZUZvclJlYWRpbmcoeCkpLlxuKiBAcGFyYW0gc3RyaW5nIHRvIGVzY2FwZVxuKiBAcGFyYW0gcXVvdGUgcXVvdGVzIHRvIHB1dCBhcm91bmQgc3RyaW5nLCBvciBcIlwiIGlmIG5vIHF1b3RlcyByZXF1aXJlZFxuKiBAcmV0dXJuIHN0cmluZyB3aXRoIGVzY2FwZSBjb2RlcyByZXBsYWNlZCwgcHJlY2VkZWQgYW5kIGZvbGxvd2VkIGJ5IHF1b3RlLCB3aXRoIGEgaHVtYW4tcmVhZGFibGUgbGVnZW5kIGFwcGVuZGVkIHRvIHRoZSBlbmRcbiogICAgICAgICBleHBsYWluaW5nIHdoYXQgdGhlIHJlcGxhY2VtZW50IGNoYXJhY3RlcnMgbWVhbi5cbiovXG5mdW5jdGlvbiBlc2NhcGVGb3JSZWFkaW5nKHMsIHF1b3RlKSB7XG4gICAgbGV0IHJlc3VsdCA9IHM7XG4gICAgY29uc3QgbGVnZW5kID0gW107XG4gICAgZm9yIChjb25zdCB7IHVucHJpbnRhYmxlQ2hhciwgaHVtYW5SZWFkYWJsZVZlcnNpb24sIGRlc2NyaXB0aW9uIH0gb2YgRVNDQVBFUykge1xuICAgICAgICBpZiAocmVzdWx0LmluY2x1ZGVzKHVucHJpbnRhYmxlQ2hhcikpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKHVucHJpbnRhYmxlQ2hhciwgaHVtYW5SZWFkYWJsZVZlcnNpb24pO1xuICAgICAgICAgICAgbGVnZW5kLnB1c2goaHVtYW5SZWFkYWJsZVZlcnNpb24gKyBcIiBtZWFucyBcIiArIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQgPSBxdW90ZSArIHJlc3VsdCArIHF1b3RlO1xuICAgIGlmIChsZWdlbmQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXN1bHQgKz0gXCIgKHdoZXJlIFwiICsgbGVnZW5kLmpvaW4oXCIsIFwiKSArIFwiKVwiO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5lc2NhcGVGb3JSZWFkaW5nID0gZXNjYXBlRm9yUmVhZGluZztcbmNvbnN0IEVTQ0FQRVMgPSBbXG4gICAge1xuICAgICAgICB1bnByaW50YWJsZUNoYXI6IFwiXFxuXCIsXG4gICAgICAgIGh1bWFuUmVhZGFibGVWZXJzaW9uOiBcIlxcdTI0MjRcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwibmV3bGluZVwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHVucHJpbnRhYmxlQ2hhcjogXCJcXHJcIixcbiAgICAgICAgaHVtYW5SZWFkYWJsZVZlcnNpb246IFwiXFx1MjQwRFwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJjYXJyaWFnZSByZXR1cm5cIlxuICAgIH0sXG4gICAge1xuICAgICAgICB1bnByaW50YWJsZUNoYXI6IFwiXFx0XCIsXG4gICAgICAgIGh1bWFuUmVhZGFibGVWZXJzaW9uOiBcIlxcdTIxRTVcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwidGFiXCJcbiAgICB9LFxuXTtcbi8qKlxuICogQHBhcmFtIHN0cmluZyB0byBzaG9ydGVuXG4gKiBAcGFyYW0gcG9zIG9mZnNldCBpbiBzdHJpbmcsIDA8PXBvczxzdHJpbmcubGVuZ3RoKClcbiAqIEByZXR1cm4gYSBzaG9ydCBzbmlwcGV0IG9mIHRoZSBwYXJ0IG9mIHN0cmluZyBzdGFydGluZyBhdCBvZmZzZXQgcG9zLFxuICogaW4gaHVtYW4tcmVhZGFibGUgZm9ybVxuICovXG5mdW5jdGlvbiBzbmlwcGV0KHMsIHBvcykge1xuICAgIGNvbnN0IG1heENoYXJzVG9TaG93ID0gMTA7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4ocG9zICsgbWF4Q2hhcnNUb1Nob3csIHMubGVuZ3RoKTtcbiAgICBsZXQgcmVzdWx0ID0gcy5zdWJzdHJpbmcocG9zLCBlbmQpICsgKGVuZCA8IHMubGVuZ3RoID8gXCIuLi5cIiA6IFwiXCIpO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApXG4gICAgICAgIHJlc3VsdCA9IFwiZW5kIG9mIHN0cmluZ1wiO1xuICAgIHJldHVybiBlc2NhcGVGb3JSZWFkaW5nKHJlc3VsdCwgXCJcIik7XG59XG5leHBvcnRzLnNuaXBwZXQgPSBzbmlwcGV0O1xuLyoqXG4gKiBJbmRlbnQgYSBtdWx0aS1saW5lIHN0cmluZyBieSBwcmVjZWRpbmcgZWFjaCBsaW5lIHdpdGggcHJlZml4LlxuICogQHBhcmFtIHN0cmluZyBzdHJpbmcgdG8gaW5kZW50XG4gKiBAcGFyYW0gcHJlZml4IHByZWZpeCB0byB1c2UgZm9yIGluZGVudGluZ1xuICogQHJldHVybiBzdHJpbmcgd2l0aCBwcmVmaXggaW5zZXJ0ZWQgYXQgdGhlIHN0YXJ0IG9mIGVhY2ggbGluZVxuICovXG5mdW5jdGlvbiBpbmRlbnQocywgcHJlZml4KSB7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgbGV0IGNoYXJzQ29waWVkID0gMDtcbiAgICBkbyB7XG4gICAgICAgIGNvbnN0IG5ld2xpbmUgPSBzLmluZGV4T2YoJ1xcbicsIGNoYXJzQ29waWVkKTtcbiAgICAgICAgY29uc3QgZW5kT2ZMaW5lID0gbmV3bGluZSAhPSAtMSA/IG5ld2xpbmUgKyAxIDogcy5sZW5ndGg7XG4gICAgICAgIHJlc3VsdCArPSBwcmVmaXggKyBzLnN1YnN0cmluZyhjaGFyc0NvcGllZCwgZW5kT2ZMaW5lKTtcbiAgICAgICAgY2hhcnNDb3BpZWQgPSBlbmRPZkxpbmU7XG4gICAgfSB3aGlsZSAoY2hhcnNDb3BpZWQgPCBzLmxlbmd0aCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuaW5kZW50ID0gaW5kZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzcGxheS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGFyc2VyU3RhdGUgPSBleHBvcnRzLkZhaWxlZFBhcnNlID0gZXhwb3J0cy5TdWNjZXNzZnVsUGFyc2UgPSBleHBvcnRzLkludGVybmFsUGFyc2VyID0gZXhwb3J0cy5mYWlsZmFzdCA9IGV4cG9ydHMuc2tpcCA9IGV4cG9ydHMub3B0aW9uID0gZXhwb3J0cy5wbHVzID0gZXhwb3J0cy5zdGFyID0gZXhwb3J0cy5yZXBlYXQgPSBleHBvcnRzLlpFUk9fT1JfT05FID0gZXhwb3J0cy5PTkVfT1JfTU9SRSA9IGV4cG9ydHMuWkVST19PUl9NT1JFID0gZXhwb3J0cy5CZXR3ZWVuID0gZXhwb3J0cy5BdExlYXN0ID0gZXhwb3J0cy5vciA9IGV4cG9ydHMuY2F0ID0gZXhwb3J0cy5zdHIgPSBleHBvcnRzLnJlZ2V4ID0gZXhwb3J0cy5udCA9IHZvaWQgMDtcbmNvbnN0IGFzc2VydF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuY29uc3QgcGFyc2V0cmVlXzEgPSByZXF1aXJlKFwiLi9wYXJzZXRyZWVcIik7XG5mdW5jdGlvbiBudChub250ZXJtaW5hbCwgbm9udGVybWluYWxOYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGd0ID0gZGVmaW5pdGlvbnMuZ2V0KG5vbnRlcm1pbmFsKTtcbiAgICAgICAgICAgIGlmIChndCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcihcIm5vbnRlcm1pbmFsIGhhcyBubyBkZWZpbml0aW9uOiBcIiArIG5vbnRlcm1pbmFsTmFtZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiZW50ZXJpbmdcIiwgbm9udGVybWluYWxOYW1lKTtcbiAgICAgICAgICAgIHN0YXRlLmVudGVyKHBvcywgbm9udGVybWluYWwpO1xuICAgICAgICAgICAgbGV0IHByID0gZ3QucGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpO1xuICAgICAgICAgICAgc3RhdGUubGVhdmUobm9udGVybWluYWwpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcImxlYXZpbmdcIiwgbm9udGVybWluYWxOYW1lLCBcIndpdGggcmVzdWx0XCIsIHByKTtcbiAgICAgICAgICAgIGlmICghcHIuZmFpbGVkICYmICFzdGF0ZS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmVlID0gcHIudHJlZTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUcmVlID0gc3RhdGUubWFrZVBhcnNlVHJlZSh0cmVlLnN0YXJ0LCB0cmVlLnRleHQsIFt0cmVlXSk7XG4gICAgICAgICAgICAgICAgcHIgPSBwci5yZXBsYWNlVHJlZShuZXdUcmVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcjtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9udGVybWluYWxOYW1lO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMubnQgPSBudDtcbmZ1bmN0aW9uIHJlZ2V4KHJlZ2V4U291cmNlKSB7XG4gICAgbGV0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyByZWdleFNvdXJjZSArICckJywgJ3MnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgaWYgKHBvcyA+PSBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlRmFpbGVkUGFyc2UocG9zLCByZWdleFNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsID0gcy5zdWJzdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICAgICAgICAgIGlmIChyZWdleC50ZXN0KGwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VTdWNjZXNzZnVsUGFyc2UocG9zLCBwb3MgKyAxLCBsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlRmFpbGVkUGFyc2UocG9zLCByZWdleFNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2V4U291cmNlO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMucmVnZXggPSByZWdleDtcbmZ1bmN0aW9uIHN0cihzdHIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgY29uc3QgbmV3cG9zID0gcG9zICsgc3RyLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChuZXdwb3MgPiBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlRmFpbGVkUGFyc2UocG9zLCBzdHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbCA9IHMuc3Vic3RyaW5nKHBvcywgbmV3cG9zKTtcbiAgICAgICAgICAgIGlmIChsID09PSBzdHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZVN1Y2Nlc3NmdWxQYXJzZShwb3MsIG5ld3BvcywgbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZUZhaWxlZFBhcnNlKHBvcywgc3RyKTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCInXCIgKyBzdHIucmVwbGFjZSgvJ1xcclxcblxcdFxcXFwvLCBcIlxcXFwkJlwiKSArIFwiJ1wiO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuc3RyID0gc3RyO1xuZnVuY3Rpb24gY2F0KC4uLnRlcm1zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGxldCBwcm91dCA9IHN0YXRlLm1ha2VTdWNjZXNzZnVsUGFyc2UocG9zLCBwb3MpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBndCBvZiB0ZXJtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByID0gZ3QucGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmIChwci5mYWlsZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcjtcbiAgICAgICAgICAgICAgICBwb3MgPSBwci5wb3M7XG4gICAgICAgICAgICAgICAgcHJvdXQgPSBwcm91dC5tZXJnZVJlc3VsdChwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiKFwiICsgdGVybXMubWFwKHRlcm0gPT4gdGVybS50b1N0cmluZygpKS5qb2luKFwiIFwiKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuY2F0ID0gY2F0O1xuLyoqXG4gKiBAcGFyYW0gY2hvaWNlcyBtdXN0IGJlIG5vbmVtcHR5XG4gKi9cbmZ1bmN0aW9uIG9yKC4uLmNob2ljZXMpIHtcbiAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoY2hvaWNlcy5sZW5ndGggPiAwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc2VzID0gW107XG4gICAgICAgICAgICBjb25zdCBmYWlsdXJlcyA9IFtdO1xuICAgICAgICAgICAgY2hvaWNlcy5mb3JFYWNoKChjaG9pY2UpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjaG9pY2UucGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZmFpbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3Nlcy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc3VjY2Vzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb25nZXN0U3VjY2Vzc2VzID0gbG9uZ2VzdFJlc3VsdHMoc3VjY2Vzc2VzKTtcbiAgICAgICAgICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkobG9uZ2VzdFN1Y2Nlc3Nlcy5sZW5ndGggPiAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9uZ2VzdFN1Y2Nlc3Nlc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxvbmdlc3RGYWlsdXJlcyA9IGxvbmdlc3RSZXN1bHRzKGZhaWx1cmVzKTtcbiAgICAgICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShsb25nZXN0RmFpbHVyZXMubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZUZhaWxlZFBhcnNlKGxvbmdlc3RGYWlsdXJlc1swXS5wb3MsIGxvbmdlc3RGYWlsdXJlcy5tYXAoKHJlc3VsdCkgPT4gcmVzdWx0LmV4cGVjdGVkVGV4dCkuam9pbihcInxcIikpO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBcIihcIiArIGNob2ljZXMubWFwKGNob2ljZSA9PiBjaG9pY2UudG9TdHJpbmcoKSkuam9pbihcInxcIikgKyBcIilcIjtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLm9yID0gb3I7XG5jbGFzcyBBdExlYXN0IHtcbiAgICBjb25zdHJ1Y3RvcihtaW4pIHtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgfVxuICAgIHRvb0xvdyhuKSB7IHJldHVybiBuIDwgdGhpcy5taW47IH1cbiAgICB0b29IaWdoKG4pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5taW4pIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFwiKlwiO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gXCIrXCI7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gXCJ7XCIgKyB0aGlzLm1pbiArIFwiLH1cIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuQXRMZWFzdCA9IEF0TGVhc3Q7XG5jbGFzcyBCZXR3ZWVuIHtcbiAgICBjb25zdHJ1Y3RvcihtaW4sIG1heCkge1xuICAgICAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgfVxuICAgIHRvb0xvdyhuKSB7IHJldHVybiBuIDwgdGhpcy5taW47IH1cbiAgICB0b29IaWdoKG4pIHsgcmV0dXJuIG4gPiB0aGlzLm1heDsgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5taW4gPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLm1heCA9PSAxKSA/IFwiP1wiIDogXCJ7LFwiICsgdGhpcy5tYXggKyBcIn1cIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcIntcIiArIHRoaXMubWluICsgXCIsXCIgKyB0aGlzLm1heCArIFwifVwiO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5CZXR3ZWVuID0gQmV0d2VlbjtcbmV4cG9ydHMuWkVST19PUl9NT1JFID0gbmV3IEF0TGVhc3QoMCk7XG5leHBvcnRzLk9ORV9PUl9NT1JFID0gbmV3IEF0TGVhc3QoMSk7XG5leHBvcnRzLlpFUk9fT1JfT05FID0gbmV3IEJldHdlZW4oMCwgMSk7XG5mdW5jdGlvbiByZXBlYXQoZ3QsIGhvd21hbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgbGV0IHByb3V0ID0gc3RhdGUubWFrZVN1Y2Nlc3NmdWxQYXJzZShwb3MsIHBvcyk7XG4gICAgICAgICAgICBmb3IgKGxldCB0aW1lc01hdGNoZWQgPSAwOyBob3dtYW55LnRvb0xvdyh0aW1lc01hdGNoZWQpIHx8ICFob3dtYW55LnRvb0hpZ2godGltZXNNYXRjaGVkICsgMSk7ICsrdGltZXNNYXRjaGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHIgPSBndC5wYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHByLmZhaWxlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBubyBtYXRjaFxuICAgICAgICAgICAgICAgICAgICBpZiAoaG93bWFueS50b29Mb3codGltZXNNYXRjaGVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm91dC5hZGRMYXN0RmFpbHVyZShwcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHIucG9zID09IHBvcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hlZCB0aGUgZW1wdHkgc3RyaW5nLCBhbmQgd2UgYWxyZWFkeSBoYXZlIGVub3VnaC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIG1heSBnZXQgaW50byBhbiBpbmZpbml0ZSBsb29wIGlmIGhvd21hbnkudG9vSGlnaCgpIG5ldmVyIHJldHVybnMgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyByZXR1cm4gc3VjY2Vzc2Z1bCBtYXRjaCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvdXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGFkdmFuY2UgdGhlIHBvc2l0aW9uIGFuZCBtZXJnZSBwciBpbnRvIHByb3V0XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHByLnBvcztcbiAgICAgICAgICAgICAgICAgICAgcHJvdXQgPSBwcm91dC5tZXJnZVJlc3VsdChwcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb3V0O1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBndC50b1N0cmluZygpICsgaG93bWFueS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMucmVwZWF0ID0gcmVwZWF0O1xuZnVuY3Rpb24gc3RhcihndCkge1xuICAgIHJldHVybiByZXBlYXQoZ3QsIGV4cG9ydHMuWkVST19PUl9NT1JFKTtcbn1cbmV4cG9ydHMuc3RhciA9IHN0YXI7XG5mdW5jdGlvbiBwbHVzKGd0KSB7XG4gICAgcmV0dXJuIHJlcGVhdChndCwgZXhwb3J0cy5PTkVfT1JfTU9SRSk7XG59XG5leHBvcnRzLnBsdXMgPSBwbHVzO1xuZnVuY3Rpb24gb3B0aW9uKGd0KSB7XG4gICAgcmV0dXJuIHJlcGVhdChndCwgZXhwb3J0cy5aRVJPX09SX09ORSk7XG59XG5leHBvcnRzLm9wdGlvbiA9IG9wdGlvbjtcbmZ1bmN0aW9uIHNraXAobm9udGVybWluYWwpIHtcbiAgICBjb25zdCByZXBldGl0aW9uID0gc3Rhcihub250ZXJtaW5hbCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIHN0YXRlLmVudGVyU2tpcCgpO1xuICAgICAgICAgICAgbGV0IHByID0gcmVwZXRpdGlvbi5wYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSk7XG4gICAgICAgICAgICBzdGF0ZS5sZWF2ZVNraXAoKTtcbiAgICAgICAgICAgIGlmIChwci5mYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBzdWNjZWVkIGFueXdheVxuICAgICAgICAgICAgICAgIHByID0gc3RhdGUubWFrZVN1Y2Nlc3NmdWxQYXJzZShwb3MsIHBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHI7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiKD88c2tpcD5cIiArIHJlcGV0aXRpb24gKyBcIilcIjtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLnNraXAgPSBza2lwO1xuZnVuY3Rpb24gZmFpbGZhc3QoZ3QpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgbGV0IHByID0gZ3QucGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpO1xuICAgICAgICAgICAgaWYgKHByLmZhaWxlZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IoXCJcIiwgcHIubm9udGVybWluYWxOYW1lLCBwci5leHBlY3RlZFRleHQsIFwiXCIsIHByLnBvcyk7XG4gICAgICAgICAgICByZXR1cm4gcHI7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuICdmYWlsZmFzdCgnICsgZ3QgKyAnKSc7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5mYWlsZmFzdCA9IGZhaWxmYXN0O1xuY2xhc3MgSW50ZXJuYWxQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zLCBzdGFydCwgbm9udGVybWluYWxUb1N0cmluZykge1xuICAgICAgICB0aGlzLmRlZmluaXRpb25zID0gZGVmaW5pdGlvbnM7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5ub250ZXJtaW5hbFRvU3RyaW5nID0gbm9udGVybWluYWxUb1N0cmluZztcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgIH1cbiAgICBjaGVja1JlcCgpIHtcbiAgICB9XG4gICAgcGFyc2UodGV4dFRvUGFyc2UpIHtcbiAgICAgICAgbGV0IHByID0gKCgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQucGFyc2UodGV4dFRvUGFyc2UsIDAsIHRoaXMuZGVmaW5pdGlvbnMsIG5ldyBQYXJzZXJTdGF0ZSh0aGlzLm5vbnRlcm1pbmFsVG9TdHJpbmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXRocm93IHRoZSBleGNlcHRpb24sIGF1Z21lbnRlZCBieSB0aGUgb3JpZ2luYWwgdGV4dCwgc28gdGhhdCB0aGUgZXJyb3IgbWVzc2FnZSBpcyBiZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKFwic3RyaW5nIGRvZXMgbm90IG1hdGNoIGdyYW1tYXJcIiwgZS5ub250ZXJtaW5hbE5hbWUsIGUuZXhwZWN0ZWRUZXh0LCB0ZXh0VG9QYXJzZSwgZS5wb3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGlmIChwci5mYWlsZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcihcInN0cmluZyBkb2VzIG5vdCBtYXRjaCBncmFtbWFyXCIsIHByLm5vbnRlcm1pbmFsTmFtZSwgcHIuZXhwZWN0ZWRUZXh0LCB0ZXh0VG9QYXJzZSwgcHIucG9zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHIucG9zIDwgdGV4dFRvUGFyc2UubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gXCJvbmx5IHBhcnQgb2YgdGhlIHN0cmluZyBtYXRjaGVzIHRoZSBncmFtbWFyOyB0aGUgcmVzdCBkaWQgbm90IHBhcnNlXCI7XG4gICAgICAgICAgICB0aHJvdyAocHIubGFzdEZhaWx1cmVcbiAgICAgICAgICAgICAgICA/IG5ldyB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcihtZXNzYWdlLCBwci5sYXN0RmFpbHVyZS5ub250ZXJtaW5hbE5hbWUsIHByLmxhc3RGYWlsdXJlLmV4cGVjdGVkVGV4dCwgdGV4dFRvUGFyc2UsIHByLmxhc3RGYWlsdXJlLnBvcylcbiAgICAgICAgICAgICAgICA6IG5ldyB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcihtZXNzYWdlLCB0aGlzLnN0YXJ0LnRvU3RyaW5nKCksIFwiZW5kIG9mIHN0cmluZ1wiLCB0ZXh0VG9QYXJzZSwgcHIucG9zKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByLnRyZWU7XG4gICAgfVxuICAgIDtcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5kZWZpbml0aW9ucywgKFtub250ZXJtaW5hbCwgcnVsZV0pID0+IHRoaXMubm9udGVybWluYWxUb1N0cmluZyhub250ZXJtaW5hbCkgKyAnOjo9JyArIHJ1bGUgKyAnOycpLmpvaW4oXCJcXG5cIik7XG4gICAgfVxufVxuZXhwb3J0cy5JbnRlcm5hbFBhcnNlciA9IEludGVybmFsUGFyc2VyO1xuY2xhc3MgU3VjY2Vzc2Z1bFBhcnNlIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3MsIHRyZWUsIGxhc3RGYWlsdXJlKSB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgICAgICB0aGlzLmxhc3RGYWlsdXJlID0gbGFzdEZhaWx1cmU7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHJlcGxhY2VUcmVlKHRyZWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWNjZXNzZnVsUGFyc2UodGhpcy5wb3MsIHRyZWUsIHRoaXMubGFzdEZhaWx1cmUpO1xuICAgIH1cbiAgICBtZXJnZVJlc3VsdCh0aGF0KSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSghdGhhdC5mYWlsZWQpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdtZXJnaW5nJywgdGhpcywgJ3dpdGgnLCB0aGF0KTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWNjZXNzZnVsUGFyc2UodGhhdC5wb3MsIHRoaXMudHJlZS5jb25jYXQodGhhdC50cmVlKSwgbGF0ZXJSZXN1bHQodGhpcy5sYXN0RmFpbHVyZSwgdGhhdC5sYXN0RmFpbHVyZSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBLZWVwIHRyYWNrIG9mIGEgZmFpbGluZyBwYXJzZSByZXN1bHQgdGhhdCBwcmV2ZW50ZWQgdGhpcyB0cmVlIGZyb20gbWF0Y2hpbmcgbW9yZSBvZiB0aGUgaW5wdXQgc3RyaW5nLlxuICAgICAqIFRoaXMgZGVlcGVyIGZhaWx1cmUgaXMgdXN1YWxseSBtb3JlIGluZm9ybWF0aXZlIHRvIHRoZSB1c2VyLCBzbyB3ZSdsbCBkaXNwbGF5IGl0IGluIHRoZSBlcnJvciBtZXNzYWdlLlxuICAgICAqIEBwYXJhbSBuZXdMYXN0RmFpbHVyZSBhIGZhaWxpbmcgUGFyc2VSZXN1bHQ8TlQ+IHRoYXQgc3RvcHBlZCB0aGlzIHRyZWUncyBwYXJzZSAoYnV0IGRpZG4ndCBwcmV2ZW50IHRoaXMgZnJvbSBzdWNjZWVkaW5nKVxuICAgICAqIEByZXR1cm4gYSBuZXcgUGFyc2VSZXN1bHQ8TlQ+IGlkZW50aWNhbCB0byB0aGlzIG9uZSBidXQgd2l0aCBsYXN0RmFpbHVyZSBhZGRlZCB0byBpdFxuICAgICAqL1xuICAgIGFkZExhc3RGYWlsdXJlKG5ld0xhc3RGYWlsdXJlKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShuZXdMYXN0RmFpbHVyZS5mYWlsZWQpO1xuICAgICAgICByZXR1cm4gbmV3IFN1Y2Nlc3NmdWxQYXJzZSh0aGlzLnBvcywgdGhpcy50cmVlLCBsYXRlclJlc3VsdCh0aGlzLmxhc3RGYWlsdXJlLCBuZXdMYXN0RmFpbHVyZSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuU3VjY2Vzc2Z1bFBhcnNlID0gU3VjY2Vzc2Z1bFBhcnNlO1xuY2xhc3MgRmFpbGVkUGFyc2Uge1xuICAgIGNvbnN0cnVjdG9yKHBvcywgbm9udGVybWluYWxOYW1lLCBleHBlY3RlZFRleHQpIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgICAgIHRoaXMubm9udGVybWluYWxOYW1lID0gbm9udGVybWluYWxOYW1lO1xuICAgICAgICB0aGlzLmV4cGVjdGVkVGV4dCA9IGV4cGVjdGVkVGV4dDtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydHMuRmFpbGVkUGFyc2UgPSBGYWlsZWRQYXJzZTtcbi8qKlxuICogQHBhcmFtIHJlc3VsdDFcbiAqIEBwYXJhbSByZXN1bHQyXG4gKiBAcmV0dXJuIHdoaWNoZXZlciBvZiByZXN1bHQxIG9yIHJlc3VsdDIgaGFzIHRoZSBteGltdW0gcG9zaXRpb24sIG9yIHVuZGVmaW5lZCBpZiBib3RoIGFyZSB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gbGF0ZXJSZXN1bHQocmVzdWx0MSwgcmVzdWx0Mikge1xuICAgIGlmIChyZXN1bHQxICYmIHJlc3VsdDIpXG4gICAgICAgIHJldHVybiByZXN1bHQxLnBvcyA+PSByZXN1bHQyLnBvcyA/IHJlc3VsdDEgOiByZXN1bHQyO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHJlc3VsdDEgfHwgcmVzdWx0Mjtcbn1cbi8qKlxuICogQHBhcmFtIHJlc3VsdHNcbiAqIEByZXR1cm4gdGhlIHJlc3VsdHMgaW4gdGhlIGxpc3Qgd2l0aCBtYXhpbXVtIHBvcy4gIEVtcHR5IGlmIGxpc3QgaXMgZW1wdHkuXG4gKi9cbmZ1bmN0aW9uIGxvbmdlc3RSZXN1bHRzKHJlc3VsdHMpIHtcbiAgICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoKGxvbmdlc3RSZXN1bHRzU29GYXIsIHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAobG9uZ2VzdFJlc3VsdHNTb0Zhci5sZW5ndGggPT0gMCB8fCByZXN1bHQucG9zID4gbG9uZ2VzdFJlc3VsdHNTb0ZhclswXS5wb3MpIHtcbiAgICAgICAgICAgIC8vIHJlc3VsdCB3aW5zXG4gICAgICAgICAgICByZXR1cm4gW3Jlc3VsdF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVzdWx0LnBvcyA9PSBsb25nZXN0UmVzdWx0c1NvRmFyWzBdLnBvcykge1xuICAgICAgICAgICAgLy8gcmVzdWx0IGlzIHRpZWRcbiAgICAgICAgICAgIGxvbmdlc3RSZXN1bHRzU29GYXIucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgcmV0dXJuIGxvbmdlc3RSZXN1bHRzU29GYXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyByZXN1bHQgbG9zZXNcbiAgICAgICAgICAgIHJldHVybiBsb25nZXN0UmVzdWx0c1NvRmFyO1xuICAgICAgICB9XG4gICAgfSwgW10pO1xufVxuY2xhc3MgUGFyc2VyU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKG5vbnRlcm1pbmFsVG9TdHJpbmcpIHtcbiAgICAgICAgdGhpcy5ub250ZXJtaW5hbFRvU3RyaW5nID0gbm9udGVybWluYWxUb1N0cmluZztcbiAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLmZpcnN0ID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnNraXBEZXB0aCA9IDA7XG4gICAgfVxuICAgIGVudGVyKHBvcywgbm9udGVybWluYWwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpcnN0Lmhhcyhub250ZXJtaW5hbCkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3Quc2V0KG5vbnRlcm1pbmFsLCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcyA9IHRoaXMuZmlyc3QuZ2V0KG5vbnRlcm1pbmFsKTtcbiAgICAgICAgaWYgKHMubGVuZ3RoID4gMCAmJiBzW3MubGVuZ3RoIC0gMV0gPT0gcG9zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoXCJkZXRlY3RlZCBsZWZ0IHJlY3Vyc2lvbiBpbiBydWxlIGZvciBcIiArIHRoaXMubm9udGVybWluYWxUb1N0cmluZyhub250ZXJtaW5hbCkpO1xuICAgICAgICB9XG4gICAgICAgIHMucHVzaChwb3MpO1xuICAgICAgICB0aGlzLnN0YWNrLnB1c2gobm9udGVybWluYWwpO1xuICAgIH1cbiAgICBsZWF2ZShub250ZXJtaW5hbCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkodGhpcy5maXJzdC5oYXMobm9udGVybWluYWwpICYmIHRoaXMuZmlyc3QuZ2V0KG5vbnRlcm1pbmFsKS5sZW5ndGggPiAwKTtcbiAgICAgICAgdGhpcy5maXJzdC5nZXQobm9udGVybWluYWwpLnBvcCgpO1xuICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5zdGFjay5wb3AoKTtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGxhc3QgPT09IG5vbnRlcm1pbmFsKTtcbiAgICB9XG4gICAgZW50ZXJTa2lwKCkge1xuICAgICAgICAvL2NvbnNvbGUuZXJyb3IoJ2VudGVyaW5nIHNraXAnKTtcbiAgICAgICAgKyt0aGlzLnNraXBEZXB0aDtcbiAgICB9XG4gICAgbGVhdmVTa2lwKCkge1xuICAgICAgICAvL2NvbnNvbGUuZXJyb3IoJ2xlYXZpbmcgc2tpcCcpO1xuICAgICAgICAtLXRoaXMuc2tpcERlcHRoO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkodGhpcy5za2lwRGVwdGggPj0gMCk7XG4gICAgfVxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLmxlbmd0aCA9PSAwO1xuICAgIH1cbiAgICBnZXQgY3VycmVudE5vbnRlcm1pbmFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBnZXQgY3VycmVudE5vbnRlcm1pbmFsTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE5vbnRlcm1pbmFsICE9PSB1bmRlZmluZWQgPyB0aGlzLm5vbnRlcm1pbmFsVG9TdHJpbmcodGhpcy5jdXJyZW50Tm9udGVybWluYWwpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyByZXF1aXJlczogIWlzRW1wdHkoKVxuICAgIG1ha2VQYXJzZVRyZWUocG9zLCB0ZXh0ID0gJycsIGNoaWxkcmVuID0gW10pIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKCF0aGlzLmlzRW1wdHkoKSk7XG4gICAgICAgIHJldHVybiBuZXcgcGFyc2V0cmVlXzEuSW50ZXJuYWxQYXJzZVRyZWUodGhpcy5jdXJyZW50Tm9udGVybWluYWwsIHRoaXMuY3VycmVudE5vbnRlcm1pbmFsTmFtZSwgcG9zLCB0ZXh0LCBjaGlsZHJlbiwgdGhpcy5za2lwRGVwdGggPiAwKTtcbiAgICB9XG4gICAgLy8gcmVxdWlyZXMgIWlzRW1wdHkoKVxuICAgIG1ha2VTdWNjZXNzZnVsUGFyc2UoZnJvbVBvcywgdG9Qb3MsIHRleHQgPSAnJywgY2hpbGRyZW4gPSBbXSkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoIXRoaXMuaXNFbXB0eSgpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWNjZXNzZnVsUGFyc2UodG9Qb3MsIHRoaXMubWFrZVBhcnNlVHJlZShmcm9tUG9zLCB0ZXh0LCBjaGlsZHJlbikpO1xuICAgIH1cbiAgICAvLyByZXF1aXJlcyAhaXNFbXB0eSgpXG4gICAgbWFrZUZhaWxlZFBhcnNlKGF0UG9zLCBleHBlY3RlZFRleHQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKCF0aGlzLmlzRW1wdHkoKSk7XG4gICAgICAgIHJldHVybiBuZXcgRmFpbGVkUGFyc2UoYXRQb3MsIHRoaXMuY3VycmVudE5vbnRlcm1pbmFsTmFtZSwgZXhwZWN0ZWRUZXh0KTtcbiAgICB9XG59XG5leHBvcnRzLlBhcnNlclN0YXRlID0gUGFyc2VyU3RhdGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkludGVybmFsUGFyc2VUcmVlID0gdm9pZCAwO1xuY29uc3QgZGlzcGxheV8xID0gcmVxdWlyZShcIi4vZGlzcGxheVwiKTtcbmNsYXNzIEludGVybmFsUGFyc2VUcmVlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBub250ZXJtaW5hbE5hbWUsIHN0YXJ0LCB0ZXh0LCBhbGxDaGlsZHJlbiwgaXNTa2lwcGVkKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubm9udGVybWluYWxOYW1lID0gbm9udGVybWluYWxOYW1lO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuYWxsQ2hpbGRyZW4gPSBhbGxDaGlsZHJlbjtcbiAgICAgICAgdGhpcy5pc1NraXBwZWQgPSBpc1NraXBwZWQ7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLmFsbENoaWxkcmVuKTtcbiAgICAgICAgLy8gY2FuJ3QgZnJlZXplKHRoaXMpIGJlY2F1c2Ugb2YgYmVuZWZpY2VudCBtdXRhdGlvbiBkZWxheWVkIGNvbXB1dGF0aW9uLXdpdGgtY2FjaGluZyBmb3IgY2hpbGRyZW4oKSBhbmQgY2hpbGRyZW5CeU5hbWUoKVxuICAgIH1cbiAgICBjaGVja1JlcCgpIHtcbiAgICAgICAgLy8gRklYTUVcbiAgICB9XG4gICAgZ2V0IGVuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnRleHQubGVuZ3RoO1xuICAgIH1cbiAgICBjaGlsZHJlbkJ5TmFtZShuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fY2hpbGRyZW5CeU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuQnlOYW1lID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmFsbENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9jaGlsZHJlbkJ5TmFtZS5oYXMoY2hpbGQubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5CeU5hbWUuc2V0KGNoaWxkLm5hbWUsIFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5CeU5hbWUuZ2V0KGNoaWxkLm5hbWUpLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZExpc3Qgb2YgdGhpcy5fY2hpbGRyZW5CeU5hbWUudmFsdWVzKCkpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKGNoaWxkTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5CeU5hbWUuZ2V0KG5hbWUpIHx8IFtdO1xuICAgIH1cbiAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5fY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5hbGxDaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gIWNoaWxkLmlzU2tpcHBlZCk7XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuX2NoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICB9XG4gICAgY29uY2F0KHRoYXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcm5hbFBhcnNlVHJlZSh0aGlzLm5hbWUsIHRoaXMubm9udGVybWluYWxOYW1lLCB0aGlzLnN0YXJ0LCB0aGlzLnRleHQgKyB0aGF0LnRleHQsIHRoaXMuYWxsQ2hpbGRyZW4uY29uY2F0KHRoYXQuYWxsQ2hpbGRyZW4pLCB0aGlzLmlzU2tpcHBlZCAmJiB0aGF0LmlzU2tpcHBlZCk7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgcyA9ICh0aGlzLmlzU2tpcHBlZCA/IFwiQHNraXAgXCIgOiBcIlwiKSArIHRoaXMubm9udGVybWluYWxOYW1lO1xuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcyArPSBcIjpcIiArICgwLCBkaXNwbGF5XzEuZXNjYXBlRm9yUmVhZGluZykodGhpcy50ZXh0LCBcIlxcXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgdCA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0UmVhY2hlZFNvRmFyID0gdGhpcy5zdGFydDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcHQgb2YgdGhpcy5hbGxDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRSZWFjaGVkU29GYXIgPCBwdC5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBwcmV2aW91cyBjaGlsZCBhbmQgY3VycmVudCBjaGlsZCBoYXZlIGEgZ2FwIGJldHdlZW4gdGhlbSB0aGF0IG11c3QgaGF2ZSBiZWVuIG1hdGNoZWQgYXMgYSB0ZXJtaW5hbFxuICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgcnVsZSBmb3IgdGhpcyBub2RlLiAgSW5zZXJ0IGl0IGFzIGEgcXVvdGVkIHN0cmluZy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVybWluYWwgPSB0aGlzLnRleHQuc3Vic3RyaW5nKG9mZnNldFJlYWNoZWRTb0ZhciAtIHRoaXMuc3RhcnQsIHB0LnN0YXJ0IC0gdGhpcy5zdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIHQgKz0gXCJcXG5cIiArICgwLCBkaXNwbGF5XzEuZXNjYXBlRm9yUmVhZGluZykodGVybWluYWwsIFwiXFxcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdCArPSBcIlxcblwiICsgcHQ7XG4gICAgICAgICAgICAgICAgb2Zmc2V0UmVhY2hlZFNvRmFyID0gcHQuZW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9mZnNldFJlYWNoZWRTb0ZhciA8IHRoaXMuZW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gZmluYWwgY2hpbGQgYW5kIGVuZCBvZiB0aGlzIG5vZGUgaGF2ZSBhIGdhcCAtLSB0cmVhdCBpdCB0aGUgc2FtZSBhcyBhYm92ZS5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZXJtaW5hbCA9IHRoaXMudGV4dC5zdWJzdHJpbmcob2Zmc2V0UmVhY2hlZFNvRmFyIC0gdGhpcy5zdGFydCk7XG4gICAgICAgICAgICAgICAgdCArPSBcIlxcblwiICsgKDAsIGRpc3BsYXlfMS5lc2NhcGVGb3JSZWFkaW5nKSh0ZXJtaW5hbCwgXCJcXFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc21hbGxFbm91Z2hGb3JPbmVMaW5lID0gNTA7XG4gICAgICAgICAgICBpZiAodC5sZW5ndGggPD0gc21hbGxFbm91Z2hGb3JPbmVMaW5lKSB7XG4gICAgICAgICAgICAgICAgcyArPSBcIiB7IFwiICsgdC5zdWJzdHJpbmcoMSkgLy8gcmVtb3ZlIGluaXRpYWwgbmV3bGluZVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShcIlxcblwiLCBcIiwgXCIpXG4gICAgICAgICAgICAgICAgICAgICsgXCIgfVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcyArPSBcIiB7XCIgKyAoMCwgZGlzcGxheV8xLmluZGVudCkodCwgXCIgIFwiKSArIFwiXFxufVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbn1cbmV4cG9ydHMuSW50ZXJuYWxQYXJzZVRyZWUgPSBJbnRlcm5hbFBhcnNlVHJlZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNldHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR3JhbW1hckVycm9yID0gZXhwb3J0cy5JbnRlcm5hbFBhcnNlRXJyb3IgPSBleHBvcnRzLlBhcnNlRXJyb3IgPSB2b2lkIDA7XG5jb25zdCBkaXNwbGF5XzEgPSByZXF1aXJlKFwiLi9kaXNwbGF5XCIpO1xuLyoqXG4gKiBFeGNlcHRpb24gdGhyb3duIHdoZW4gYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGRvZXNuJ3QgbWF0Y2ggYSBncmFtbWFyXG4gKi9cbmNsYXNzIFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB9XG59XG5leHBvcnRzLlBhcnNlRXJyb3IgPSBQYXJzZUVycm9yO1xuY2xhc3MgSW50ZXJuYWxQYXJzZUVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgbm9udGVybWluYWxOYW1lLCBleHBlY3RlZFRleHQsIHRleHRCZWluZ1BhcnNlZCwgcG9zKSB7XG4gICAgICAgIHN1cGVyKCgwLCBkaXNwbGF5XzEubWFrZUVycm9yTWVzc2FnZSkobWVzc2FnZSwgbm9udGVybWluYWxOYW1lLCBleHBlY3RlZFRleHQsIHRleHRCZWluZ1BhcnNlZCwgcG9zLCBcInN0cmluZyBiZWluZyBwYXJzZWRcIikpO1xuICAgICAgICB0aGlzLm5vbnRlcm1pbmFsTmFtZSA9IG5vbnRlcm1pbmFsTmFtZTtcbiAgICAgICAgdGhpcy5leHBlY3RlZFRleHQgPSBleHBlY3RlZFRleHQ7XG4gICAgICAgIHRoaXMudGV4dEJlaW5nUGFyc2VkID0gdGV4dEJlaW5nUGFyc2VkO1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB9XG59XG5leHBvcnRzLkludGVybmFsUGFyc2VFcnJvciA9IEludGVybmFsUGFyc2VFcnJvcjtcbmNsYXNzIEdyYW1tYXJFcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGUpIHtcbiAgICAgICAgc3VwZXIoZSA/ICgwLCBkaXNwbGF5XzEubWFrZUVycm9yTWVzc2FnZSkobWVzc2FnZSwgZS5ub250ZXJtaW5hbE5hbWUsIGUuZXhwZWN0ZWRUZXh0LCBlLnRleHRCZWluZ1BhcnNlZCwgZS5wb3MsIFwiZ3JhbW1hclwiKVxuICAgICAgICAgICAgOiBtZXNzYWdlKTtcbiAgICB9XG59XG5leHBvcnRzLkdyYW1tYXJFcnJvciA9IEdyYW1tYXJFcnJvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXR5cGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy52aXN1YWxpemVBc0h0bWwgPSBleHBvcnRzLnZpc3VhbGl6ZUFzVXJsID0gdm9pZCAwO1xuY29uc3QgY29tcGlsZXJfMSA9IHJlcXVpcmUoXCIuL2NvbXBpbGVyXCIpO1xuY29uc3QgcGFyc2VybGliXzEgPSByZXF1aXJlKFwiLi4vcGFyc2VybGliXCIpO1xuY29uc3QgZnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZnNcIikpO1xuY29uc3QgcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJwYXRoXCIpKTtcbmZ1bmN0aW9uIGVtcHR5SXRlcmF0b3IoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmV4dCgpIHsgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGdldEl0ZXJhdG9yKGxpc3QpIHtcbiAgICByZXR1cm4gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XG59XG5jb25zdCBNQVhfVVJMX0xFTkdUSF9GT1JfREVTS1RPUF9CUk9XU0UgPSAyMDIwO1xuLyoqXG4gKiBWaXN1YWxpemVzIGEgcGFyc2UgdHJlZSB1c2luZyBhIFVSTCB0aGF0IGNhbiBiZSBwYXN0ZWQgaW50byB5b3VyIHdlYiBicm93c2VyLlxuICogQHBhcmFtIHBhcnNlVHJlZSB0cmVlIHRvIHZpc3VhbGl6ZVxuICogQHBhcmFtIDxOVD4gdGhlIGVudW1lcmF0aW9uIG9mIHN5bWJvbHMgaW4gdGhlIHBhcnNlIHRyZWUncyBncmFtbWFyXG4gKiBAcmV0dXJuIHVybCB0aGF0IHNob3dzIGEgdmlzdWFsaXphdGlvbiBvZiB0aGUgcGFyc2UgdHJlZVxuICovXG5mdW5jdGlvbiB2aXN1YWxpemVBc1VybChwYXJzZVRyZWUsIG5vbnRlcm1pbmFscykge1xuICAgIGNvbnN0IGJhc2UgPSBcImh0dHA6Ly93ZWIubWl0LmVkdS82LjAzMS93d3cvcGFyc2VybGliL1wiICsgcGFyc2VybGliXzEuVkVSU0lPTiArIFwiL3Zpc3VhbGl6ZXIuaHRtbFwiO1xuICAgIGNvbnN0IGNvZGUgPSBleHByZXNzaW9uRm9yRGlzcGxheShwYXJzZVRyZWUsIG5vbnRlcm1pbmFscyk7XG4gICAgY29uc3QgdXJsID0gYmFzZSArICc/Y29kZT0nICsgZml4ZWRFbmNvZGVVUklDb21wb25lbnQoY29kZSk7XG4gICAgaWYgKHVybC5sZW5ndGggPiBNQVhfVVJMX0xFTkdUSF9GT1JfREVTS1RPUF9CUk9XU0UpIHtcbiAgICAgICAgLy8gZGlzcGxheSBhbHRlcm5hdGUgaW5zdHJ1Y3Rpb25zIHRvIHRoZSBjb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Zpc3VhbGl6YXRpb24gVVJMIGlzIHRvbyBsb25nIGZvciB3ZWIgYnJvd3NlciBhbmQvb3Igd2ViIHNlcnZlci5cXG4nXG4gICAgICAgICAgICArICdJbnN0ZWFkLCBnbyB0byAnICsgYmFzZSArICdcXG4nXG4gICAgICAgICAgICArICdhbmQgY29weSBhbmQgcGFzdGUgdGhpcyBjb2RlIGludG8gdGhlIHRleHRib3g6XFxuJ1xuICAgICAgICAgICAgKyBjb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbn1cbmV4cG9ydHMudmlzdWFsaXplQXNVcmwgPSB2aXN1YWxpemVBc1VybDtcbmNvbnN0IHZpc3VhbGl6ZXJIdG1sRmlsZSA9IHBhdGhfMS5kZWZhdWx0LnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vc3JjL3Zpc3VhbGl6ZXIuaHRtbCcpO1xuLyoqXG4gKiBWaXN1YWxpemVzIGEgcGFyc2UgdHJlZSBhcyBhIHN0cmluZyBvZiBIVE1MIHRoYXQgY2FuIGJlIGRpc3BsYXllZCBpbiBhIHdlYiBicm93c2VyLlxuICogQHBhcmFtIHBhcnNlVHJlZSB0cmVlIHRvIHZpc3VhbGl6ZVxuICogQHBhcmFtIDxOVD4gdGhlIGVudW1lcmF0aW9uIG9mIHN5bWJvbHMgaW4gdGhlIHBhcnNlIHRyZWUncyBncmFtbWFyXG4gKiBAcmV0dXJuIHN0cmluZyBvZiBIVE1MIHRoYXQgc2hvd3MgYSB2aXN1YWxpemF0aW9uIG9mIHRoZSBwYXJzZSB0cmVlXG4gKi9cbmZ1bmN0aW9uIHZpc3VhbGl6ZUFzSHRtbChwYXJzZVRyZWUsIG5vbnRlcm1pbmFscykge1xuICAgIGNvbnN0IGh0bWwgPSBmc18xLmRlZmF1bHQucmVhZEZpbGVTeW5jKHZpc3VhbGl6ZXJIdG1sRmlsZSwgJ3V0ZjgnKTtcbiAgICBjb25zdCBjb2RlID0gZXhwcmVzc2lvbkZvckRpc3BsYXkocGFyc2VUcmVlLCBub250ZXJtaW5hbHMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGh0bWwucmVwbGFjZSgvXFwvXFwvQ09ERUhFUkUvLCBcInJldHVybiAnXCIgKyBmaXhlZEVuY29kZVVSSUNvbXBvbmVudChjb2RlKSArIFwiJztcIik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMudmlzdWFsaXplQXNIdG1sID0gdmlzdWFsaXplQXNIdG1sO1xuZnVuY3Rpb24gZXhwcmVzc2lvbkZvckRpc3BsYXkocGFyc2VUcmVlLCBub250ZXJtaW5hbHMpIHtcbiAgICBjb25zdCB7IG5vbnRlcm1pbmFsVG9TdHJpbmcgfSA9ICgwLCBjb21waWxlcl8xLm1ha2VOb250ZXJtaW5hbENvbnZlcnRlcnMpKG5vbnRlcm1pbmFscyk7XG4gICAgcmV0dXJuIGZvckRpc3BsYXkocGFyc2VUcmVlLCBbXSwgcGFyc2VUcmVlKTtcbiAgICBmdW5jdGlvbiBmb3JEaXNwbGF5KG5vZGUsIHNpYmxpbmdzLCBwYXJlbnQpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5vbnRlcm1pbmFsVG9TdHJpbmcobm9kZS5uYW1lKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgcyA9IFwibmQoXCI7XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBzICs9IFwiXFxcIlwiICsgbmFtZSArIFwiXFxcIixuZChcXFwiJ1wiICsgY2xlYW5TdHJpbmcobm9kZS50ZXh0KSArIFwiJ1xcXCIpLFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcyArPSBcIlxcXCJcIiArIG5hbWUgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuYWxsQ2hpbGRyZW4uc2xpY2UoKTsgLy8gbWFrZSBhIGNvcHkgZm9yIHNoaWZ0aW5nXG4gICAgICAgICAgICBjb25zdCBmaXJzdENoaWxkID0gY2hpbGRyZW4uc2hpZnQoKTtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbkV4cHJlc3Npb24gPSBmb3JEaXNwbGF5KGZpcnN0Q2hpbGQsIGNoaWxkcmVuLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChub2RlLnN0YXJ0IDwgZmlyc3RDaGlsZC5zdGFydCkge1xuICAgICAgICAgICAgICAgIC8vIG5vZGUgYW5kIGl0cyBmaXJzdCBjaGlsZCBoYXZlIGEgZ2FwIGJldHdlZW4gdGhlbSB0aGF0IG11c3QgaGF2ZSBiZWVuIG1hdGNoZWQgYXMgYSB0ZXJtaW5hbFxuICAgICAgICAgICAgICAgIC8vIGluIHRoZSBydWxlIGZvciBub2RlLiAgSW5zZXJ0IGl0IGFzIGEgcXVvdGVkIHN0cmluZy5cbiAgICAgICAgICAgICAgICBjaGlsZHJlbkV4cHJlc3Npb24gPSBwcmVjZWRlQnlUZXJtaW5hbChub2RlLnRleHQuc3Vic3RyaW5nKDAsIGZpcnN0Q2hpbGQuc3RhcnQgLSBub2RlLnN0YXJ0KSwgY2hpbGRyZW5FeHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMgKz0gY2hpbGRyZW5FeHByZXNzaW9uICsgXCIsXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNpYmxpbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNpYmxpbmcgPSBzaWJsaW5ncy5zaGlmdCgpO1xuICAgICAgICAgICAgbGV0IHNpYmxpbmdFeHByZXNzaW9uID0gZm9yRGlzcGxheShzaWJsaW5nLCBzaWJsaW5ncywgcGFyZW50KTtcbiAgICAgICAgICAgIGlmIChub2RlLmVuZCA8IHNpYmxpbmcuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAvLyBub2RlIGFuZCBpdHMgc2libGluZyBoYXZlIGEgZ2FwIGJldHdlZW4gdGhlbSB0aGF0IG11c3QgaGF2ZSBiZWVuIG1hdGNoZWQgYXMgYSB0ZXJtaW5hbFxuICAgICAgICAgICAgICAgIC8vIGluIHRoZSBydWxlIGZvciBwYXJlbnQuICBJbnNlcnQgaXQgYXMgYSBxdW90ZWQgc3RyaW5nLlxuICAgICAgICAgICAgICAgIHNpYmxpbmdFeHByZXNzaW9uID0gcHJlY2VkZUJ5VGVybWluYWwocGFyZW50LnRleHQuc3Vic3RyaW5nKG5vZGUuZW5kIC0gcGFyZW50LnN0YXJ0LCBzaWJsaW5nLnN0YXJ0IC0gcGFyZW50LnN0YXJ0KSwgc2libGluZ0V4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcyArPSBzaWJsaW5nRXhwcmVzc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzaWJsaW5nRXhwcmVzc2lvbiA9IFwidXVcIjtcbiAgICAgICAgICAgIGlmIChub2RlLmVuZCA8IHBhcmVudC5lbmQpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSdzIGEgZ2FwIGJldHdlZW4gdGhlIGVuZCBvZiBub2RlIGFuZCB0aGUgZW5kIG9mIGl0cyBwYXJlbnQsIHdoaWNoIG11c3QgYmUgYSB0ZXJtaW5hbCBtYXRjaGVkIGJ5IHBhcmVudC5cbiAgICAgICAgICAgICAgICAvLyBJbnNlcnQgaXQgYXMgYSBxdW90ZWQgc3RyaW5nLlxuICAgICAgICAgICAgICAgIHNpYmxpbmdFeHByZXNzaW9uID0gcHJlY2VkZUJ5VGVybWluYWwocGFyZW50LnRleHQuc3Vic3RyaW5nKG5vZGUuZW5kIC0gcGFyZW50LnN0YXJ0KSwgc2libGluZ0V4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcyArPSBzaWJsaW5nRXhwcmVzc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5pc1NraXBwZWQpIHtcbiAgICAgICAgICAgIHMgKz0gXCIsdHJ1ZVwiO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gXCIpXCI7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcmVjZWRlQnlUZXJtaW5hbCh0ZXJtaW5hbCwgZXhwcmVzc2lvbikge1xuICAgICAgICByZXR1cm4gXCJuZChcXFwiJ1wiICsgY2xlYW5TdHJpbmcodGVybWluYWwpICsgXCInXFxcIiwgdXUsIFwiICsgZXhwcmVzc2lvbiArIFwiKVwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhblN0cmluZyhzKSB7XG4gICAgICAgIGxldCBydmFsdWUgPSBzLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKTtcbiAgICAgICAgcnZhbHVlID0gcnZhbHVlLnJlcGxhY2UoL1wiL2csIFwiXFxcXFxcXCJcIik7XG4gICAgICAgIHJ2YWx1ZSA9IHJ2YWx1ZS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKTtcbiAgICAgICAgcnZhbHVlID0gcnZhbHVlLnJlcGxhY2UoL1xcci9nLCBcIlxcXFxyXCIpO1xuICAgICAgICByZXR1cm4gcnZhbHVlO1xuICAgIH1cbn1cbi8vIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvZW5jb2RlVVJJQ29tcG9uZW50XG5mdW5jdGlvbiBmaXhlZEVuY29kZVVSSUNvbXBvbmVudChzKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzKS5yZXBsYWNlKC9bIScoKSpdL2csIGMgPT4gJyUnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD12aXN1YWxpemVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy52aXN1YWxpemVBc0h0bWwgPSBleHBvcnRzLnZpc3VhbGl6ZUFzVXJsID0gZXhwb3J0cy5jb21waWxlID0gZXhwb3J0cy5QYXJzZUVycm9yID0gZXhwb3J0cy5WRVJTSU9OID0gdm9pZCAwO1xuZXhwb3J0cy5WRVJTSU9OID0gXCIzLjIuM1wiO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi9pbnRlcm5hbC90eXBlc1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlBhcnNlRXJyb3JcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVzXzEuUGFyc2VFcnJvcjsgfSB9KTtcbjtcbnZhciBjb21waWxlcl8xID0gcmVxdWlyZShcIi4vaW50ZXJuYWwvY29tcGlsZXJcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjb21waWxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb21waWxlcl8xLmNvbXBpbGU7IH0gfSk7XG52YXIgdmlzdWFsaXplcl8xID0gcmVxdWlyZShcIi4vaW50ZXJuYWwvdmlzdWFsaXplclwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInZpc3VhbGl6ZUFzVXJsXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2aXN1YWxpemVyXzEudmlzdWFsaXplQXNVcmw7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2aXN1YWxpemVBc0h0bWxcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZpc3VhbGl6ZXJfMS52aXN1YWxpemVBc0h0bWw7IH0gfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZXJsaWIuanMubWFwIiwiLy8gJ3BhdGgnIG1vZHVsZSBleHRyYWN0ZWQgZnJvbSBOb2RlLmpzIHY4LjExLjEgKG9ubHkgdGhlIHBvc2l4IHBhcnQpXG4vLyB0cmFuc3BsaXRlZCB3aXRoIEJhYmVsXG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2VydFBhdGgocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCAnICsgSlNPTi5zdHJpbmdpZnkocGF0aCkpO1xuICB9XG59XG5cbi8vIFJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCB3aXRoIGRpcmVjdG9yeSBuYW1lc1xuZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5nUG9zaXgocGF0aCwgYWxsb3dBYm92ZVJvb3QpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICB2YXIgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICB2YXIgbGFzdFNsYXNoID0gLTE7XG4gIHZhciBkb3RzID0gMDtcbiAgdmFyIGNvZGU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDw9IHBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaSA8IHBhdGgubGVuZ3RoKVxuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NyAvKi8qLylcbiAgICAgIGJyZWFrO1xuICAgIGVsc2VcbiAgICAgIGNvZGUgPSA0NyAvKi8qLztcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgIGlmIChsYXN0U2xhc2ggPT09IGkgLSAxIHx8IGRvdHMgPT09IDEpIHtcbiAgICAgICAgLy8gTk9PUFxuICAgICAgfSBlbHNlIGlmIChsYXN0U2xhc2ggIT09IGkgLSAxICYmIGRvdHMgPT09IDIpIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPCAyIHx8IGxhc3RTZWdtZW50TGVuZ3RoICE9PSAyIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAxKSAhPT0gNDYgLyouKi8gfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDIpICE9PSA0NiAvKi4qLykge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdmFyIGxhc3RTbGFzaEluZGV4ID0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICBpZiAobGFzdFNsYXNoSW5kZXggIT09IHJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLnNsaWNlKDAsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IHJlcy5sZW5ndGggLSAxIC0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMiB8fCByZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXMgKz0gJy8uLic7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzID0gJy4uJztcbiAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICByZXMgKz0gJy8nICsgcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlcyA9IHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XG4gICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gaSAtIGxhc3RTbGFzaCAtIDE7XG4gICAgICB9XG4gICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgZG90cyA9IDA7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSA0NiAvKi4qLyAmJiBkb3RzICE9PSAtMSkge1xuICAgICAgKytkb3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb3RzID0gLTE7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIF9mb3JtYXQoc2VwLCBwYXRoT2JqZWN0KSB7XG4gIHZhciBkaXIgPSBwYXRoT2JqZWN0LmRpciB8fCBwYXRoT2JqZWN0LnJvb3Q7XG4gIHZhciBiYXNlID0gcGF0aE9iamVjdC5iYXNlIHx8IChwYXRoT2JqZWN0Lm5hbWUgfHwgJycpICsgKHBhdGhPYmplY3QuZXh0IHx8ICcnKTtcbiAgaWYgKCFkaXIpIHtcbiAgICByZXR1cm4gYmFzZTtcbiAgfVxuICBpZiAoZGlyID09PSBwYXRoT2JqZWN0LnJvb3QpIHtcbiAgICByZXR1cm4gZGlyICsgYmFzZTtcbiAgfVxuICByZXR1cm4gZGlyICsgc2VwICsgYmFzZTtcbn1cblxudmFyIHBvc2l4ID0ge1xuICAvLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gICAgdmFyIHJlc29sdmVkUGF0aCA9ICcnO1xuICAgIHZhciByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG4gICAgdmFyIGN3ZDtcblxuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgICB2YXIgcGF0aDtcbiAgICAgIGlmIChpID49IDApXG4gICAgICAgIHBhdGggPSBhcmd1bWVudHNbaV07XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGN3ZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgIHBhdGggPSBjd2Q7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICAgIC8vIFNraXAgZW1wdHkgZW50cmllc1xuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gICAgfVxuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAgIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplU3RyaW5nUG9zaXgocmVzb2x2ZWRQYXRoLCAhcmVzb2x2ZWRBYnNvbHV0ZSk7XG5cbiAgICBpZiAocmVzb2x2ZWRBYnNvbHV0ZSkge1xuICAgICAgaWYgKHJlc29sdmVkUGF0aC5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJy8nO1xuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiByZXNvbHZlZFBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnLic7XG4gICAgfVxuICB9LFxuXG4gIG5vcm1hbGl6ZTogZnVuY3Rpb24gbm9ybWFsaXplKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuXG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICAgIHZhciB0cmFpbGluZ1NlcGFyYXRvciA9IHBhdGguY2hhckNvZGVBdChwYXRoLmxlbmd0aCAtIDEpID09PSA0NyAvKi8qLztcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHBhdGggPSBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCAhaXNBYnNvbHV0ZSk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDAgJiYgIWlzQWJzb2x1dGUpIHBhdGggPSAnLic7XG4gICAgaWYgKHBhdGgubGVuZ3RoID4gMCAmJiB0cmFpbGluZ1NlcGFyYXRvcikgcGF0aCArPSAnLyc7XG5cbiAgICBpZiAoaXNBYnNvbHV0ZSkgcmV0dXJuICcvJyArIHBhdGg7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPiAwICYmIHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gIH0sXG5cbiAgam9pbjogZnVuY3Rpb24gam9pbigpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiAnLic7XG4gICAgdmFyIGpvaW5lZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGFzc2VydFBhdGgoYXJnKTtcbiAgICAgIGlmIChhcmcubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoam9pbmVkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgam9pbmVkID0gYXJnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgam9pbmVkICs9ICcvJyArIGFyZztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuICcuJztcbiAgICByZXR1cm4gcG9zaXgubm9ybWFsaXplKGpvaW5lZCk7XG4gIH0sXG5cbiAgcmVsYXRpdmU6IGZ1bmN0aW9uIHJlbGF0aXZlKGZyb20sIHRvKSB7XG4gICAgYXNzZXJ0UGF0aChmcm9tKTtcbiAgICBhc3NlcnRQYXRoKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgZnJvbSA9IHBvc2l4LnJlc29sdmUoZnJvbSk7XG4gICAgdG8gPSBwb3NpeC5yZXNvbHZlKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgLy8gVHJpbSBhbnkgbGVhZGluZyBiYWNrc2xhc2hlc1xuICAgIHZhciBmcm9tU3RhcnQgPSAxO1xuICAgIGZvciAoOyBmcm9tU3RhcnQgPCBmcm9tLmxlbmd0aDsgKytmcm9tU3RhcnQpIHtcbiAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0KSAhPT0gNDcgLyovKi8pXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgZnJvbUVuZCA9IGZyb20ubGVuZ3RoO1xuICAgIHZhciBmcm9tTGVuID0gZnJvbUVuZCAtIGZyb21TdGFydDtcblxuICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcbiAgICB2YXIgdG9TdGFydCA9IDE7XG4gICAgZm9yICg7IHRvU3RhcnQgPCB0by5sZW5ndGg7ICsrdG9TdGFydCkge1xuICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCkgIT09IDQ3IC8qLyovKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdmFyIHRvRW5kID0gdG8ubGVuZ3RoO1xuICAgIHZhciB0b0xlbiA9IHRvRW5kIC0gdG9TdGFydDtcblxuICAgIC8vIENvbXBhcmUgcGF0aHMgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb21tb24gcGF0aCBmcm9tIHJvb3RcbiAgICB2YXIgbGVuZ3RoID0gZnJvbUxlbiA8IHRvTGVuID8gZnJvbUxlbiA6IHRvTGVuO1xuICAgIHZhciBsYXN0Q29tbW9uU2VwID0gLTE7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoOyBpIDw9IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGlmICh0b0xlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQgKyBpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgZXhhY3QgYmFzZSBwYXRoIGZvciBgdG9gLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyJzsgdG89Jy9mb28vYmFyL2JheidcbiAgICAgICAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0ICsgaSArIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYGZyb21gIGlzIHRoZSByb290XG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nLyc7IHRvPScvZm9vJ1xuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnJvbUxlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgdG9gIGlzIHRoZSBleGFjdCBiYXNlIHBhdGggZm9yIGBmcm9tYC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vL2Jhci9iYXonOyB0bz0nL2Zvby9iYXInXG4gICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIHJvb3QuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvbyc7IHRvPScvJ1xuICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFyIGZyb21Db2RlID0gZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpO1xuICAgICAgdmFyIHRvQ29kZSA9IHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpO1xuICAgICAgaWYgKGZyb21Db2RlICE9PSB0b0NvZGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgZWxzZSBpZiAoZnJvbUNvZGUgPT09IDQ3IC8qLyovKVxuICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gJyc7XG4gICAgLy8gR2VuZXJhdGUgdGhlIHJlbGF0aXZlIHBhdGggYmFzZWQgb24gdGhlIHBhdGggZGlmZmVyZW5jZSBiZXR3ZWVuIGB0b2BcbiAgICAvLyBhbmQgYGZyb21gXG4gICAgZm9yIChpID0gZnJvbVN0YXJ0ICsgbGFzdENvbW1vblNlcCArIDE7IGkgPD0gZnJvbUVuZDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gZnJvbUVuZCB8fCBmcm9tLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICAgIG91dCArPSAnLi4nO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgb3V0ICs9ICcvLi4nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExhc3RseSwgYXBwZW5kIHRoZSByZXN0IG9mIHRoZSBkZXN0aW5hdGlvbiAoYHRvYCkgcGF0aCB0aGF0IGNvbWVzIGFmdGVyXG4gICAgLy8gdGhlIGNvbW1vbiBwYXRoIHBhcnRzXG4gICAgaWYgKG91dC5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIG91dCArIHRvLnNsaWNlKHRvU3RhcnQgKyBsYXN0Q29tbW9uU2VwKTtcbiAgICBlbHNlIHtcbiAgICAgIHRvU3RhcnQgKz0gbGFzdENvbW1vblNlcDtcbiAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpID09PSA0NyAvKi8qLylcbiAgICAgICAgKyt0b1N0YXJ0O1xuICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQpO1xuICAgIH1cbiAgfSxcblxuICBfbWFrZUxvbmc6IGZ1bmN0aW9uIF9tYWtlTG9uZyhwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgZGlybmFtZTogZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIGhhc1Jvb3QgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAxOyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3JcbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xuICAgIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkgcmV0dXJuICcvLyc7XG4gICAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbiAgfSxcblxuICBiYXNlbmFtZTogZnVuY3Rpb24gYmFzZW5hbWUocGF0aCwgZXh0KSB7XG4gICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBleHQgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImV4dFwiIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgZXh0Lmxlbmd0aCA+IDAgJiYgZXh0Lmxlbmd0aCA8PSBwYXRoLmxlbmd0aCkge1xuICAgICAgaWYgKGV4dC5sZW5ndGggPT09IHBhdGgubGVuZ3RoICYmIGV4dCA9PT0gcGF0aCkgcmV0dXJuICcnO1xuICAgICAgdmFyIGV4dElkeCA9IGV4dC5sZW5ndGggLSAxO1xuICAgICAgdmFyIGZpcnN0Tm9uU2xhc2hFbmQgPSAtMTtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZmlyc3ROb25TbGFzaEVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCByZW1lbWJlciB0aGlzIGluZGV4IGluIGNhc2VcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgaXQgaWYgdGhlIGV4dGVuc2lvbiBlbmRzIHVwIG5vdCBtYXRjaGluZ1xuICAgICAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgICAgICBmaXJzdE5vblNsYXNoRW5kID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChleHRJZHggPj0gMCkge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIG1hdGNoIHRoZSBleHBsaWNpdCBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBleHQuY2hhckNvZGVBdChleHRJZHgpKSB7XG4gICAgICAgICAgICAgIGlmICgtLWV4dElkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBtYXRjaGVkIHRoZSBleHRlbnNpb24sIHNvIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91ciBwYXRoXG4gICAgICAgICAgICAgICAgLy8gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIGRvZXMgbm90IG1hdGNoLCBzbyBvdXIgcmVzdWx0IGlzIHRoZSBlbnRpcmUgcGF0aFxuICAgICAgICAgICAgICAvLyBjb21wb25lbnRcbiAgICAgICAgICAgICAgZXh0SWR4ID0gLTE7XG4gICAgICAgICAgICAgIGVuZCA9IGZpcnN0Tm9uU2xhc2hFbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydCA9PT0gZW5kKSBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO2Vsc2UgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IHBhdGgubGVuZ3RoO1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmQgPT09IC0xKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9XG4gIH0sXG5cbiAgZXh0bmFtZTogZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAgIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gICAgdmFyIHByZURvdFN0YXRlID0gMDtcbiAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICAgIHN0YXJ0RG90ID0gaTtcbiAgICAgICAgICBlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSlcbiAgICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG4gIH0sXG5cbiAgZm9ybWF0OiBmdW5jdGlvbiBmb3JtYXQocGF0aE9iamVjdCkge1xuICAgIGlmIChwYXRoT2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBwYXRoT2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwicGF0aE9iamVjdFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBwYXRoT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF9mb3JtYXQoJy8nLCBwYXRoT2JqZWN0KTtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24gcGFyc2UocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICB2YXIgcmV0ID0geyByb290OiAnJywgZGlyOiAnJywgYmFzZTogJycsIGV4dDogJycsIG5hbWU6ICcnIH07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gcmV0O1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBpc0Fic29sdXRlID0gY29kZSA9PT0gNDcgLyovKi87XG4gICAgdmFyIHN0YXJ0O1xuICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICByZXQucm9vdCA9ICcvJztcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG5cbiAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuXG4gICAgLy8gR2V0IG5vbi1kaXIgaW5mb1xuICAgIGZvciAoOyBpID49IHN0YXJ0OyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSkgc3RhcnREb3QgPSBpO2Vsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKSBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgICAgaWYgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSByZXQuYmFzZSA9IHJldC5uYW1lID0gcGF0aC5zbGljZSgxLCBlbmQpO2Vsc2UgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHtcbiAgICAgICAgcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIHN0YXJ0RG90KTtcbiAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKDEsIGVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBzdGFydERvdCk7XG4gICAgICAgIHJldC5iYXNlID0gcGF0aC5zbGljZShzdGFydFBhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgICByZXQuZXh0ID0gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQYXJ0ID4gMCkgcmV0LmRpciA9IHBhdGguc2xpY2UoMCwgc3RhcnRQYXJ0IC0gMSk7ZWxzZSBpZiAoaXNBYnNvbHV0ZSkgcmV0LmRpciA9ICcvJztcblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgc2VwOiAnLycsXG4gIGRlbGltaXRlcjogJzonLFxuICB3aW4zMjogbnVsbCxcbiAgcG9zaXg6IG51bGxcbn07XG5cbnBvc2l4LnBvc2l4ID0gcG9zaXg7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zaXg7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuXG5jb25zdCBQVVpaTEVfU0laRSA9IDEwO1xuXG4vKipcbiAqIEEgbXV0YWJsZSBzcG90IG9iamVjdCB0aGF0IHJlcHJlc2VudHMgYSBsb2NhdGlvbiB3aGVyZSBhIHN0YXIgY2FuIGJlIHBsYWNlZCBpbiB0aGUgZ2FtZSBTdGFyIEJhdHRsZSwgaXQgYWxzb1xuICogaGFzIGEgZGVmaW5lZCByZWdpb24gaXQgYmVsb25ncyB0by5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwb3R7XG5cbiAgICAvLyBBRihyb3csIGNvbHVtbiwgc3RhciwgcmVnaW9uKSA9IGEgc3BvdCBvbiBhIGdhbWVib2FyZCBvZiBzdGFyIGJhdHRsZSBhdCB0aGUgcm93ICdyb3cnIGFuZCBjb2x1bW4gJ2NvbHVtbidcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzcG90IGJlbG9uZ3MgdG8gdGhlIHJlZ2lvbiAncmVnaW9uJyBhbmQgaGFzIGEgc3RhciBhdCB0aGUgc3BvdCBpZiAnc3RhcidcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRydWUsIG90aGVyd2lzZSBpdCBkb2Vzbid0IGhhdmUgYSBzdGFyXG4gICAgLy9cbiAgICAvLyBSSTpcbiAgICAvLyAgIDEgPD0gKHJvdywgY29sdW1uLCAmIHJlZ2lvbikgPD0gMTBcbiAgICAvLyAgIFxuICAgIC8vIFNSRTogXG4gICAgLy8gICBBbGwgaW5zdGFuY2UgdmFyaWFibGVzIGFyZSBpbW11dGFibGUsIHByaXZhdGUgYW5kIG9ubHkgc3RhciBpcyBub3QgcmVhZG9ubHkuIE5vIG9wZWF0aW9ucyBleGNlcHQgZ2V0QWRqYWNlbnQgcmV0dXJuIG11dGFibGUgdHlwZXNcbiAgICAvLyAgIHNvIHNhZmUgZnJvbSByZXAgZXhwb3N1cmUgYW5kIGFsbCBpbnB1dHMgdG8gY29uc3RydWN0b3IgYXJlIGFsc28gaW1tdXRhYmxlXG4gICAgLy8gICBnZXRBZGphY2VudCBkb2VzIG5vdCByZXR1cm4gYW55IG9mIHRoZSByZXAgYW5kIHNpbXBseSByZXR1cm5zIGEgbmV3IGFycmF5IG9mIGltbXV0YWJsZSBvYmplY3RzIHNvIHNhZmUgZnJvbSByZXAgZXhwb3N1cmVcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzcG90IHdpdGggdGhlIHZhbHVlcyBnaXZlbiB0byBpdFxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgcm93IGNvb3JkaW5hdGUgdGhhdCB0aGUgc3BvdCBpcyBsb2NhdGVkIGF0XG4gICAgICogQHBhcmFtIGNvbHVtbiBjb2x1bW4gY29vcmRpbmF0ZSB0aGF0IHRoZSBzcG90IGlzIGxvY2F0ZWQgYXRcbiAgICAgKiBAcGFyYW0gc3RhciB0cnVlIGlmIHRoZXJlIGlzIGEgc3RhciBhdCB0aGlzIHNwb3Qgb24gdGhlIGdhbWVib2FyZFxuICAgICAqIEBwYXJhbSByZWdpb24gcmVnaW9uIHRoYXQgdGhlIHNwb3QgYmVsb25ncyB0b1xuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHJvdzogbnVtYmVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW46IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgIHByaXZhdGUgc3RhcjogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByZWdpb246IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgY2hlY2tSZXAoKTogdm9pZCB7XG4gICAgICAgIGFzc2VydCh0aGlzLnJvdyA+PSAxICYmIHRoaXMucm93IDw9IFBVWlpMRV9TSVpFKTtcbiAgICAgICAgYXNzZXJ0KHRoaXMuY29sdW1uID49IDEgJiYgdGhpcy5jb2x1bW4gPD0gUFVaWkxFX1NJWkUpO1xuICAgICAgICBhc3NlcnQodGhpcy5yZWdpb24gPj0gMSAmJiB0aGlzLnJlZ2lvbiA8PSBQVVpaTEVfU0laRSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgcm93IG9mIHNwb3QuIHdpbGwgYmUgYmV0d2VlbiAxLTEwIGluY2x1c2l2ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSb3coKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5yb3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgY29sdW1uIG9mIHNwb3QuIHdpbGwgYmUgYmV0d2VlbiAxLTEwIGluY2x1c2l2ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDb2x1bW4oKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlcyB0aGUgYm9vbGVhbiBvZiB0aGUgc3RhciB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlU3RhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFyID0gIXRoaXMuc3RhcjtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHRydWUgaWZmIHRoZSBzcG90IGhhcyBhIHN0YXIgYXQgaXQsIG90aGVyd2lzZSBmYWxzZVxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNTdGFyKCk6IGJvb2xlYW4ge1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgcmVnaW9uIG9mIHNwb3QuIHdpbGwgYmUgYmV0d2VlbiAxLTEwIGluY2x1c2l2ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSZWdpb24oKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbGlzdCBvZiBjb29yZGlhbnRlcyBvZiBhZGphY2VudCBzcG90cyB0byB0aGUgY3VycmVudCBzcG90XG4gICAgICogXG4gICAgICogQHJldHVybnMgbGlzdCBvZiBjb29yZGluYXRlIHBhaXJzIHRoYXQgcmVwcmVzZW50IGFsbCB2YWxpZCBhZGphY2VudCBzcG90cyAoaG9yaXpvbnRhbGx5LCB2ZXJ0aWNhbGx5LCBhbmQgZGlhZ29uYWxseSkgdG8gdGhlIFxuICAgICAqICAgICAgICAgIGN1cnJlbnQgc3BvdCBvYmplY3QuIE9taXRzIGFueSBzcG90cyB0aGF0IGFyZSBvdXRzaWRlIHRoZSByYW5nZSBvZiB0aGUgYm9hcmQgb3IgZXF1YWwgdG8gdGhlIHNwb3QgaXRzZWxmLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBZGphY2VudCgpOiBBcnJheTxbbnVtYmVyLCBudW1iZXJdPntcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICBcbiAgICAgICAgLy9nZXQgYWxsIGFkamFjZW50IHNwb3RzXG4gICAgICAgIGNvbnN0IGFsbFNwb3RzOiBBcnJheTxbbnVtYmVyLCBudW1iZXJdPiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHggb2YgWy0xLDAsMV0pe1xuICAgICAgICAgICAgZm9yIChjb25zdCB5IG9mIFstMSwwLDFdKXtcbiAgICAgICAgICAgICAgICBhbGxTcG90cy5wdXNoKFt0aGlzLmdldFJvdygpICsgeCwgdGhpcy5nZXRDb2x1bW4oKSArIHldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc3RydWN0IG5ldyBhcnJheSB0aGF0IG9ubHkgaGFzIHZhbGlkIGFkamFjZW50IGJveGVzXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkQXJyOkFycmF5PFtudW1iZXIsIG51bWJlcl0+ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY29vcmQgb2YgYWxsU3BvdHMpe1xuICAgICAgICAgICAgbGV0IHRvQWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChjb29yZFswXSA9PT0gdGhpcy5nZXRSb3coKSAmJiBjb29yZFsxXSA9PT0gdGhpcy5nZXRDb2x1bW4oKSl7XG4gICAgICAgICAgICAgICAgdG9BZGQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvb3JkWzBdIDwgMSB8fCBjb29yZFswXSA+IFBVWlpMRV9TSVpFKXtcbiAgICAgICAgICAgICAgICB0b0FkZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoY29vcmRbMV0gPCAxIHx8IGNvb3JkWzFdID4gUFVaWkxFX1NJWkUpe1xuICAgICAgICAgICAgICAgIHRvQWRkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0b0FkZCl7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRBcnIucHVzaChjb29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkQXJyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVxdWFsaXR5IGlzIGRlZmluZWQgYXMgYmVpbmcgbG9jYXRlZCBhdCB0aGUgc2FtZSBjb29yZGluYXRlIHBhaXJcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGhhdCBhIHNlY29uZCBzcG90IG9iamVjdCB0byBjb21wYXJlIHRvIHRoZSBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmZiB0aGUgcm93IGFuZCBjb2x1bW4gY29vcmRpbmF0ZSBvZiB0aGUgdHdvIHNwb3RzIGFyZSB0aGUgc2FtZVxuICAgICAqL1xuICAgIHB1YmxpYyBlcXVhbFZhbHVlKHRoYXQ6IFNwb3QpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoYXQuZ2V0Q29sdW1uKCkgPT09IHRoaXMuY29sdW1uICYmIHRoYXQuZ2V0Um93KCkgPT09IHRoaXMucm93KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIGEgcGFyc2FibGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzcG90IEFEVFxuICAgICAqL1xuICAgIHB1YmxpYyB0b1BhcnNlYWJsZVN0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3cgKyAnLCcgKyB0aGlzLmNvbHVtbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBhIGh1bWFuIHJlYWRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzcG90IEFEVFxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3cgKyAnLCAnICsgdGhpcy5jb2x1bW4gKyAnLCAnICsgdGhpcy5yZWdpb24gKyAnLCAnICsgdGhpcy5zdGFyO1xuICAgIH1cblxufVxuXG4vKipcbiAqIEFuIGltbXV0YWJsZSBQdXp6bGUgZm9yIGEgMTB4MTAgZ2FtZSBvZiBTdGFyIEJhdHRsZS4gQXMgZGVzY3JpYmVkIGluIHRoZSBwcm9qZWN0IGhhbmRvdXQsIGl0IGlzIGJ1aWxkIG9mIDEwMFxuICogbG9jYXRpb25zLCB3aGljaCBiZWxvbmcgdG8gYSByZWdpb24gYW5kIG1heSBvciBtYXkgbm90IGhhdmUgYSBzdGFyIGluIHRoZW0uIFRoZSBwdXp6bGUgY2FuIGJlIGluIGFuIGVtcHR5LCBwYXJ0aWFsbHlcbiAqIGNvbXBsZXRlZCwgb3Igc29sdmVkIGdhbWUgc3RhdGUgYXMgZGVmaW5lZCBpbiB0aGUgaGFuZG91dC4gXG4gKi9cbmV4cG9ydCBjbGFzcyBQdXp6bGV7XG5cbiAgICAvLyBBRihib2FyZCkgPSB0aGUgYm9hcmQgaXMgYSAxRCBhcnJheSBvZiBsb2NhdGlvbnMgcmVwcmVzZW50ZWQgYXMgc3BvdHMgb2YgYSAyRCBnYW1lYm9hcmQgc3RvcmVkIGluIHJvdyBtYWpvciwgMS1pbmRleGVkIG9yZGVyLCB3aGVyZSB0aGVcbiAgICAvLyAgICAgICAgICAgICBmaXJzdCB2YWx1ZSBpbiB0aGUgYXJyYXkgaXMgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgZ2FtZWJvYXJkLiBUbyBnZXQgdGhlIHNwb3QgYXQgcm93LCBjb2wsIHVzZSBib2FyZFsoY29sdW1uIC0gMSkgKyBQVVpaTEVfU0laRSAqIChyb3cgLSAxKTtdXG4gICAgLy8gUkk6XG4gICAgLy8gICBsZW5ndGggb2YgYm9hcmQgPT09IFBVWlpMRVNJWkVeMlxuICAgIC8vICAgXG4gICAgLy8gU1JFOiBcbiAgICAvLyAgIEFsbCBpbnN0YW5jZSB2YXJpYWJsZXMgYXJlIGltbXV0YWJsZSwgcHJpdmF0ZSBhbmQgb25seSBzdGFyIGlzIG5vdCByZWFkb25seS4gVGhlIG9ubHkgb3BlcmF0aW9uXG4gICAgLy8gICB0aGF0IHJldHVybnMgYSBtdXRhYmxlIHR5cGUgaXMgbm90IGEgdGhyZWF0IHNpbmNlIHRoZSByZXAgaXMgaW1tdXRhYmxlLiBEZWVwIGNvcGllcyBvZiBvYmplY3RzIHBhc3NlZFxuICAgIC8vICAgaW4gdGhlIGNvbnN0cnVjdG9yIGFyZSBtYWRlIGJlZm9yZSBwdXR0aW5nIHRoZW0gaW50byB0aGUgcmVwXG4gICAgLy9cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgYm9hcmQ6IEFycmF5PFNwb3Q+O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBpbW11dGFibGUgcHV6emxlIG9iamVjdCBieSBkZWNvbnN0cnVjdGluZyBtYXBzIGFuZCBtYWtpbmcgZGVlcCBjb3BpZXMgb2Ygc3BvdCBvYmplY3RzXG4gICAgICogXG4gICAgICogQHBhcmFtIHJlZ2lvbk1hcCBtYXAgbWFwcGluZyBldmVyeSByb3cgYW5kIGNvbHVtbiBwYWlyIChpbiBmb3JtYXQgcm93eGNvbCkgdG8gdGhlIHJlZ2lvbiB0aGF0IGlzIGluLiBFdmVyeSByb3cgY29sdW1uIHBhaXIgbXVzdCBiZSBpbiB0aGUgbWFwXG4gICAgICogQHBhcmFtIHN0YXJNYXAgbWFwIG1hcHBpbmcgZXZlcnkgcm93IGFuZCBjb2x1bW4gcGFpciAoaW4gZm9ybWF0IHJvd3hjb2wpIHRvIGEgYm9vbGVhbiB0aGF0IGlzIHRydWUgaWYgdGhlcmUgaXMgYSBzdGFyIHRoZXJlIGFuZCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKiAgICAgICAgICAgICAgICBFdmVyeSByb3cgY29sdW1uIHBhaXIgbXVzdCBiZSBpbiB0aGUgbWFwIChyb3cgYW5kIGNvbHVtbnMgYXJlIDEgaW5kZXhlZClcbiAgICAgKiBAdGhyb3dzIGVycm9yIGlmIGVpdGhlciBzdGFyTWFwIG9yIHJlZ2lvbk1hcCBkb2VzIG5vdCBldmVyeSByb3cgYW5kIGNvbHVtbiBwYWlyIGluIGl0IG9yIHRoZXJlIGlzIG5vdCBleGFjdGx5IDEwMCBsb2NhdGlvbnMgbGlzdGVkIGluIGVhY2hcbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocmVnaW9uTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+LCBzdGFyTWFwOiBNYXA8c3RyaW5nLCBib29sZWFuPikge1xuXG4gICAgICAgIC8vZW5zdXJlIGV4YWN0bHkgMTAwIGxvY2F0aW9ucyBleGlzdCBpbiBpbnB1dHMgKGZhaWwgZmFzdClcbiAgICAgICAgYXNzZXJ0KFsuLi5yZWdpb25NYXAua2V5cygpXS5sZW5ndGggPT09IFBVWlpMRV9TSVpFKioyLCAncHV6emxlIGlzIHRoZSB3cm9uZyBsZW5ndGgnKTtcbiAgICAgICAgYXNzZXJ0KFsuLi5zdGFyTWFwLmtleXMoKV0ubGVuZ3RoID09PSBQVVpaTEVfU0laRSoqMiwgJ3B1enpsZSBpcyB0aGUgd3JvbmcgbGVuZ3RoJyk7XG5cblxuICAgICAgICAvL2NyZWF0ZSBuZXcgYm9hcmQgd2l0aCBjb29yZXNwb25kaW5nIHNwb3QgdmFsdWVzXG4gICAgICAgIGNvbnN0IG5ld0JvYXJkOiBBcnJheTxTcG90PiA9IFtdO1xuICAgICAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gUFVaWkxFX1NJWkU7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gPSAxOyBjb2x1bW4gPD0gUFVaWkxFX1NJWkU7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcmVnaW9uTWFwLmdldCh0aGlzLmdldFN0cmluZ0xvY2F0aW9uKHJvdywgY29sdW1uKSkgPz8gYXNzZXJ0LmZhaWwoJ3JlZ2lvbk1hcCBkb2VzbnQgaGF2ZSByb3csY29sdW1uIHBhaXInKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNTdGFyID0gc3Rhck1hcC5nZXQodGhpcy5nZXRTdHJpbmdMb2NhdGlvbihyb3csIGNvbHVtbikpID8/IGFzc2VydC5mYWlsKCdzdGFyTWFwIGRvZXNudCBoYXZlIHJvdyxjb2x1bW4gcGFpcicpO1xuICAgICAgICAgICAgICAgIG5ld0JvYXJkLnB1c2gobmV3IFNwb3Qocm93LCBjb2x1bW4sIGhhc1N0YXIsIHJlZ2lvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9hcmQgPSBuZXdCb2FyZDtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tSZXAoKTogdm9pZHtcbiAgICAgICAgYXNzZXJ0KHRoaXMuYm9hcmQubGVuZ3RoID09PSBQVVpaTEVfU0laRSAqIFBVWlpMRV9TSVpFKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3RyaW5nIHZlcnNpb24gb2Ygcm93IGFuZCBjb2x1bW4gY29vcmRpbmF0ZSBwYWlyXG4gICAgICogXG4gICAgICogQHBhcmFtIHJvdyByb3cgY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSBjb2wgY29sdW1uIGNvb3JkaW5hdGVcbiAgICAgKiBAcmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHJvdyBhbmQgY29sdW1uIHRvIGJlIGhhc2hlZFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0U3RyaW5nTG9jYXRpb24ocm93OiBudW1iZXIsIGNvbDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHJvdyArICcsJyArIGNvbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBjb29yZGluYXRlcyBwYWlyIHRvIGFuIGluZGV4IGZvciB0aGUgMUQgYm9hcmRcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gcm93IGNvb3JkaW5hdGUgdG8gY29udmVydFxuICAgICAqIEBwYXJhbSBjb2x1bW4gY29vcmRpbmF0ZSB0byBjb252ZXJ0XG4gICAgICogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBjb3JyZXNwb25kaW5nIHNwb3QgZm9yIHRoZSAxRCBib2FyZFxuICAgICAqIEB0aHJvd3MgZXJyb3IgaWYgdGhlIHJvdyBvciBjb2x1bW4gdmFsdWVzIGFyZSBvdXRzaWRlIHRoZSBzY29wZSBvZiB0aGUgYm9hcmRcbiAgICAgKi9cbiAgICBwcml2YXRlIGNvb3Jkc1RvSW5kZXgocm93Om51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBhc3NlcnQocm93ID49IDEgJiYgcm93IDw9IFBVWlpMRV9TSVpFKTtcbiAgICAgICAgYXNzZXJ0KGNvbHVtbiA+PSAxICYmIGNvbHVtbiA8PSBQVVpaTEVfU0laRSk7XG4gICAgICAgIHJldHVybiAoY29sdW1uIC0gMSkgKyBQVVpaTEVfU0laRSAqIChyb3cgLSAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSBwYWlyIGhhcyBhIHN0YXIgaW4gaXRcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gcm93IHRoZSByb3cgY29vcmRpbmF0ZSB0byBjaGVja1xuICAgICAqIEBwYXJhbSBjb2x1bW4gdGhlIGNvbHVtbiBjb29yZGluYXRlIHRvIGNoZWNrXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZmYgdGhlIHNwb3QgaGFzIGEgc3Rhciwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgICogQHRocm93cyBlcnJvciBpZiByb3cgYW5kIGNvbHVtbiBhcmUgb3V0c2lkZSB0aGUgcmFuZ2Ugb2YgdGhlIGJvYXJkXG4gICAgICovXG4gICAgcHVibGljIGhhc1N0YXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgY29uc3QgaW5kZXhUb0NoZWNrID0gdGhpcy5jb29yZHNUb0luZGV4KHJvdywgY29sdW1uKTtcbiAgICAgICAgY29uc3Qgc3BvdFRvQ2hlY2sgPSB0aGlzLmJvYXJkW2luZGV4VG9DaGVja10/P2Fzc2VydC5mYWlsKCdpbmRleCBvdXQgb2YgYXJyYXknKTtcbiAgICAgICAgcmV0dXJuIHNwb3RUb0NoZWNrLmhhc1N0YXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSByZWdpb24gYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcGFpclxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgdGhlIHJvdyBjb29yZGluYXRlIHRvIGNoZWNrXG4gICAgICogQHBhcmFtIGNvbHVtbiB0aGUgY29sdW1uIGNvb3JkaW5hdGUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyB0aGUgcmVnaW9uIGF0IHRoZSBjb29yZGluYXRlIHBhaXJcbiAgICAgKiBAdGhyb3dzIGVycm9yIGlmIHJvdyBhbmQgY29sdW1uIGFyZSBvdXRzaWRlIHRoZSByYW5nZSBvZiB0aGUgYm9hcmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UmVnaW9uKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgY29uc3QgaW5kZXhUb0NoZWNrOiBudW1iZXIgPSB0aGlzLmNvb3Jkc1RvSW5kZXgocm93LCBjb2x1bW4pO1xuICAgICAgICBjb25zdCBzcG90OiBTcG90ID0gdGhpcy5ib2FyZFtpbmRleFRvQ2hlY2tdPz9hc3NlcnQuZmFpbCgnaW5kZXggb3V0IG9mIGFycmF5Jyk7XG4gICAgICAgIHJldHVybiBzcG90LmdldFJlZ2lvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgcHV6emxlIHdpdGggdGhlIHN0YXIgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcGFpciB1cGRhdGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgdGhlIHJvdyBjb29yZGluYXRlIHRvIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBjb2x1bW4gdGhlIGNvbHVtbiBjb29yZGluYXRlIHRvIHVwZGF0ZVxuICAgICAqIEByZXR1cm5zIGEgbmV3IFB1enpsZSB0byByZWZsZWN0IHRoZSB1cGRhdGVkIHN0YXIgc3RhdGUgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcGFpclxuICAgICAqIEB0aHJvd3MgZXJyb3IgaWYgdGhlIHJvdyBhbmQgY29sdW1uIGFyZSBub3Qgb24gdGhlIGJvYXJkXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZVN0YXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogUHV6emxlIHtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICBjb25zdCByZWdpb25NYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IHN0YXJNYXA6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIC8vZm9yIGVhY2ggc3BvdCwgYWRkIHRvIHRoZSBuZXcgbWFwc1xuICAgICAgICBmb3IgKGNvbnN0IHNwb3Qgb2YgdGhpcy5ib2FyZCl7XG4gICAgICAgICAgICByZWdpb25NYXAuc2V0KHRoaXMuZ2V0U3RyaW5nTG9jYXRpb24oc3BvdC5nZXRSb3coKSwgc3BvdC5nZXRDb2x1bW4oKSksIHNwb3QuZ2V0UmVnaW9uKCkpO1xuXG4gICAgICAgICAgICAvL2lmIHNwb3QgdG8gZmxpcCB0aGUgc3RhciwgZmxpcCB0aGUgc3RhciB2YWx1ZVxuICAgICAgICAgICAgaWYgKHNwb3QuZ2V0Um93KCkgPT09IHJvdyAmJiBzcG90LmdldENvbHVtbigpID09IGNvbHVtbil7XG4gICAgICAgICAgICAgICAgc3Rhck1hcC5zZXQodGhpcy5nZXRTdHJpbmdMb2NhdGlvbihzcG90LmdldFJvdygpLCBzcG90LmdldENvbHVtbigpKSwgIXNwb3QuaGFzU3RhcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgc3Rhck1hcC5zZXQodGhpcy5nZXRTdHJpbmdMb2NhdGlvbihzcG90LmdldFJvdygpLCBzcG90LmdldENvbHVtbigpKSwgc3BvdC5oYXNTdGFyKCkpOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFB1enpsZShyZWdpb25NYXAsIHN0YXJNYXApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgcHV6emxlIGlzIHNvbHZlZCBiYXNlZCBvbiB0aGUgcnVsZXMgb2YgU3RhciBCYXR0bGUgYXMgZGVmaW5lZCBpbiB0aGUgcHJvamVjdCBoYW5kb3V0OlxuICAgICAqICAgICAgIFRoZXJlIGNhbiBiZSBubyBhZGphY2VudCBzdGFycyAoaG9yaXpvbnRhbGx5LCB2ZXJ0aWNhbGx5LCBvciBkaWFnb25hbGx5IGFkamFjZW50KVxuICAgICAqICAgICAgIFRoZXJlIG11c3QgYmUgdHdvIHN0YXJzIGluIGV2ZXJ5IHJlZ2lvblxuICAgICAqICAgICAgIFRoZXJlIG11c3QgYmUgdHdvIHN0YXJzIGluIGV2ZXJ5IHJvd1xuICAgICAqICAgICAgIFRoZXJlIG11c3QgYmUgdHdvIHN0YXJzIGluIGV2ZXJ5IGNvbHVtblxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHRydWUgaWZmIHRoZSBQdXp6bGUgaXMgc29sdmVkLCBvdGhlcndpc2UgZmFsc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNTb2x2ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgLy9DSEVDSyBIQVMgMjAgU1RBUlMgQU5EIE5PTkUgQURKQUNFTlRcbiAgICAgICAgbGV0IHN0YXJDb3VudCA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qgc3BvdCBvZiB0aGlzLmJvYXJkKXtcbiAgICAgICAgICAgIGlmIChzcG90Lmhhc1N0YXIoKSl7XG4gICAgICAgICAgICAgICAgc3RhckNvdW50ICsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBuZWlnaGJvckNvb3JkcyBvZiBzcG90LmdldEFkamFjZW50KCkpe1xuICAgICAgICAgICAgICAgIGlmICgodGhpcy5ib2FyZFt0aGlzLmNvb3Jkc1RvSW5kZXgobmVpZ2hib3JDb29yZHNbMF0sIG5laWdoYm9yQ29vcmRzWzFdKV0gPz8gYXNzZXJ0LmZhaWwoJ2Jyb2tlbiBnZXRBZGphY2VudCcpKS5oYXNTdGFyKCkpe1xuICAgICAgICAgICAgICAgICAgICBpZihzcG90Lmhhc1N0YXIoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrIG5vdCBtb3JlIHRoYW4gMiBpbiBzYW1lIHJvd1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5sZW5ndGg7IGkrPVBVWlpMRV9TSVpFKXtcbiAgICAgICAgICAgIGxldCByb3dDb3VudCA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCB3ID0gaTsgdyA8IGkgKyBQVVpaTEVfU0laRTsgdysrKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvYXJkW3ddPy5oYXNTdGFyKCkgPz8gYXNzZXJ0LmZhaWwoJ3NhbWUgcm93IGJyb2tlbicgKyBpICsgJywgJyArIHcpKXtcbiAgICAgICAgICAgICAgICAgICAgcm93Q291bnQgKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJvd0NvdW50ICE9PSAyKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vQ2hlY2sgbm90IG1vcmUgdGhhbiAyIGluIHNhbWUgY29sdW1uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgUFVaWkxFX1NJWkU7IGkgKyspe1xuICAgICAgICAgICAgbGV0IGNvbHVtbkNvdW50ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IHcgPSBpOyB3IDwgdGhpcy5ib2FyZC5sZW5ndGg7IHcgKz0gUFVaWkxFX1NJWkUpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9hcmRbd10/Lmhhc1N0YXIoKSA/PyBhc3NlcnQuZmFpbCgnc2FtZSBjb2wgYnJva2VuJykpe1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5Db3VudCArKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sdW1uQ291bnQgIT09IDIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vZXhhY3RseSAyIGluIGVhY2ggcmVnaW9uIG9mIHRoZSBtYXBcbiAgICAgICAgLy9idWlsZCBuZXcgc3RhciBtYXBcbiAgICAgICAgY29uc3Qgc3Rhck1hcDogTWFwPG51bWJlciwgQXJyYXk8U3BvdD4+ID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IFBVWlpMRV9TSVpFICsgMTsgaSsrKXtcbiAgICAgICAgICAgIHN0YXJNYXAuc2V0KGksW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9lbnRlciB0aGUgc3RhcnMgaW50byB0aGUgbWFwXG4gICAgICAgIGZvciAoY29uc3Qgc3BvdCBvZiB0aGlzLmJvYXJkKXtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IHNwb3QuZ2V0UmVnaW9uKCk7XG4gICAgICAgICAgICBpZiAoc3BvdC5oYXNTdGFyKCkpe1xuICAgICAgICAgICAgICAgIChzdGFyTWFwLmdldChyZWdpb24pID8/IGFzc2VydC5mYWlsKCkpLnB1c2goc3BvdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2Vuc3VyZSB0aGF0IGVhY2ggc3Rhckxpc3QgaXMgZXhhY3RseSAyIHN0YXJzIGxvbmdcbiAgICAgICAgZm9yKGNvbnN0IHJlZ2lvblN0YXJMaXN0IG9mIHN0YXJNYXAudmFsdWVzKCkpe1xuICAgICAgICAgICAgaWYgKHJlZ2lvblN0YXJMaXN0Lmxlbmd0aCAhPT0gMil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBwdXp6bGUgaXMgYmxhbmtcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmZiB0aGVyZSBhcmUgbm8gc3RhcnMgb24gdGhlIGVudGlyZSBib2FyZCwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgICovXG4gICAgcHVibGljIGlzQmxhbmsoKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBzdGFyQ291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHNwb3Qgb2YgdGhpcy5ib2FyZCl7XG4gICAgICAgICAgICBpZiAoc3BvdC5oYXNTdGFyKCkpe1xuICAgICAgICAgICAgICAgIHN0YXJDb3VudCArKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhckNvdW50ID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBQdXp6bGUsIGNsZWFyZWQgb2YgYWxsIHN0YXJzXG4gICAgICogXG4gICAgICogQHJldHVybnMgYSBuZXcgcHV6emxlIHdpdGggdGhlIHNhbWUgcmVnaW9ucyBhcyBjdXJyZW50IGJ1dCB3aXRoIG5vIHN0YXJzXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyUHV6emxlKCk6IFB1enpsZSB7XG4gICAgICAgIGNvbnN0IHJlZ2lvbk1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3Qgc3Rhck1hcDogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3Qgc3BvdCBvZiB0aGlzLmJvYXJkKXtcbiAgICAgICAgICAgIHJlZ2lvbk1hcC5zZXQodGhpcy5nZXRTdHJpbmdMb2NhdGlvbihzcG90LmdldFJvdygpLCBzcG90LmdldENvbHVtbigpKSwgc3BvdC5nZXRSZWdpb24oKSk7XG4gICAgICAgICAgICBzdGFyTWFwLnNldCh0aGlzLmdldFN0cmluZ0xvY2F0aW9uKHNwb3QuZ2V0Um93KCksIHNwb3QuZ2V0Q29sdW1uKCkpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQdXp6bGUocmVnaW9uTWFwLCBzdGFyTWFwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIG1hcHMgbmVlZGVkIGZvciB0b1N0cmluZyBmdW5jdGlvbmFsaXR5XG4gICAgICogXG4gICAgICogQHJldHVybnMgcmVnaW9uTWFwIHRoYXQgbWFwcyBlYWNoIHJlZ2lvbiBudW1iZXIgdG8gYSBwYXJzYWJsZSBzdHJpbmcgdGhhdCBsaXN0cyB0aGUgY29vcmRpbmF0ZXMgaW4gdGhhdCBtYXBcbiAgICAgKiAgICAgICAgICBzdGFyTWFwIHRoYXQgbWFwcyBlYWNoIHJlZ2lvbiBudW1iZXIgdG8gYSBwYXJzYWJsZSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIHRoZSBzdGFycyBpbiB0aGUgcmVnaW9uIFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VG9TdHJpbmdNYXBzKCk6IHtyZWdpb25NYXA6IE1hcDxudW1iZXIsIHN0cmluZz4sIHN0YXJNYXA6IE1hcDxudW1iZXIsIHN0cmluZz59e1xuICAgICAgICBjb25zdCByZWdpb25NYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IHN0YXJNYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgLy9mb3IgZWFjaCBzcG90IG9uIHRoZSBib2FyZCwgY2hlY2sgaWYgaXQgaGFzIGEgc3RhciBhbmQgYWRkIHRvIGNvcnJlc3BvbmRpbmcgbWFwXG4gICAgICAgIGZvciAoY29uc3Qgc3BvdCBvZiB0aGlzLmJvYXJkKXtcbiAgICAgICAgICAgIGlmICghc3BvdC5oYXNTdGFyKCkpe1xuICAgICAgICAgICAgICAgIHJlZ2lvbk1hcC5zZXQoc3BvdC5nZXRSZWdpb24oKSwocmVnaW9uTWFwLmdldChzcG90LmdldFJlZ2lvbigpKSA/PyAnJykgKyAnICcgKyBzcG90LnRvUGFyc2VhYmxlU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBzdGFyTWFwLnNldChzcG90LmdldFJlZ2lvbigpLChzdGFyTWFwLmdldChzcG90LmdldFJlZ2lvbigpKSA/PyAnJykgKyBzcG90LnRvUGFyc2VhYmxlU3RyaW5nKCkgKyAnICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlZ2lvbk1hcDogcmVnaW9uTWFwLFxuICAgICAgICAgICAgc3Rhck1hcDogc3Rhck1hcFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIGEgcGFyc2FibGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBQdXp6bGUgQURUXG4gICAgICovXG4gICAgcHVibGljIHRvUGFyc2VhYmxlU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1hcHMgPSB0aGlzLmdldFRvU3RyaW5nTWFwcygpO1xuXG4gICAgICAgIGxldCByZXR1cm5TdHJpbmcgPSBQVVpaTEVfU0laRSArICd4JyArIFBVWlpMRV9TSVpFICsgJ1xcbic7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IFBVWlpMRV9TSVpFOyBpKyspe1xuICAgICAgICAgICAgY29uc3Qgc3Rhckxpc3QgPSBtYXBzLnN0YXJNYXAuZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKHN0YXJMaXN0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBzdGFyTGlzdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9ICd8JyArIG1hcHMucmVnaW9uTWFwLmdldChpKSA/PyAgYXNzZXJ0LmZhaWwoJ2RvZXMgbm90IGhhdmUgYWxsIHRoZSByZWdpb25zJyk7XG4gICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHVyblN0cmluZztcbiAgICB9IFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIFB1enpsZSBBRFRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSA6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvUGFyc2VhYmxlU3RyaW5nKCk7XG4gICAgfVxufSIsIlxuaW1wb3J0IHsgUHV6emxlLCBTcG90fSBmcm9tICcuL1B1enpsZUFEVCc7XG5pbXBvcnQgeyBQYXJzZXIsIFBhcnNlVHJlZSwgY29tcGlsZSwgdmlzdWFsaXplQXNVcmwgfSBmcm9tICdwYXJzZXJsaWInO1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuXG4vKipcbiAqIFBhcnNlciBmb3IgU3RhciBCYXR0bGUgcHV6emxlcy5cbiAqL1xuY29uc3QgZ3JhbW1hciA9IGBcbiAgICBCT0FSRCA6Oj0gQ09NTUVOVCogJzEweDEwJyBbXFxcXG5dIFJPV3sxMH0gO1xuICAgIENPTU1FTlQgOjo9IFdISVRFU1BBQ0UqICcjJyBbXlxcXFxuXSsgW1xcXFxuXSogO1xuICAgIFJPVyA6Oj0gKFdISVRFU1BBQ0UqIFNUQVJTKiAnfCcgU1BPVFMrIFtcXFxcbl0qKSA7XG4gICAgU1RBUlMgOjo9IFdISVRFU1BBQ0UqIExPQ0FUSU9OIFdISVRFU1BBQ0UgO1xuICAgIFNQT1RTIDo6PSBXSElURVNQQUNFIExPQ0FUSU9OIDtcbiAgICBMT0NBVElPTiA6Oj0gTlVNICcsJyBOVU0gO1xuICAgIE5VTSA6Oj0gWzAtOV0rIDtcbiAgICBXSElURVNQQUNFIDo6PSBbIFxcXFx0XFxcXHJdKyA7XG5gO1xuICAgIFxuZW51bSBQdXp6bGVHcmFtbWFyIHtcbiAgICBCb2FyZCwgUm93LCBTdGFycywgU3BvdHMsIExvY2F0aW9uLCBOdW0sIFdoaXRlc3BhY2UsIENvbW1lbnRcbn1cblxuLy8gY29tcGlsZSB0aGUgZ3JhbW1hciBpbnRvIGEgcGFyc2VyXG5jb25zdCBwYXJzZXI6IFBhcnNlcjxQdXp6bGVHcmFtbWFyPiA9IGNvbXBpbGUoZ3JhbW1hciwgUHV6emxlR3JhbW1hciwgUHV6emxlR3JhbW1hci5Cb2FyZCk7XG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgaW50byBhbiBwdXp6bGUuXG4gKiBcbiAqIEBwYXJhbSBwdXp6bGVTdHJpbmcgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgc3RhciBiYXR0bGUgcHV6emxlXG4gKiBAcmV0dXJucyBwdXp6bGUgb2JqZWN0IHRoYXQgdGhlIHB1enpsZVN0cmluZyByZXByZXNlbnRzXG4gKiBAdGhyb3dzIFBhcnNlRXJyb3IgaWYgdGhlIHN0cmluZyBkb2Vzbid0IG1hdGNoIHRoZSBwdXp6bGUgZ3JhbW1hciBvciBpZiB0aGUgaW5wdXR0ZWQgcHV6emxlIGhhcyAhPSAxMDAgbG9jYXRpb25zLCAhPSAxMCByZWdpb25zLCBvciBpcyBub3QgMTB4MTBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUHV6emxlKHB1enpsZVN0cmluZzogc3RyaW5nKTogUHV6emxlIHtcbiAgICBjb25zdCBwYXJzZVRyZWU6IFBhcnNlVHJlZTxQdXp6bGVHcmFtbWFyPiA9IHBhcnNlci5wYXJzZShwdXp6bGVTdHJpbmcpOyAvLyBjcmVhdGUgcGFyc2UgdHJlZVxuXG4gICAgLy8gZGlzcGxheSB0aGUgcGFyc2UgdHJlZSBpbiB2YXJpb3VzIHdheXMsIGZvciBkZWJ1Z2dpbmcgb25seSBpZiB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgZ3JhbW1hciBpbiB0aGUgZnV0dXJlXG4gICAgLy8gY29uc29sZS5sb2coXCJwYXJzZSB0cmVlOlxcblwiICsgcGFyc2VUcmVlKTtcbiAgICAvLyBjb25zb2xlLmxvZyh2aXN1YWxpemVBc1VybChwYXJzZVRyZWUsIFB1enpsZUdyYW1tYXIpKTtcblxuICAgIGNvbnN0IHB1enpsZTogUHV6emxlID0gbWFrZVB1enpsZShwYXJzZVRyZWUpOyAvLyBjb252ZXJ0IHBhcnNlIHRyZWUgdG8gYSBQdXp6bGUgb2JqZWN0XG4gICAgcmV0dXJuIHB1enpsZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcGFyc2UgdHJlZSBpbnRvIGFuIFB1enpsZTpcbiAqIFxuICogQHBhcmFtIHBhcnNlVHJlZSBQYXJzZVRyZWUgY29udGFpbmluZyBzdGFycyBhbmQgc3BvdHMgaW4gdGhlaXIgcmVzcGVjdGl2ZSByZWdpb25zIGFjY29yZGluZyB0byB0aGUgZ3JhbW1hciBmb3Igc3RhciBiYXR0bGUgcHV6emxlc1xuICogQHJldHVybnMgUHV6emxlIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJzZVRyZWVcbiAqIEB0aHJvd3MgUGFyc2VFcnJvciBpZiB0aGUgc3RyaW5nIGRvZXNuJ3QgbWF0Y2ggdGhlIHB1enpsZSBncmFtbWFyIG9yIGlmIHRoZSBpbnB1dHRlZCBwdXp6bGUgaGFzICE9IDEwMCBsb2NhdGlvbnMsICE9IDEwIHJlZ2lvbnMsIG9yIGlzIG5vdCAxMHgxMFxuICovXG5mdW5jdGlvbiBtYWtlUHV6emxlKHBhcnNlVHJlZTogUGFyc2VUcmVlPFB1enpsZUdyYW1tYXI+KTogUHV6emxlIHtcbiAgICBjb25zdCByb3dzOiBBcnJheTxQYXJzZVRyZWU8UHV6emxlR3JhbW1hcj4+ID0gcGFyc2VUcmVlLmNoaWxkcmVuQnlOYW1lKFB1enpsZUdyYW1tYXIuUm93KTtcblxuICAgIGNvbnN0IHJlZ2lvbk1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTsgLy8gaW5pdGlhbGl6ZSBzdHJ1Y3R1cmVzIGZvciBQdXp6bGUgY29uc3RydWN0b3IgXG4gICAgY29uc3Qgc3Rhck1hcDogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwKCk7XG4gICAgXG5cbiAgICBsZXQgcmVnaW9uID0gMTtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7IC8vIGEgcm93IGNvbnRhaW5zIHRoZSBzcG90cyBhbmQgc3RhcnMgb2YgYSByZWdpb25cbiAgICAgICAgY29uc3Qgc3RhcnM6IEFycmF5PFBhcnNlVHJlZTxQdXp6bGVHcmFtbWFyPj4gPSByb3cuY2hpbGRyZW5CeU5hbWUoUHV6emxlR3JhbW1hci5TdGFycyk7XG4gICAgICAgIGNvbnN0IHNwb3RzOiBBcnJheTxQYXJzZVRyZWU8UHV6emxlR3JhbW1hcj4+ID0gcm93LmNoaWxkcmVuQnlOYW1lKFB1enpsZUdyYW1tYXIuU3BvdHMpO1xuXG4gICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIHN0YXJzIGFuZCBhZGQgdGhlbSB0byB0aGUgc3RhciBhbmQgcmVnaW9uIG1hcHNcbiAgICAgICAgZm9yIChjb25zdCBzdGFyIG9mIHN0YXJzKSB7XG4gICAgICAgICAgICBjb25zdCBzcG90TG9jYXRpb246IEFycmF5PHN0cmluZz4gPSBzdGFyLnRleHQuc3BsaXQoJywnKS5tYXAoKG51bTpzdHJpbmcpID0+IG51bS50cmltKCkpOyAvLyBzcGxpdCBzdGFyIGludG8gW3JvdywgY29sdW1uXSBpbiBvcmRlciB0byB0cmltIHdoaXRlc3BhY2VcbiAgICAgICAgICAgIHN0YXJNYXAuc2V0KHNwb3RMb2NhdGlvblswXSArICcsJyArIHNwb3RMb2NhdGlvblsxXSwgdHJ1ZSk7XG4gICAgICAgICAgICByZWdpb25NYXAuc2V0KHNwb3RMb2NhdGlvblswXSArICcsJyArIHNwb3RMb2NhdGlvblsxXSwgcmVnaW9uKTsgICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIHRoZSBlbXB0eSBzcG90cyBhbmQgYWRkIHRoZW0gdG8gdGhlIHN0YXIgYW5kIHJlZ2lvbiBtYXBzXG4gICAgICAgIGZvciAoY29uc3Qgc3BvdCBvZiBzcG90cykge1xuICAgICAgICAgICAgY29uc3Qgc3BvdExvY2F0aW9uOiBBcnJheTxzdHJpbmc+ID0gc3BvdC50ZXh0LnNwbGl0KCcsJykubWFwKChudW06c3RyaW5nKSA9PiBudW0udHJpbSgpKTtcbiAgICAgICAgICAgIHN0YXJNYXAuc2V0KHNwb3RMb2NhdGlvblswXSArICcsJyArIHNwb3RMb2NhdGlvblsxXSwgZmFsc2UpO1xuICAgICAgICAgICAgcmVnaW9uTWFwLnNldChzcG90TG9jYXRpb25bMF0gKyAnLCcgKyBzcG90TG9jYXRpb25bMV0sIHJlZ2lvbik7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICByZWdpb24rKzsgLy8gbmV4dCByb3cgaW4gbG9vcCBpcyB0aGUgbmV4dCByZWdpb24sIHNvIGluY3JlbWVudFxuICAgIH1cblxuXG4gICAgcmV0dXJuIG5ldyBQdXp6bGUocmVnaW9uTWFwLCBzdGFyTWFwKTtcbn1cblxuLyoqXG4gKiBNYWluIGZ1bmN0aW9uLiBQYXJzZXMgYW5kIHRoZW4gcmVwcmludHMgYW4gZXhhbXBsZSBleHByZXNzaW9uLiBNYWlubHkgdXNlZCBmb3IgZGVidWdnaW5nIGluIHRoaXMgZmlsZS5cbiAqL1xuZnVuY3Rpb24gbWFpbigpOiB2b2lkIHtcbiAgICBjb25zdCBzb2x2ZWRJbnB1dCA9IGAjIFN0YXIgQmF0dGxlIFB1enpsZXMgYnkgS3JhenlEYWQsIFZvbHVtZSAxLCBCb29rIDEsIE51bWJlciAxXG4jIGZyb20gaHR0cHM6Ly9rcmF6eWRhZC5jb20vc3RhcmJhdHRsZS9cbiMgKGFsc28gc2hvd24gaW4gdGhlIHByb2plY3QgaGFuZG91dClcbjEweDEwXG4xLDIgIDEsNSAgfCAxLDEgMSwzIDEsNCAxLDYgMSw3IDEsOCAyLDEgMiwyIDIsMyAyLDQgMiw1IDIsNiAyLDggMyw1XG4yLDkgIDQsMTAgfCAxLDkgMSwxMCAyLDEwIDMsOSAzLDEwIDQsOSA1LDkgNSwxMCA2LDkgNiwxMCA3LDEwIDgsMTBcbjMsMiAgMyw0ICB8IDMsM1xuMiw3ICA0LDggIHwgMyw2IDMsNyAzLDhcbjYsMSAgOSwxICB8IDMsMSA0LDEgNCwyIDQsMyA0LDQgNSwxIDUsMiA1LDMgNiwyIDcsMSA3LDIgOCwxIDgsMiA4LDMgOCw0IDgsNSA4LDZcbjUsNCAgNSw2ICB8IDQsNSA1LDUgNiw0IDYsNSA2LDZcbjYsOCAgOCw3ICB8IDQsNiA0LDcgNSw3IDUsOCA2LDcgNyw2IDcsNyA3LDggOCw4XG43LDMgIDcsNSAgfCA2LDMgNyw0XG44LDkgMTAsMTAgfCA3LDkgOSw5IDksMTBcbjksMyAgMTAsNiB8IDksMiA5LDQgOSw1IDksNiA5LDcgOSw4IDEwLDEgMTAsMiAxMCwzIDEwLDQgMTAsNSAxMCw3IDEwLDggMTAsOVxuYDtcbmNvbnN0IGJsYW5rSW5wdXQgPSBgMTB4MTBcbnwgMSwxIDEsMiAxLDMgMSw0IDEsNSAxLDYgMSw3IDEsOCAyLDEgMiwyIDIsMyAyLDQgMiw1IDIsNiAyLDggMyw1XG58IDEsOSAxLDEwIDIsOSAyLDEwIDMsOSAzLDEwIDQsOSA0LDEwIDUsOSA1LDEwIDYsOSA2LDEwIDcsMTAgOCwxMFxufCAzLDIgMywzIDMsNFxufCAyLDcgMyw2IDMsNyAzLDggNCw4XG58IDMsMSA0LDEgNCwyIDQsMyA0LDQgNSwxIDUsMiA1LDMgNiwxIDYsMiA3LDEgNywyIDgsMSA4LDIgOCwzIDgsNCA4LDUgOCw2IDksMVxufCA0LDUgNSw0IDUsNSA1LDYgNiw0IDYsNSA2LDZcbnwgNCw2IDQsNyA1LDcgNSw4IDYsNyA2LDggNyw2IDcsNyA3LDggOCw3IDgsOFxufCA2LDMgNywzIDcsNCA3LDVcbnwgNyw5IDgsOSA5LDkgOSwxMCAxMCwxMFxufCA5LDIgOSwzIDksNCA5LDUgOSw2IDksNyA5LDggMTAsMSAxMCwyIDEwLDMgMTAsNCAxMCw1IDEwLDYgMTAsNyAxMCw4IDEwLDlgO1xuXG4gICAgY29uc29sZS5sb2cocGFyc2VQdXp6bGUoc29sdmVkSW5wdXQpKTtcbiAgICAvLyBjb25zb2xlLmxvZyhwYXJzZVB1enpsZShibGFua0lucHV0KSk7XG59XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICAgIG1haW4oKTtcbn0iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMjEtMjMgTUlUIDYuMTAyLzYuMDMxIGNvdXJzZSBzdGFmZiwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJlZGlzdHJpYnV0aW9uIG9mIG9yaWdpbmFsIG9yIGRlcml2ZWQgd29yayByZXF1aXJlcyBwZXJtaXNzaW9uIG9mIGNvdXJzZSBzdGFmZi5cbiAqL1xuXG4vLyBUaGlzIGNvZGUgaXMgbG9hZGVkIGludG8gc3RhcmItY2xpZW50Lmh0bWwsIHNlZSB0aGUgYG5wbSBjb21waWxlYCBhbmRcbi8vICAgYG5wbSB3YXRjaGlmeS1jbGllbnRgIHNjcmlwdHMuXG4vLyBSZW1lbWJlciB0aGF0IHlvdSB3aWxsICpub3QqIGJlIGFibGUgdG8gdXNlIE5vZGUgQVBJcyBsaWtlIGBmc2AgaW4gdGhlIHdlYiBicm93c2VyLlxuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnbm9kZS1mZXRjaCc7XG5pbXBvcnQgeyBwYXJzZVB1enpsZSB9IGZyb20gJy4vUHV6emxlUGFyc2VyJztcbmltcG9ydCB7IFB1enpsZSB9IGZyb20gJy4vUHV6emxlQURUJztcbmltcG9ydCB7IENhbnZhcywgSW1hZ2UsIGNyZWF0ZUNhbnZhcywgbG9hZEltYWdlIH0gZnJvbSAnY2FudmFzJztcblxuY29uc3QgUFVaWkxFX1NJWkUgPSAxMDtcbmNvbnN0IEJPWF9TSVpFID0gNDI7XG5cbi8vIGNhdGVnb3JpY2FsIGNvbG9ycyBmcm9tXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZDMvZDMtc2NhbGUtY2hyb21hdGljL3RyZWUvdjIuMC4wI3NjaGVtZUNhdGVnb3J5MTBcbmNvbnN0IENPTE9SUzogQXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnIzFmNzdiNCcsXG4gICAgJyNmZjdmMGUnLFxuICAgICcjMmNhMDJjJyxcbiAgICAnI2Q2MjcyOCcsXG4gICAgJyM5NDY3YmQnLFxuICAgICcjOGM1NjRiJyxcbiAgICAnI2UzNzdjMicsXG4gICAgJyM3ZjdmN2YnLFxuICAgICcjYmNiZDIyJyxcbiAgICAnIzE3YmVjZicsXG5dO1xuXG4vLyBzZW1pdHJhbnNwYXJlbnQgdmVyc2lvbnMgb2YgdGhvc2UgY29sb3JzXG5jb25zdCBCQUNLR1JPVU5EUyA9IENPTE9SUy5tYXAoKGNvbG9yKSA9PiBjb2xvciArICc2MCcpO1xuXG4vKipcbiAqIFB1enpsZSB0byByZXF1ZXN0IGFuZCBwbGF5LlxuICogUHJvamVjdCBpbnN0cnVjdGlvbnM6IHRoaXMgY29uc3RhbnQgaXMgYSBbZm9yIG5vd10gcmVxdWlyZW1lbnQgaW4gdGhlIHByb2plY3Qgc3BlYy5cbiAqL1xuY29uc3QgUFVaWkxFID0gXCJrZC02LTMxLTZcIjtcblxuLyoqXG4gKiBNdXRhYmxlIENsaWVudCBBRFQsIGFzIGRlc2NyaWJlZCBpbiB0aGUgU3RhciBCYXR0bGUgcHJvamVjdCBoYW5kb3V0LiBcbiAqL1xuZXhwb3J0IGNsYXNzIENsaWVudCB7XG5cbiAgICAvLyBBRihwdXp6bGUpID0gYSBjbGllbnQgaW50ZXJhY3Rpbmcgd2l0aCBhIFN0YXIgQm9hcmQgUHV6emxlIHJlcHJlc2VudGVkIGJ5ICdwdXp6bGUnXG4gICAgLy8gUkkgPSB0cnVlXG4gICAgLy8gU2FmZXR5IGZyb20gUmVwIEV4cG9zdXJlOiBcbiAgICAvLyAgIHB1enpsZSBpcyBwcml2YXRlIGFuZCB0aGUgb2JqZWN0cyBzdG9yZWQgYXQgcHV6emxlIGFyZSBpbW11dGFibGUsIGFsbCByZXR1cm4gdHlwZXMgb2Ygb3BlcmF0aW9ucyBcbiAgICAvLyAgIGFyZSBpbW11dGFibGUgb3Igdm9pZFxuXG4gICAgcHJpdmF0ZSBwdXp6bGU6IFB1enpsZSB8IHVuZGVmaW5lZDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wdXp6bGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1JlcCgpOiB2b2lkIHtcbiAgICAgICAgYXNzZXJ0KHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIGEgZW1wdHkgcHV6emxlIGZyb20gdGhlIHNlcnZlciBhbmQgc2V0cyB0aGUgcHV6emxlIGluc3RhbmNlIHZhcmlhYmxlIHRvIHRoZSBwdXp6bGUgcmVjZWl2ZWRcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZmlsZSBwdXp6bGUgZmlsZSB0byBsb2FkIGEgcHV6emxlIGZyb21cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgcmVxdWVzdFB1enpsZShmaWxlOnN0cmluZyA9IFBVWlpMRSkgOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3Qgc2VydmVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4Nzg5L3B1enpsZT9wdXp6bGVOYW1lPSR7ZmlsZX1gKTsgLy8gc2VuZCByZXF1ZXN0IHRvIHNlcnZlclxuICAgICAgICBjb25zdCBwdXp6bGVTdHJpbmcgPSBhd2FpdCBzZXJ2ZXJSZXNwb25zZS50ZXh0KCk7IC8vIGVtcHR5IHB1enpsZVN0cmluZyBoYXMgYmVlbiBzZW50XG4gICAgICAgIHRoaXMucHV6emxlID0gcGFyc2VQdXp6bGUocHV6emxlU3RyaW5nKTsgLy8gcGFyc2Ugc3RyaW5nIGludG8gUHV6emxlIGFuZCBzZXQgdG8gaW5zdGFuY2UgdmFyaWFibGVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBwdXp6bGUgYXR0cmlidXRlIG9mIHRoZSBjbGllbnQgdG8gYSBuZXcgcHV6emxlIHdpdGggc3RhciB0b2dnbGVkXG4gICAgICogXG4gICAgICogQHBhcmFtIHJvdyB0aGUgcm93IGNvb3JkaW5hdGUgYXQgd2hpY2ggdG8gYWRkL3JlbW92ZSB0aGUgbmV3IHN0YXIuIE11c3QgYmUgMS0xMC5cbiAgICAgKiBAcGFyYW0gY29sdW1uIHRoZSBjb2x1bW4gY29vcmRpbmF0ZSBhdCB3aGljaCB0byBhZGQvcmVtb3ZlIHRoZSBuZXcgc3Rhci4gTXVzdCBiZSAxLTEwLlxuICAgICAqL1xuICAgIHByaXZhdGUgdG9nZ2xlU3Rhcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgYXNzZXJ0KHRoaXMucHV6emxlLCBcIm5vIHB1enpsZSBoYXMgYmVlbiBsb2FkZWQgeWV0XCIpO1xuICAgICAgICB0aGlzLnB1enpsZSA9IHRoaXMucHV6emxlLnRvZ2dsZVN0YXIocm93LCBjb2x1bW4pO1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSByZWdpb24gb2YgdGhlIGN1cnJlbnQgY29vcmRpbmF0ZVxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgdGhlIHJvdyBjb29yZGluYXRlLiBNdXN0IGJlIDEtMTAuXG4gICAgICogQHBhcmFtIGNvbHVtbiB0aGUgY29sdW1uIGNvb3JkaW5hdGUuIE11c3QgYmUgMS0xMC5cbiAgICAgKiBAcmV0dXJucyB0aGUgcmVnaW9uIG9mIHRoZSBjb29yZGluYXRlLlxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0UmVnaW9uKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgYXNzZXJ0KHRoaXMucHV6emxlLCBcIm5vIHB1enpsZSBoYXMgYmVlbiBsb2FkZWQgeWV0XCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5wdXp6bGUuZ2V0UmVnaW9uKHJvdywgY29sdW1uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmljIHJvdyBhbmQgY29sIG9mIHRoZSBwdXp6bGUgaGFzIGEgc3RhclxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgdGhlIHJvdyBjb29yZGluYXRlIHRvIGNoZWNrLiBNdXN0IGJlIDEtMTAuXG4gICAgICogQHBhcmFtIGNvbHVtbiB0aGUgY29sdW1uIGNvb3JkaW5hdGUgdG8gY2hlY2suIE11c3QgYmUgMS0xMC5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmZiB0aGVyZSBpcyBhIHN0YXIgcHJlc2VudCBhdCB0aGUgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHByaXZhdGUgaGFzU3Rhcihyb3c6bnVtYmVyLCBjb2x1bW46IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgICAgIGFzc2VydCh0aGlzLnB1enpsZSwgXCJubyBwdXp6bGUgaGFzIGJlZW4gbG9hZGVkIHlldFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHV6emxlLmhhc1N0YXIocm93LCBjb2x1bW4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2YWx1YXRlcyBpZiB0aGUgY3VycmVudCBwdXp6bGUgaW4gdGhlIGNsaWVudCBpcyBzb2x2ZWQgb3Igbm90XG4gICAgICogXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY3VycmVudCBzdGFyIGJhdHRsZSBwdXp6bGUgdXNlZCBieSB0aGUgY2xpZW50IGlzIHNvbHZlZCBhcyBkZWZpbmVkIGluIHRoZSBydWxlcyBvZiBcbiAgICAgKiAgICAgICAgICBzdGFyIGJhdHRsZSBpbiB0aGUgcHJvamVjdCBoYW5kb3V0LCBvdGhlcndpc2UgZmFsc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNQdXp6bGVTb2x2ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgYXNzZXJ0KHRoaXMucHV6emxlLCBcIm5vIHB1enpsZSBoYXMgYmVlbiBsb2FkZWQgeWV0XCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5wdXp6bGUuaXNTb2x2ZWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3cyB0aGUgcHV6emxlIG9udG8gdGhlIGNhbnZhc1xuICAgICAqIFxuICAgICAqIEBwYXJhbSBjYW52YXMgdGhlIGNhbnZhcyBvbiB3aGljaCB0byBkcmF3IHRoZSBwdXp6bGVcbiAgICAgKiBAcGFyYW0gY2xlYXJGaXJzdCB3aGV0aGVyIHRoZSBjYW52YXMgc2hvdWxkIGZpcnN0IGJlIGNsZWFyZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZHJhd1B1enpsZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBjbGVhckZpcnN0PWZhbHNlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgYXNzZXJ0KGNvbnRleHQsICd1bmFibGUgdG8gZ2V0IGNhbnZhcyBkcmF3aW5nIGNvbnRleHQnKTtcblxuICAgICAgICBpZiAoY2xlYXJGaXJzdCkge1xuICAgICAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpOyAvLyBzYXZlIG9yaWdpbmFsIGNvbnRleHQgc2V0dGluZ3MgYmVmb3JlIHdlIHRyYW5zbGF0ZSBhbmQgY2hhbmdlIGNvbG9yc1xuXG4gICAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IFBVWlpMRV9TSVpFOyBjb2x1bW4rKykge1xuICAgICAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgUFVaWkxFX1NJWkU7IHJvdysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gdGhpcy5nZXRSZWdpb24ocm93ICsgMSwgY29sdW1uICsgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IHRoZSBvdXRlciBvdXRsaW5lIGJveCBjZW50ZXJlZCBvbiB0aGUgb3JpZ2luICh3aGljaCBpcyBub3cgKHgseSkpXG4gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IEJBQ0tHUk9VTkRTW3JlZ2lvbiAtIDFdID8/IGFzc2VydC5mYWlsKCdmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDQ7XG4gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2VSZWN0KEJPWF9TSVpFKmNvbHVtbiwgQk9YX1NJWkUqcm93LCBCT1hfU0laRSwgQk9YX1NJWkUpO1xuXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBCQUNLR1JPVU5EU1tyZWdpb24gLSAxXSA/PyBhc3NlcnQuZmFpbCgnZmFpbGVkJyk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdChCT1hfU0laRSpjb2x1bW4sIEJPWF9TSVpFKnJvdywgQk9YX1NJWkUsIEJPWF9TSVpFKTtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQucmVzdG9yZSgpOyAvLyByZXNldCB0aGUgb3JpZ2luIGFuZCBzdHlsZXMgYmFjayB0byBkZWZhdWx0c1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbnVtU2lkZXMgPSA1OyAvLyBwYXJhbWV0ZXJzIGZvciB0aGUgc3RhcnMgdG8gYmUgZHJhd24gb24gdGhlIHB1enpsZVxuICAgICAgICBjb25zdCBvdXRlclJhZCA9IDEyO1xuICAgICAgICBjb25zdCBpbm5lclJhZCA9IDY7XG5cbiAgICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgUFVaWkxFX1NJWkU7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBQVVpaTEVfU0laRTsgcm93KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFyOiBib29sZWFuID0gdGhpcy5oYXNTdGFyKHJvdyArIDEsIGNvbHVtbiArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1N0YXIoY29udGV4dCwgQk9YX1NJWkUqY29sdW1uICsgQk9YX1NJWkUvMiwgQk9YX1NJWkUqcm93ICsgQk9YX1NJWkUvMiwgbnVtU2lkZXMsIG91dGVyUmFkLCBpbm5lclJhZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3cyBhIHN0YXIgb24gdGhlIHB1enpsZVxuICAgICAqIFxuICAgICAqIEBwYXJhbSBjb250ZXh0IG9uIHdoaWNoIHRvIGRyYXcgdGhlIHN0YXJcbiAgICAgKiBAcGFyYW0gY3ggdGhlIGNlbnRlciB4IGNvb3JkXG4gICAgICogQHBhcmFtIGN5IHRoZSBjZW50ZXIgeSBjb29yZFxuICAgICAqIEBwYXJhbSBzcGlrZXMgdGhlIG51bWJlciBvZiBzcGlrZXMgb24gdGhlIHN0YXJcbiAgICAgKiBAcGFyYW0gb3V0ZXJSYWRpdXMgdGhlIG91dGVyIHJhZGl1cyBvZiB0aGUgc3RhclxuICAgICAqIEBwYXJhbSBpbm5lclJhZGl1cyB0aGUgaW5uZXIgcmFkaXVzIG9mIHRoZSBzdGFyXG4gICAgICogXG4gICAgICogZnVuY3Rpb24gY29kZSBtb2RpZmllZCBmcm9tIHRoaXMgc3RhY2sgb3ZlcmZsb3cgcG9zdDpcbiAgICAgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNTgzNzE1OC9ob3ctdG8tZHJhdy1hLXN0YXItYnktdXNpbmctY2FudmFzLWh0bWw1XG4gICAgICovXG4gICAgcHJpdmF0ZSBkcmF3U3Rhcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHNwaWtlczpudW1iZXIsIG91dGVyUmFkaXVzOiBudW1iZXIsIGlubmVyUmFkaXVzOm51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBUSFJFRSA9IDM7XG4gICAgICAgIGxldCByb3Q9TWF0aC5QSS8yKlRIUkVFO1xuICAgICAgICBsZXQgeD1jeDtcbiAgICAgICAgbGV0IHk9Y3k7XG4gICAgICAgIGNvbnN0IHN0ZXA9TWF0aC5QSS9zcGlrZXM7XG5cbiAgICAgICAgaWYgKGNvbnRleHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29udGV4dCBpcyBudWxsJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oY3gsY3ktb3V0ZXJSYWRpdXMpO1xuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxzcGlrZXM7aSsrKXtcbiAgICAgICAgICAgICAgICB4PWN4K01hdGguY29zKHJvdCkqb3V0ZXJSYWRpdXM7XG4gICAgICAgICAgICAgICAgeT1jeStNYXRoLnNpbihyb3QpKm91dGVyUmFkaXVzO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHgseSk7XG4gICAgICAgICAgICAgICAgcm90Kz1zdGVwO1xuXG4gICAgICAgICAgICAgICAgeD1jeCtNYXRoLmNvcyhyb3QpKmlubmVyUmFkaXVzO1xuICAgICAgICAgICAgICAgIHk9Y3krTWF0aC5zaW4ocm90KSppbm5lclJhZGl1cztcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyh4LHkpO1xuICAgICAgICAgICAgICAgIHJvdCs9c3RlcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGN4LGN5LW91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aD01O1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZT0nd2hpdGUnO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlPSdibGFjayc7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgfSAgXG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGEgY2xpY2sgYnkgdG9nZ2xpbmcgYSBzdGFyIGF0IHRoZSBjbGlja2VkIGFyZWEgb2YgdGhlIGNhbnZhc1xuICAgICAqIFxuICAgICAqIEBwYXJhbSBjYW52YXMgdGhlIGNhbnZhcyBvbiB3aGljaCB0byBkcmF3XG4gICAgICogQHBhcmFtIHggdGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgY2xpY2tcbiAgICAgKiBAcGFyYW0geSB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSBjbGlja1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVDbGljayhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmRpc2NyZXRpemVDbGljayh5KTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdGhpcy5kaXNjcmV0aXplQ2xpY2soeCk7XG4gICAgICAgIHRoaXMudG9nZ2xlU3Rhcihyb3csIGNvbHVtbik7XG4gICAgICAgIHRoaXMuZHJhd1B1enpsZShjYW52YXMsIHRydWUpO1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSBjb29yZGluYXRlIHRvIGEgZGlzY3JldGl6ZWQgYXJlYSBvbiBhbiBheGlzXG4gICAgICogXG4gICAgICogQHBhcmFtIGNvb3JkaW5hdGUgdG8gY29udmVydCB0byBhIGRpc2NyZXRlIGFyZWEgb24gdGhlIGNhbnZhc1xuICAgICAqIEByZXR1cm5zIGRpc2NyZXRlIGFyZWEgYXQgd2hpY2ggdGhlIGNvb3JkaW5hdGUgY29ycmVzcG9uZHNcbiAgICAgKi9cbiAgICBwcml2YXRlIGRpc2NyZXRpemVDbGljayhjb29yZGluYXRlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgICAgIGlmIChjb29yZGluYXRlID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChjb29yZGluYXRlL0JPWF9TSVpFKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFByaW50IGEgbWVzc2FnZSBieSBhcHBlbmRpbmcgaXQgdG8gYW4gSFRNTCBlbGVtZW50LlxuICogXG4gKiBAcGFyYW0gb3V0cHV0QXJlYSBIVE1MIGVsZW1lbnQgdGhhdCBzaG91bGQgZGlzcGxheSB0aGUgbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgbWVzc2FnZSB0byBkaXNwbGF5XG4gKi9cbmZ1bmN0aW9uIHByaW50T3V0cHV0KG91dHB1dEFyZWE6IEhUTUxFbGVtZW50LCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBvdXRwdXRBcmVhLmlubmVyVGV4dCArPSBtZXNzYWdlICsgJ1xcbic7ICAvLyBhcHBlbmQgdGhlIG1lc3NhZ2UgdG8gdGhlIG91dHB1dCBhcmVhXG4gICAgb3V0cHV0QXJlYS5zY3JvbGxUb3AgPSBvdXRwdXRBcmVhLnNjcm9sbEhlaWdodDsgIC8vIHNjcm9sbCB0aGUgb3V0cHV0IGFyZWEgc28gdGhhdCB3aGF0IHdlIGp1c3QgcHJpbnRlZCBpcyB2aXNpYmxlXG59XG5cbi8qKlxuICogUnVucyB0aGUgd2VicGFnZSB3aGVyZSBTdGFyIEJhdHRsZSBpcyBwbGF5ZXJcbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjbGllbnQ6IENsaWVudCA9IG5ldyBDbGllbnQoKTtcbiAgICBhd2FpdCBjbGllbnQucmVxdWVzdFB1enpsZSgpO1xuXG4gICAgLy8gb3V0cHV0IGFyZWEgZm9yIHByaW50aW5nXG4gICAgY29uc3Qgb3V0cHV0QXJlYTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0QXJlYScpID8/IGFzc2VydC5mYWlsKCdtaXNzaW5nIG91dHB1dCBhcmVhJyk7XG4gICAgLy8gY2FudmFzIGZvciBkcmF3aW5nXG4gICAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudCA/PyBhc3NlcnQuZmFpbCgnbWlzc2luZyBkcmF3aW5nIGNhbnZhcycpO1xuICAgIGNsaWVudC5kcmF3UHV6emxlKGNhbnZhcyk7XG5cbiAgICAvLyB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgZHJhd2luZyBjYW52YXMuLi5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY2xpZW50LmhhbmRsZUNsaWNrKGNhbnZhcywgZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XG5cbiAgICAgICAgaWYgKGNsaWVudC5pc1B1enpsZVNvbHZlZCgpKSB7XG4gICAgICAgICAgICBwcmludE91dHB1dChvdXRwdXRBcmVhLCBgWW91IGhhdmUgc29sdmVkIHRoZSBwdXp6bGUhYCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGFkZCBpbml0aWFsIGluc3RydWN0aW9ucyB0byB0aGUgb3V0cHV0IGFyZWFcbiAgICBwcmludE91dHB1dChvdXRwdXRBcmVhLCBgQ2xpY2sgdGhlIGJvYXJkIHRvIGJlZ2luIHBsYXlpbmchYCk7XG59XG5cbm1haW4oKS5jYXRjaChlcnJvciA9PiB7dGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgcnVuIG1haW4gY29ycmVjdGx5Jyk7fSk7Il19
