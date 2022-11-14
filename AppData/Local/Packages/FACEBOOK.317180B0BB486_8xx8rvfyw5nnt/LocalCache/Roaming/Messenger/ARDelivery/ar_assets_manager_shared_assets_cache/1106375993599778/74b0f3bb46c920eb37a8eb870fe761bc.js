this["exportedVariables"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
// In this script we show how to fade out particles from
// a emitter. 
//
// Original post was created by Josh Beckwith
// URL: https://www.facebook.com/groups/SparkARcommunity/permalink/683989935346385/
//
//
// Include modules
//
var Scene = require('Scene')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var Animation = require('Animation')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/; // Load 'emitters' objects.


_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var _yield$Promise$all, _yield$Promise$all2, emitterA, emitterB, emitterC;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return Promise.all([Scene.root.findFirst('Particles_Fog_A'), Scene.root.findFirst('Particles_Fog_B'), Scene.root.findFirst('Particles_Fog_C')]);

        case 2:
          _yield$Promise$all = _context.sent;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
          emitterA = _yield$Promise$all2[0];
          emitterB = _yield$Promise$all2[1];
          emitterC = _yield$Promise$all2[2];
          faceParticles(emitterA);
          faceParticles(emitterB);
          faceParticles(emitterC);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

function faceParticles(emitter) {
  // emitter0 loaded and ready to be used.
  // Animate per channel in a HSVA color model.
  // We specify a easing functions for the 
  // rate of change of a channel over time.
  // More info per under channel.
  //
  // Read more about HSV color model here:
  // https://en.wikipedia.org/wiki/HSL_and_HSV
  //
  // Read more about easing functions here:
  // https://easings.net/en
  emitter.hsvaColorModulationModifier = Animation.samplers.HSVA([// H for hue.
  // Here we tell the Hue channel should have a constant
  // value of 1 during the lifespan of a particle.
  // So the Hue vil always stay 1 from start to finish.
  Animation.samplers.constant(1), // S for saturation.
  // Here we use contsant again.
  Animation.samplers.constant(1), // V for value.
  // And the same here.
  Animation.samplers.constant(1), // A for alpha.
  // Here we use a easeInQuad easing function to gradually 
  // change the Alpha channel value for the particle over time.
  // The value will transition from 1 (100% visible) to 0 
  // (0% visible) with a non-linear speed.
  // 
  // Read more about easeInQuad here:
  // https://easings.net/en#easeInQuad
  Animation.samplers.easeInSine(1, 0)]); // The same rules can be applied to other particle properties
  // such as size. Here we are trying out the easeInCirc easing
  // function. All available easing functions in Spark AR
  // can be found here: 
  // https://sparkar.facebook.com/ar-studio/learn/documentation/reference/classes/animationmodule.samplerfactory/

  emitter.sizeModifier = Animation.samplers.easeInCirc(0, 0.01); // Other particle properties that can be modified include 
  // positionModifier and velocityModifier.
  // More information is specified here:
  // https://sparkar.facebook.com/ar-studio/learn/documentation/reference/classes/scenemodule.particlesystem
}

;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//modules   //
var Scene = require('Scene')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var FaceTracking = require('FaceTracking')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var Reactive = require('Reactive')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var Animation = require('Animation')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var Patches = require('Patches')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var D = require('Diagnostics')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var Time = require('Time')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;

var Materials = require('Materials')/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/;
/*
function D2R(angle) {
    return angle * (Math.PI / 180);
};


Patches.inputs.setBoolean('reset', true);
Patches.outputs.getBoolean('canReset').then(e => {
    e.monitor().subscribe(function(values) 
    {
        if (values.newValue == true)
            Patches.inputs.setBoolean('reset', true);
        else
            Patches.inputs.setBoolean('reset', false);
    });
});
*/
// tracked face actions //


var face = FaceTracking.face(0);
var smoothDelay = 120;
var smoothDelay_Blink = 40;
var cmToMeters = 100.0; //const chin_Tip =            face.chin.tip.expSmooth(smoothDelay).mul(cmToMeters);

var nose_Bridge = face.nose.bridge.expSmooth(smoothDelay).mul(cmToMeters);
var forehead_Center = face.forehead.center.expSmooth(smoothDelay).mul(cmToMeters); //const forehead_Top =        face.forehead.top.expSmooth(smoothDelay).mul(cmToMeters);

var L_eye_Center = face.leftEye.center.expSmooth(smoothDelay).mul(cmToMeters);
var R_eye_Center = face.rightEye.center.expSmooth(smoothDelay).mul(cmToMeters);
var l_eye_open = face.leftEye.openness.expSmooth(smoothDelay_Blink);
var r_eye_open = face.rightEye.openness.expSmooth(smoothDelay_Blink);
var L_eyebrow_Top = face.leftEyebrow.top.expSmooth(smoothDelay).mul(cmToMeters);
var R_eyebrow_Top = face.rightEyebrow.top.expSmooth(smoothDelay).mul(cmToMeters); // const L_eyebrow_Inside =    face.leftEyebrow.insideEnd.expSmooth(smoothDelay).mul(cmToMeters);
// const R_eyebrow_Inside =    face.rightEyebrow.insideEnd.expSmooth(smoothDelay).mul(cmToMeters);
// const L_eyebrow_Outside =   face.leftEyebrow.outsideEnd.expSmooth(smoothDelay).mul(cmToMeters);
// const R_eyebrow_Outside =   face.rightEyebrow.outsideEnd.expSmooth(smoothDelay).mul(cmToMeters);

var mouth_Openness = face.mouth.openness.expSmooth(smoothDelay); //const mouth_LowerCurve =    face.mouth.lowerLipCurvature.expSmooth(smoothDelay); 
//const mouth_UpperCurve =    face.mouth.upperLipCurvature.expSmooth(smoothDelay);
//const mouth_Center =        face.mouth.center.expSmooth(smoothDelay).mul(cmToMeters);

var mouth_Left = face.mouth.leftCorner.expSmooth(smoothDelay).mul(cmToMeters);
var mouth_Right = face.mouth.rightCorner.expSmooth(smoothDelay).mul(cmToMeters);
var mouth_Lowerlip = face.mouth.lowerLipCenter.expSmooth(smoothDelay).mul(cmToMeters);
var mouth_Upperlip = face.mouth.upperLipCenter.expSmooth(smoothDelay).mul(cmToMeters); // derivations

var L_eyebrow_Y = Reactive.distance(L_eyebrow_Top, L_eye_Center);
var R_eyebrow_Y = Reactive.distance(R_eyebrow_Top, R_eye_Center);
var l_eye_closed_Signal = Reactive.sub(1.0, l_eye_open);
var r_eye_closed_Signal = Reactive.sub(1.0, r_eye_open);
var forehead_Midpoint = Reactive.sub(forehead_Center.y, nose_Bridge.y);
var mouth_Horizontal = Reactive.add(mouth_Left.x, mouth_Right.x); // if negative, mouth goes left, if positive right, difference expected of > 1 to full tilt.

var mouthWidth = Reactive.distance(mouth_Left, mouth_Right);
var mouth_Upper_Y = Reactive.add(Reactive.sub(mouth_Left.y, mouth_Upperlip.y), Reactive.sub(mouth_Right.y, mouth_Upperlip.y));
var mouth_Lower_Y = Reactive.add(Reactive.sub(mouth_Left.y, mouth_Lowerlip.y), Reactive.sub(mouth_Right.y, mouth_Lowerlip.y));
var mouthHeight = Reactive.add(mouth_Upper_Y, mouth_Lower_Y);

function makeValueBlend(signal, signalMin, signalMax, blendMin, blendMax) {
  var driver = Animation.valueDriver(signal, signalMin, signalMax);
  var sampler = Animation.samplers.easeOutSine(blendMin, blendMax);
  return Animation.animate(driver, sampler);
}

var L_eyebrow_Up_BS = makeValueBlend(L_eyebrow_Y, 2.5, 3.5, 0, 1);
var R_eyebrow_Up_BS = makeValueBlend(R_eyebrow_Y, 2.5, 3.5, 0, 1);
var L_eyebrow_Angry_BS = makeValueBlend(L_eyebrow_Y, 1.7, 2.6, 1, 0);
var R_eyebrow_Angry_BS = makeValueBlend(R_eyebrow_Y, 1.7, 2.6, 1, 0);
var sadEyes = makeValueBlend(forehead_Midpoint, 5.5, 7, 0, 1);
var l_eye_extraOpen = makeValueBlend(l_eye_open, .75, 1.4, 0, 1);
var l_eye_closed = makeValueBlend(l_eye_closed_Signal, .25, .85, 0, 1);
var r_eye_extraOpen = makeValueBlend(r_eye_open, .75, 1.4, 0, 1);
var r_eye_closed = makeValueBlend(r_eye_closed_Signal, .25, .85, 0, 1);
var openMouth_BS = makeValueBlend(mouth_Openness, 0, 0.75, 0, 1);
var mouthOpening = makeValueBlend(mouth_Openness, 0.05, 0.3, 0, 1);
var mouthClosing = makeValueBlend(mouth_Openness, 0, 0.25, 1, 0);
var mouthPinch = makeValueBlend(mouthWidth, 4.3, 5, 1, 0);
var mouthPush = makeValueBlend(mouthWidth, 5, 6, 1, 0);
var mouthWiden = makeValueBlend(mouthWidth, 4.3, 6, 0, 1);
var mouth_left = makeValueBlend(mouth_Horizontal, -3, -0.3, 1, 0);
var mouth_right = makeValueBlend(mouth_Horizontal, 0.3, 3., 0, 1);
var sadMouth_BS = makeValueBlend(mouthHeight, -1, 0.5, 1, 0);
var happyMouth_BS = makeValueBlend(mouthHeight, .5, 3.5, 0, 1); // extra derivations

var sadEyes_BS = Reactive.clamp(Reactive.mul(sadMouth_BS, sadEyes).mul(2.), 0, 1);
var openMouthEXTRA_BS = Reactive.smoothStep(openMouth_BS, 0.65, 0.66).mul(0.5);
var l_eye_closed_BS = Reactive.clamp(Reactive.sub(l_eye_closed, openMouthEXTRA_BS), 0, 1);
var r_eye_closed_BS = Reactive.clamp(Reactive.sub(r_eye_closed, openMouthEXTRA_BS), 0, 1);
var l_eye_mad = Reactive.clamp(Reactive.mul(sadMouth_BS, L_eyebrow_Angry_BS).mul(2.), 0, 1);
var r_eye_mad = Reactive.clamp(Reactive.mul(sadMouth_BS, R_eyebrow_Angry_BS).mul(2.), 0, 1);
var oh_BS = Reactive.mul(mouthPush, mouthOpening);
var pucker_BS = Reactive.mul(mouthPinch, mouthClosing);
var heart = Reactive.smoothStep(pucker_BS, 0.6, 0.61); //const flame =           Reactive.smoothStep(openMouth_BS, 0.65, 0.66);

var pucker_OH_mod = Reactive.max(oh_BS, pucker_BS).div(2.);
var nose_height_BS = Reactive.clamp(Reactive.sub(Reactive.max(sadMouth_BS, openMouth_BS), pucker_OH_mod), 0, 1);
var nose_width_BS = mouthWiden;
/*
D.watch("openMouth_BS" , openMouth_BS);
D.watch("l_eye_closed_BS" ,l_eye_closed_BS);
D.watch("L_eyebrow_Angry_BS" ,L_eyebrow_Angry_BS);

*/
// Patches output

Patches.inputs.setScalar('mouth_Pucker', pucker_BS);
Patches.inputs.setScalar('mouth_Oh', oh_BS);
Patches.inputs.setScalar('mouth_Sad', sadMouth_BS);
Patches.inputs.setScalar('mouth_Smile', happyMouth_BS);
Patches.inputs.setScalar('mouth_Open', openMouth_BS);
Patches.inputs.setScalar('mouthHorizontal', mouth_Horizontal); // Enables async/await in JS [part 1]

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var _yield$Promise$all, _yield$Promise$all2, animation, _yield$Promise$all3, _yield$Promise$all4, eye_R_occluder, eye_L_occluder, eyeFX_R_occluder, eyeFX_L_occluder, eyeMASK_R_occluder, eyeMASK_L_occluder, eye_R_socket, eye_L_socket, eyeFX_R_socket, eyeFX_L_socket, eyeMASK_R_socket, eyeMASK_L_socket, eye_R_pupil, eye_L_pupil, mouth_occluder, mouth, pumpkin, nose_occluder, nose, _yield$Promise$all5, _yield$Promise$all6, eye_R_occluderBS, eye_L_occluderBS, eyeFX_R_occluderBS, eyeFX_L_occluderBS, eyeMASK_R_occluderBS, eyeMASK_L_occluderBS, eye_R_socketBS, eye_L_socketBS, eyeFX_R_socketBS, eyeFX_L_socketBS, eyeMASK_R_socketBS, eyeMASK_L_socketBS, eye_R_pupilBS, eye_L_pupilBS, mouth_occluderBS, mouthBS, pumpkinBS, nose_occluderBS, noseBS, close, smile, oh, sad, sadClose, open, sadOpen, sliderR, slideL, pucker, ohOpen, openExtra;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return Promise.all([Scene.root.findFirst('rig:anim')]);

        case 2:
          _yield$Promise$all = _context.sent;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 1);
          animation = _yield$Promise$all2[0];
          Patches.inputs.setPoint('animPosition', animation.transform.position);
          Patches.inputs.setPoint('animRotation', Reactive.point(animation.transform.rotationX, animation.transform.rotationY, animation.transform.rotationZ));
          Patches.inputs.setPoint('animScale', animation.transform.scale);
          _context.next = 10;
          return Promise.all([Scene.root.findFirst('OCCLUDER_EYE_R'), Scene.root.findFirst('OCCLUDER_EYE_L'), Scene.root.findFirst('OCCLUDER_EYE_FX_R'), Scene.root.findFirst('OCCLUDER_EYE_FX_L'), Scene.root.findFirst('OCCLUDER_EYE_mask_R'), Scene.root.findFirst('OCCLUDER_EYE_mask_L'), Scene.root.findFirst('EYE_SOCKET_R'), Scene.root.findFirst('EYE_SOCKET_L'), Scene.root.findFirst('EYE_SOCKET_FX_R'), Scene.root.findFirst('EYE_SOCKET_FX_L'), Scene.root.findFirst('EYE_SOCKET_mask_R'), Scene.root.findFirst('EYE_SOCKET_mask_L'), Scene.root.findFirst('PUPIL_R'), Scene.root.findFirst('PUPIL_L'), Scene.root.findFirst('OCCLUDER_MOUTH'), Scene.root.findFirst('MOUTH'), Scene.root.findFirst('rig:pumpkin'), Scene.root.findFirst('nose_socket_occluder'), Scene.root.findFirst('nose_socket')]);

        case 10:
          _yield$Promise$all3 = _context.sent;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 19);
          eye_R_occluder = _yield$Promise$all4[0];
          eye_L_occluder = _yield$Promise$all4[1];
          eyeFX_R_occluder = _yield$Promise$all4[2];
          eyeFX_L_occluder = _yield$Promise$all4[3];
          eyeMASK_R_occluder = _yield$Promise$all4[4];
          eyeMASK_L_occluder = _yield$Promise$all4[5];
          eye_R_socket = _yield$Promise$all4[6];
          eye_L_socket = _yield$Promise$all4[7];
          eyeFX_R_socket = _yield$Promise$all4[8];
          eyeFX_L_socket = _yield$Promise$all4[9];
          eyeMASK_R_socket = _yield$Promise$all4[10];
          eyeMASK_L_socket = _yield$Promise$all4[11];
          eye_R_pupil = _yield$Promise$all4[12];
          eye_L_pupil = _yield$Promise$all4[13];
          mouth_occluder = _yield$Promise$all4[14];
          mouth = _yield$Promise$all4[15];
          pumpkin = _yield$Promise$all4[16];
          nose_occluder = _yield$Promise$all4[17];
          nose = _yield$Promise$all4[18];
          _context.next = 33;
          return Promise.all([eye_R_occluder.getBlendShapes(), eye_L_occluder.getBlendShapes(), eyeFX_R_occluder.getBlendShapes(), eyeFX_L_occluder.getBlendShapes(), eyeMASK_R_occluder.getBlendShapes(), eyeMASK_L_occluder.getBlendShapes(), eye_R_socket.getBlendShapes(), eye_L_socket.getBlendShapes(), eyeFX_R_socket.getBlendShapes(), eyeFX_L_socket.getBlendShapes(), eyeMASK_R_socket.getBlendShapes(), eyeMASK_L_socket.getBlendShapes(), eye_R_pupil.getBlendShapes(), eye_L_pupil.getBlendShapes(), mouth_occluder.getBlendShapes(), mouth.getBlendShapes(), pumpkin.getBlendShapes(), nose_occluder.getBlendShapes(), nose.getBlendShapes()]);

        case 33:
          _yield$Promise$all5 = _context.sent;
          _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 19);
          eye_R_occluderBS = _yield$Promise$all6[0];
          eye_L_occluderBS = _yield$Promise$all6[1];
          eyeFX_R_occluderBS = _yield$Promise$all6[2];
          eyeFX_L_occluderBS = _yield$Promise$all6[3];
          eyeMASK_R_occluderBS = _yield$Promise$all6[4];
          eyeMASK_L_occluderBS = _yield$Promise$all6[5];
          eye_R_socketBS = _yield$Promise$all6[6];
          eye_L_socketBS = _yield$Promise$all6[7];
          eyeFX_R_socketBS = _yield$Promise$all6[8];
          eyeFX_L_socketBS = _yield$Promise$all6[9];
          eyeMASK_R_socketBS = _yield$Promise$all6[10];
          eyeMASK_L_socketBS = _yield$Promise$all6[11];
          eye_R_pupilBS = _yield$Promise$all6[12];
          eye_L_pupilBS = _yield$Promise$all6[13];
          mouth_occluderBS = _yield$Promise$all6[14];
          mouthBS = _yield$Promise$all6[15];
          pumpkinBS = _yield$Promise$all6[16];
          nose_occluderBS = _yield$Promise$all6[17];
          noseBS = _yield$Promise$all6[18];
          // EYE OCCLUDERS
          eye_R_occluderBS[0].weight = r_eye_closed_BS; //CLOSE

          eye_R_occluderBS[1].weight = happyMouth_BS; //HAPPY

          eye_R_occluderBS[2].weight = sadEyes_BS; //SAD

          eye_R_occluderBS[3].weight = r_eye_mad; //MAD

          eye_R_occluderBS[4].weight = r_eye_extraOpen; //OPEN

          eye_L_occluderBS[0].weight = l_eye_closed_BS; //CLOSE

          eye_L_occluderBS[1].weight = happyMouth_BS; //HAPPY

          eye_L_occluderBS[2].weight = sadEyes_BS; //SAD

          eye_L_occluderBS[3].weight = l_eye_mad; //MAD

          eye_L_occluderBS[4].weight = l_eye_extraOpen; //OPEN
          //EYE OCCLUDERS FOR FX

          eyeFX_R_occluderBS[0].weight = r_eye_closed_BS; //CLOSE

          eyeFX_R_occluderBS[1].weight = happyMouth_BS; //HAPPY

          eyeFX_R_occluderBS[2].weight = sadEyes_BS; //SAD

          eyeFX_R_occluderBS[3].weight = r_eye_mad; //MAD

          eyeFX_R_occluderBS[4].weight = r_eye_extraOpen; //OPEN

          eyeFX_L_occluderBS[0].weight = l_eye_closed_BS; //CLOSE

          eyeFX_L_occluderBS[1].weight = happyMouth_BS; //HAPPY

          eyeFX_L_occluderBS[2].weight = sadEyes_BS; //SAD

          eyeFX_L_occluderBS[3].weight = l_eye_mad; //MAD

          eyeFX_L_occluderBS[4].weight = l_eye_extraOpen; //OPEN
          //EYE OCCLUDERS FOR FX

          eyeMASK_R_occluderBS[0].weight = r_eye_closed_BS; //CLOSE

          eyeMASK_R_occluderBS[1].weight = happyMouth_BS; //HAPPY

          eyeMASK_R_occluderBS[2].weight = sadEyes_BS; //SAD

          eyeMASK_R_occluderBS[3].weight = r_eye_mad; //MAD

          eyeMASK_R_occluderBS[4].weight = r_eye_extraOpen; //OPEN

          eyeMASK_L_occluderBS[0].weight = l_eye_closed_BS; //CLOSE

          eyeMASK_L_occluderBS[1].weight = happyMouth_BS; //HAPPY

          eyeMASK_L_occluderBS[2].weight = sadEyes_BS; //SAD

          eyeMASK_L_occluderBS[3].weight = l_eye_mad; //MAD

          eyeMASK_L_occluderBS[4].weight = l_eye_extraOpen; //OPEN
          // EYE SOCKETS

          eye_R_socketBS[0].weight = sadEyes_BS; //SAD

          eye_R_socketBS[1].weight = r_eye_closed_BS; //CLOSE

          eye_R_socketBS[2].weight = happyMouth_BS; //HAPPY

          eye_R_socketBS[3].weight = r_eye_extraOpen; //OPEN

          eye_R_socketBS[4].weight = r_eye_mad; //MAD

          eye_L_socketBS[0].weight = sadEyes_BS; //SAD

          eye_L_socketBS[1].weight = l_eye_closed_BS; //CLOSE

          eye_L_socketBS[2].weight = happyMouth_BS; //HAPPY

          eye_L_socketBS[3].weight = l_eye_extraOpen; //OPEN

          eye_L_socketBS[4].weight = l_eye_mad; //MAD
          // EYE SOCKETS OCCLUDERS FOR FX

          eyeFX_R_socketBS[0].weight = sadEyes_BS; //SAD

          eyeFX_R_socketBS[1].weight = r_eye_closed_BS; //CLOSE

          eyeFX_R_socketBS[2].weight = happyMouth_BS; //HAPPY

          eyeFX_R_socketBS[3].weight = r_eye_extraOpen; //OPEN

          eyeFX_R_socketBS[4].weight = r_eye_mad; //MAD

          eyeFX_L_socketBS[0].weight = sadEyes_BS; //SAD

          eyeFX_L_socketBS[1].weight = l_eye_closed_BS; //CLOSE

          eyeFX_L_socketBS[2].weight = happyMouth_BS; //HAPPY

          eyeFX_L_socketBS[3].weight = l_eye_extraOpen; //OPEN

          eyeFX_L_socketBS[4].weight = l_eye_mad; //MAD
          // EYE SOCKETS OCCLUDERS FOR FX

          eyeMASK_R_socketBS[0].weight = sadEyes_BS; //SAD

          eyeMASK_R_socketBS[1].weight = r_eye_closed_BS; //CLOSE

          eyeMASK_R_socketBS[2].weight = happyMouth_BS; //HAPPY

          eyeMASK_R_socketBS[3].weight = r_eye_extraOpen; //OPEN

          eyeMASK_R_socketBS[4].weight = r_eye_mad; //MAD

          eyeMASK_L_socketBS[0].weight = sadEyes_BS; //SAD

          eyeMASK_L_socketBS[1].weight = l_eye_closed_BS; //CLOSE

          eyeMASK_L_socketBS[2].weight = happyMouth_BS; //HAPPY

          eyeMASK_L_socketBS[3].weight = l_eye_extraOpen; //OPEN

          eyeMASK_L_socketBS[4].weight = l_eye_mad; //MAD
          // EYE PUPILS

          eye_R_pupilBS[0].weight = Reactive.clamp(R_eyebrow_Angry_BS.sub(heart), 0, 1); //BORED

          eye_R_pupilBS[1].weight = Reactive.clamp(r_eye_mad.sub(heart), 0, 1); //MAD

          eye_R_pupilBS[2].weight = Reactive.clamp(happyMouth_BS.sub(heart), 0, 1); //HAPPY

          eye_R_pupilBS[3].weight = heart; //HEART

          eye_R_pupilBS[4].weight = 0; //Reactive.clamp(flame              .sub(heart), 0, 1);    //FLAME

          eye_L_pupilBS[0].weight = Reactive.clamp(L_eyebrow_Angry_BS.sub(heart), 0, 1); //BORED

          eye_L_pupilBS[1].weight = Reactive.clamp(r_eye_mad.sub(heart), 0, 1); //MAD

          eye_L_pupilBS[2].weight = Reactive.clamp(happyMouth_BS.sub(heart), 0, 1); //HAPPY

          eye_L_pupilBS[3].weight = heart; //HEART

          eye_L_pupilBS[4].weight = 0; //Reactive.clamp(flame              .sub(heart), 0, 1);    //FLAME

          _context.next = 126;
          return Patches.outputs.getScalar('mouth_close');

        case 126:
          close = _context.sent;
          _context.next = 129;
          return Patches.outputs.getScalar('mouth_smile');

        case 129:
          smile = _context.sent;
          _context.next = 132;
          return Patches.outputs.getScalar('mouth_oh');

        case 132:
          oh = _context.sent;
          _context.next = 135;
          return Patches.outputs.getScalar('mouth_sad');

        case 135:
          sad = _context.sent;
          _context.next = 138;
          return Patches.outputs.getScalar('mouth_sad_close_correction');

        case 138:
          sadClose = _context.sent;
          _context.next = 141;
          return Patches.outputs.getScalar('mouth_open');

        case 141:
          open = _context.sent;
          _context.next = 144;
          return Patches.outputs.getScalar('mouth_sad_open_correction');

        case 144:
          sadOpen = _context.sent;
          _context.next = 147;
          return Patches.outputs.getScalar('mouth_slider_R');

        case 147:
          sliderR = _context.sent;
          _context.next = 150;
          return Patches.outputs.getScalar('mouth_slider_L');

        case 150:
          slideL = _context.sent;
          _context.next = 153;
          return Patches.outputs.getScalar('mouth_pucker');

        case 153:
          pucker = _context.sent;
          _context.next = 156;
          return Patches.outputs.getScalar('mouth_OH_Open_correction');

        case 156:
          ohOpen = _context.sent;
          _context.next = 159;
          return Patches.outputs.getScalar('mouth_open_extra');

        case 159:
          openExtra = _context.sent;
          //EXTRA OPEN CORRECTION
          // MOUTH OCCLUDER
          mouth_occluderBS[0].weight = close; //CLOSE

          mouth_occluderBS[1].weight = open; //OPEN

          mouth_occluderBS[2].weight = smile; //SMILE

          mouth_occluderBS[3].weight = oh; //OH

          mouth_occluderBS[4].weight = sad; //SAD

          mouth_occluderBS[5].weight = sadClose; //SAD CLOSE CORRECTION

          mouth_occluderBS[6].weight = sadOpen; //SAD OPEN CORRECTION

          mouth_occluderBS[7].weight = sliderR; //SLIDE R

          mouth_occluderBS[8].weight = slideL; //SLIDE L

          mouth_occluderBS[9].weight = pucker; //PUCKER

          mouth_occluderBS[10].weight = ohOpen; //OH-OPEN CORRECTION

          mouth_occluderBS[11].weight = openExtra; //EXTRA OPEN CORRECTION
          // MOUTH

          mouthBS[0].weight = close; //CLOSE

          mouthBS[1].weight = smile; //SMILE

          mouthBS[2].weight = oh; //OH

          mouthBS[3].weight = sad; //SAD

          mouthBS[4].weight = sadClose; //SAD CLOSE CORRECTION

          mouthBS[5].weight = open; //OPEN

          mouthBS[6].weight = sadOpen; //SAD OPEN CORRECTION

          mouthBS[7].weight = sliderR; //SLIDE R

          mouthBS[8].weight = slideL; //SLIDE L

          mouthBS[9].weight = pucker; //PUCKER

          mouthBS[10].weight = ohOpen; //OH-OPEN CORRECTION

          mouthBS[11].weight = openExtra; //EXTRA OPEN CORRECTION
          // PUMPKING EXTRA HEIGHT

          pumpkinBS[0] = openExtra; //EXTRA-OPEN CORRECTION
          // NOSE OCCLUDER

          nose_occluderBS[0].weight = nose_height_BS; // HEIGHT

          nose_occluderBS[1].weight = nose_width_BS; // WIDTH
          // NOSE

          noseBS[0].weight = nose_width_BS; // WIDTH

          noseBS[1].weight = nose_height_BS; // HEIGHT

        case 189:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emitterParticleFade_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _emitterParticleFade_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_emitterParticleFade_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _emitterParticleFade_js__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _emitterParticleFade_js__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _script_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _script_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_script_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _script_js__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _script_js__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));





/***/ })
/******/ ]);
//# sourceMappingURL=script.js.map