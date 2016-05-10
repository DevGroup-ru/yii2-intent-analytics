(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntentAnalytics = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GoogleAnalytics = require('./counters/GoogleAnalytics');

var _YandexMetrika = require('./counters/YandexMetrika');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IntentAnalytics = function () {
  function IntentAnalytics() {
    _classCallCheck(this, IntentAnalytics);

    this.defaultOptions();
  }

  _createClass(IntentAnalytics, [{
    key: 'defaultOptions',
    value: function defaultOptions() {
      this.countersList = {};
      this.actionQueue = {};
    }
  }, {
    key: 'init',
    value: function init(countersList) {
      for (var counterType in countersList) {
        if (countersList.hasOwnProperty(counterType) === false) {
          continue;
        }
        var counter = countersList[counterType];
        var counterClass = IntentAnalytics.createCounter(counter, counterType);
        if (counterClass !== null) {
          this.countersList[counterType] = counterClass;
        }
      }
    }
  }, {
    key: 'addToQueue',
    value: function addToQueue(counterType, functionName, argument) {
      if (_typeof(this.actionQueue[counterType]) !== 'object') {
        this.actionQueue[counterType] = [];
      }
      this.actionQueue[counterType].push({
        'functionName': functionName,
        'argument': argument
      });
    }
  }, {
    key: 'checkUnhandled',
    value: function checkUnhandled() {
      for (var counterType in this.actionQueue) {
        if (this.actionQueue.hasOwnProperty(counterType) && _typeof(this.actionQueue[counterType]) === 'object') {
          // .counter getter will check if counter global object(ie. ga, yaCounter) now exists
          if (this.countersList.hasOwnProperty(counterType) && this.countersList[counterType].counter !== null) {
            // loop through all queueItems of this counter
            var counterClass = this.countersList[counterType];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.actionQueue[counterType][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var queueItem = _step.value;

                var functionName = queueItem.functionName;
                var argument = queueItem.argument;
                try {
                  counterClass[functionName](argument);
                } catch (e) {
                  IntentAnalytics.logError('Exception during queued ' + functionName + ' call: ' + JSON.stringify(e));
                }
              }
              // disable queue for this counter as it is not needed anymore
              // all next calls to this counter should be handled ok
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            this.actionQueue[counterType] = false;
          }
        }
      }
    }
  }, {
    key: 'track',
    value: function track(countersInstructions) {
      this.checkUnhandled();
      for (var counterType in countersInstructions) {
        if (countersInstructions.hasOwnProperty(counterType) === false) {
          continue;
        }

        var instruction = countersInstructions[counterType];
        if (this.countersList[counterType].counter === null) {
          // if global js object of counter is not loaded - this will add it to queue
          this.addToQueue(counterType, 'track', instruction);
        } else {
          if (this.countersList.hasOwnProperty(counterType)) {
            try {
              this.countersList[counterType].track(instruction);
            } catch (e) {
              IntentAnalytics.logError('Exception during track call: ' + JSON.stringify(e));
            }
          }
        }
      }
    }
  }, {
    key: 'sendVariables',
    value: function sendVariables(variables) {
      this.checkUnhandled();
      for (var counterType in this.countersList) {
        if (this.countersList.hasOwnProperty(counterType) === false) {
          continue;
        }
        var counter = this.countersList[counterType];
        if (counter.counter === null) {
          this.addToQueue(counterType, 'sendVariables', variables);
        }
        try {
          counter.sendVariables(variables);
        } catch (e) {
          IntentAnalytics.logError('Exception during sendVariables call: ' + JSON.stringify(e));
        }
      }
    }
  }], [{
    key: 'createCounter',
    value: function createCounter(counter, counterType) {
      switch (counterType) {
        case 'GoogleAnalytics':
          return new _GoogleAnalytics.GoogleAnalytics(counter.javascriptObjectName, counter);
        case 'YandexMetrika':
          return new _YandexMetrika.YandexMetrika(counter.javascriptObjectName, counter);
        default:
          return null;
      }
    }
  }, {
    key: 'logError',
    value: function logError(message) {
      /*eslint-disable */
      if (typeof console !== 'undefined') {
        console.log(message);
      }
      /*eslint-enable*/
    }
  }]);

  return IntentAnalytics;
}();

exports.IntentAnalytics = IntentAnalytics;

},{"./counters/GoogleAnalytics":9,"./counters/YandexMetrika":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._iaq = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CounterGoogleAnalytics = require('./counters/CounterGoogleAnalytics');

var _CounterYandexMetrika = require('./counters/CounterYandexMetrika');

var _CounterPiwik = require('./counters/CounterPiwik');

var _Click = require('./events/Click');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnionAnalytics = function () {
    function UnionAnalytics() {
        _classCallCheck(this, UnionAnalytics);

        this.counters = new Map();
        this.events = new Map();
        this.moduleMap = new Map();

        this.moduleMap.set('CounterGoogleAnalytics', _CounterGoogleAnalytics.CounterGoogleAnalytics);
        this.moduleMap.set('CounterYandexMetrika', _CounterYandexMetrika.CounterYandexMetrika);
        this.moduleMap.set('CounterPiwik', _CounterPiwik.CounterPiwik);
        this.moduleMap.set('Click', _Click.Click);
    }

    /**
     * Add module
     * @param jsModule
     * @param jsObject
     */


    _createClass(UnionAnalytics, [{
        key: 'addModule',
        value: function addModule(jsModule, jsObject) {
            this.moduleMap.set(jsModule, jsObject);
        }

        /**
         * Add counter
         * @param jsModule
         * @param id
         * @param jsObject
         * @param options
         */

    }, {
        key: 'addCounter',
        value: function addCounter(id, jsModule, jsObject, options) {
            if (!this.moduleMap.has(jsModule)) {
                return;
            }
            jsModule = this.moduleMap.get(jsModule);
            this.counters.set(id, new jsModule(this, jsObject, options));
        }

        /**
         * Add event
         * @param jsModule
         * @param type
         * @param options
         */

    }, {
        key: 'addEvent',
        value: function addEvent(jsModule, type, options) {
            if (!this.moduleMap.has(jsModule)) {
                return;
            }
            jsModule = this.moduleMap.get(jsModule);

            var _array = this.events.has(type) ? this.events.get(type) : [];
            _array.push(new jsModule(this, options));
            this.events.set(type, _array);
        }

        /**
         * Add counters
         * @param counters
         */

    }, {
        key: 'addCounters',
        value: function addCounters(counters) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = counters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var counter = _step.value;

                    this.addCounter(counter.id, counter.jsModule, counter.jsObject, counter.options);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Add events
         * @param events
         */

    }, {
        key: 'addEvents',
        value: function addEvents(events) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var event = _step2.value;

                    this.addEvent(event.jsModule, event.type, event.options);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /**
         * Trigger an event
         * @param type
         * @param params
         */

    }, {
        key: 'trigger',
        value: function trigger(type, params) {
            var _array = this.events.has(type) ? this.events.get(type) : [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = _array[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var event = _step3.value;

                    event.trigger(params);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }]);

    return UnionAnalytics;
}();

var _iaq = exports._iaq = new UnionAnalytics();

},{"./counters/CounterGoogleAnalytics":5,"./counters/CounterPiwik":7,"./counters/CounterYandexMetrika":8,"./events/Click":11}],3:[function(require,module,exports){
(function (global){
'use strict';

var _IntentAnalytics = require('./IntentAnalytics');

var _UnionAnalytics = require('./UnionAnalytics');

global.intentAnalytics = new _IntentAnalytics.IntentAnalytics();
global._iaq = _UnionAnalytics._iaq;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./IntentAnalytics":1,"./UnionAnalytics":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractCounter = function () {
  // Here we turn off no-unused-vars warning because this class is actually abstract.
  // So there's a lot of unused vars and it is normal - we just want to describe the whole interface.
  /* eslint no-unused-vars: 0*/

  function AbstractCounter(javascriptObjectName, params) {
    _classCallCheck(this, AbstractCounter);

    this.javascriptObjectName = javascriptObjectName;
  }

  _createClass(AbstractCounter, [{
    key: "track",
    value: function track(params) {}
  }, {
    key: "sendVariables",
    value: function sendVariables(variables) {}
  }, {
    key: "counter",
    get: function get() {
      return AbstractCounter.getCounterObject(this.javascriptObjectName);
    }
  }], [{
    key: "getCounterObject",
    value: function getCounterObject(javascriptObjectName) {
      return window[javascriptObjectName] || null;
    }
  }]);

  return AbstractCounter;
}();

exports.AbstractCounter = AbstractCounter;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CounterGoogleAnalytics = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CounterInterface2 = require('./CounterInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CounterGoogleAnalytics = function (_CounterInterface) {
    _inherits(CounterGoogleAnalytics, _CounterInterface);

    function CounterGoogleAnalytics() {
        _classCallCheck(this, CounterGoogleAnalytics);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CounterGoogleAnalytics).apply(this, arguments));
    }

    _createClass(CounterGoogleAnalytics, [{
        key: 'init',
        value: function init(options) {
            _get(Object.getPrototypeOf(CounterGoogleAnalytics.prototype), 'init', this).call(this, options);
        }

        /**
         */

    }, {
        key: 'type',
        get: function get() {
            return _CounterInterface2.TYPE_GA;
        }
    }]);

    return CounterGoogleAnalytics;
}(_CounterInterface2.CounterInterface);

exports.CounterGoogleAnalytics = CounterGoogleAnalytics;

},{"./CounterInterface":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CounterInterface = function () {
    function CounterInterface(locator, jsObject, options) {
        _classCallCheck(this, CounterInterface);

        this.locator = locator;
        this.jsObject = jsObject;
        this.rawOptions = options;
        this.init(options);
    }

    /**
     * Init
     * @param options
     */


    _createClass(CounterInterface, [{
        key: 'init',
        value: function init(options) {}

        /**
         * Return type of counter as string
         * @returns {*}
         */

    }, {
        key: 'type',
        get: function get() {
            return '';
        }
    }]);

    return CounterInterface;
}();

var TYPE_GA = 'Google Analytics';
var TYPE_YA = 'Yandex.Metrika';
var TYPE_PI = 'Piwik';

exports.CounterInterface = CounterInterface;
exports.TYPE_GA = TYPE_GA;
exports.TYPE_YA = TYPE_YA;
exports.TYPE_PI = TYPE_PI;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CounterPiwik = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CounterInterface2 = require('./CounterInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CounterPiwik = function (_CounterInterface) {
    _inherits(CounterPiwik, _CounterInterface);

    function CounterPiwik() {
        _classCallCheck(this, CounterPiwik);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CounterPiwik).apply(this, arguments));
    }

    _createClass(CounterPiwik, [{
        key: 'init',
        value: function init(options) {
            _get(Object.getPrototypeOf(CounterPiwik.prototype), 'init', this).call(this, options);
        }

        /**
         */

    }, {
        key: 'type',
        get: function get() {
            return _CounterInterface2.TYPE_PI;
        }
    }]);

    return CounterPiwik;
}(_CounterInterface2.CounterInterface);

exports.CounterPiwik = CounterPiwik;

},{"./CounterInterface":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CounterYandexMetrika = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CounterInterface2 = require('./CounterInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CounterYandexMetrika = function (_CounterInterface) {
    _inherits(CounterYandexMetrika, _CounterInterface);

    function CounterYandexMetrika() {
        _classCallCheck(this, CounterYandexMetrika);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CounterYandexMetrika).apply(this, arguments));
    }

    _createClass(CounterYandexMetrika, [{
        key: 'init',
        value: function init(options) {
            _get(Object.getPrototypeOf(CounterYandexMetrika.prototype), 'init', this).call(this, options);
        }

        /**
         */

    }, {
        key: 'type',
        get: function get() {
            return _CounterInterface2.TYPE_YA;
        }
    }]);

    return CounterYandexMetrika;
}(_CounterInterface2.CounterInterface);

exports.CounterYandexMetrika = CounterYandexMetrika;

},{"./CounterInterface":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleAnalytics = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractCounter2 = require('./AbstractCounter');

var _IntentAnalytics = require('../IntentAnalytics');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GoogleAnalytics = function (_AbstractCounter) {
  _inherits(GoogleAnalytics, _AbstractCounter);

  function GoogleAnalytics() {
    var javascriptObjectName = arguments.length <= 0 || arguments[0] === undefined ? 'ga' : arguments[0];
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, GoogleAnalytics);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GoogleAnalytics).call(this, javascriptObjectName, params));

    _this.trackerName = params.trackerName || '';
    return _this;
  }

  _createClass(GoogleAnalytics, [{
    key: 'track',
    value: function track(params) {
      if (typeof params.action === 'undefined') {
        _IntentAnalytics.IntentAnalytics.logError('No action supplied for GoogleAnalytics.track: ' + JSON.stringify(params));
        return;
      }
      var functionName = this.trackerSendPrefix + 'send';

      this.counter(functionName, {
        'hitType': 'event',
        'eventCategory': params.category || 'common',
        'eventAction': params.action,
        'eventLabel': params.label || undefined,
        'eventValue': params.value || undefined
      });
    }
  }, {
    key: 'sendVariables',
    value: function sendVariables(variables) {
      //! @todo Think of big depth - ga doesn't accept it.
      this.counter(this.trackerSendPrefix + 'set', variables);
    }
  }, {
    key: 'trackerSendPrefix',
    get: function get() {
      return this.trackerName || '';
    }
  }]);

  return GoogleAnalytics;
}(_AbstractCounter2.AbstractCounter);

exports.GoogleAnalytics = GoogleAnalytics;

},{"../IntentAnalytics":1,"./AbstractCounter":4}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YandexMetrika = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractCounter2 = require('./AbstractCounter');

var _IntentAnalytics = require('../IntentAnalytics');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YandexMetrika = function (_AbstractCounter) {
  _inherits(YandexMetrika, _AbstractCounter);

  function YandexMetrika(javascriptObjectName, params) {
    _classCallCheck(this, YandexMetrika);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(YandexMetrika).call(this, javascriptObjectName, params));
  }

  _createClass(YandexMetrika, [{
    key: 'track',
    value: function track(params) {
      if (typeof params.goal === 'undefined') {
        _IntentAnalytics.IntentAnalytics.logError('No goal supplied for YandexMetrika.track: ' + JSON.stringify(params));
        return;
      }
      this.counter.reachGoal(params.goal, params.params || {});
    }
  }, {
    key: 'sendVariables',
    value: function sendVariables(variables) {
      this.counter.params(variables);
    }
  }]);

  return YandexMetrika;
}(_AbstractCounter2.AbstractCounter);

exports.YandexMetrika = YandexMetrika;

},{"../IntentAnalytics":1,"./AbstractCounter":4}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Click = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EventInterface2 = require('./EventInterface');

var _CounterInterface = require('../counters/CounterInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Click = function (_EventInterface) {
    _inherits(Click, _EventInterface);

    function Click() {
        _classCallCheck(this, Click);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Click).apply(this, arguments));
    }

    _createClass(Click, [{
        key: 'init',
        value: function init(options) {
            var _this2 = this;

            _get(Object.getPrototypeOf(Click.prototype), 'init', this).call(this, options);

            if (options.hasOwnProperty('selectors')) {
                for (var i = 0; i < options.selectors.length; i++) {
                    var q = window.document.querySelectorAll(options.selectors[i]);
                    for (var ii = 0; ii < q.length; ii++) {
                        q[ii].addEventListener('click', function (event) {
                            return _this2.eventHandler(event);
                        });
                    }
                }
            }
        }

        /**
         * Handler
         * @param event
         */

    }, {
        key: 'eventHandler',
        value: function eventHandler(event) {
            this.sendData();
        }

        /**
         * @param params
         */

    }, {
        key: 'trigger',
        value: function trigger(params) {
            _get(Object.getPrototypeOf(Click.prototype), 'trigger', this).call(this, params);
            this.sendData();
        }

        /**
         *
         */

    }, {
        key: 'sendData',
        value: function sendData() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.locator.counters.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var counter = _step.value;

                    if (_CounterInterface.TYPE_GA == counter.type) {
                        window[counter.jsObject]('send', 'event', 'Action', 'click', 'Click');
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return Click;
}(_EventInterface2.EventInterface);

exports.Click = Click;

},{"../counters/CounterInterface":6,"./EventInterface":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventInterface = function () {
  /**
   * @param locator UnionAnalytics
   * @param options
   */

  function EventInterface(locator, options) {
    _classCallCheck(this, EventInterface);

    this.locator = locator;
    this.init(options);
  }

  /**
   * Init
   * @param options
   */


  _createClass(EventInterface, [{
    key: "init",
    value: function init(options) {}

    /**
     * Trigger
     * @param params
     */

  }, {
    key: "trigger",
    value: function trigger(params) {}
  }]);

  return EventInterface;
}();

exports.EventInterface = EventInterface;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9JbnRlbnRBbmFseXRpY3MuanMiLCJqcy9VbmlvbkFuYWx5dGljcy5qcyIsImpzL2FwcC5qcyIsImpzL2NvdW50ZXJzL0Fic3RyYWN0Q291bnRlci5qcyIsImpzL2NvdW50ZXJzL0NvdW50ZXJHb29nbGVBbmFseXRpY3MuanMiLCJqcy9jb3VudGVycy9Db3VudGVySW50ZXJmYWNlLmpzIiwianMvY291bnRlcnMvQ291bnRlclBpd2lrLmpzIiwianMvY291bnRlcnMvQ291bnRlcllhbmRleE1ldHJpa2EuanMiLCJqcy9jb3VudGVycy9Hb29nbGVBbmFseXRpY3MuanMiLCJqcy9jb3VudGVycy9ZYW5kZXhNZXRyaWthLmpzIiwianMvZXZlbnRzL0NsaWNrLmpzIiwianMvZXZlbnRzL0V2ZW50SW50ZXJmYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7OztJQUVNLGU7QUFDSiw2QkFBYztBQUFBOztBQUNaLFNBQUssY0FBTDtBQUNEOzs7O3FDQUVnQjtBQUNmLFdBQUssWUFBTCxHQUFvQixFQUFwQjtBQUNBLFdBQUssV0FBTCxHQUFtQixFQUFuQjtBQUNEOzs7eUJBRUksWSxFQUFjO0FBQ2pCLFdBQUssSUFBTSxXQUFYLElBQTBCLFlBQTFCLEVBQXdDO0FBQ3RDLFlBQUksYUFBYSxjQUFiLENBQTRCLFdBQTVCLE1BQTZDLEtBQWpELEVBQXdEO0FBQ3REO0FBQ0Q7QUFDRCxZQUFNLFVBQVUsYUFBYSxXQUFiLENBQWhCO0FBQ0EsWUFBTSxlQUFlLGdCQUFnQixhQUFoQixDQUE4QixPQUE5QixFQUF1QyxXQUF2QyxDQUFyQjtBQUNBLFlBQUksaUJBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLGVBQUssWUFBTCxDQUFrQixXQUFsQixJQUFpQyxZQUFqQztBQUNEO0FBQ0Y7QUFDRjs7OytCQWFVLFcsRUFBYSxZLEVBQWMsUSxFQUFVO0FB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O0FBQUE7O0FBQzFCLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxTQUFLLElBQUwsQ0FBVSxPQUFWO0FBQ0g7Ozs7Ozs7Ozs7eUJBTUksTyxFQUFTLENBQ2I7Ozs7Ozs7Ozs0QkFNTyxNLEVBQVEsQ0FDZjs7Ozs7O1FBR0csYyxHQUFBLGMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtHb29nbGVBbmFseXRpY3N9IGZyb20gJy4vY291bnRlcnMvR29vZ2xlQW5hbHl0aWNzJztcbmltcG9ydCB7WWFuZGV4TWV0cmlrYX0gZnJvbSAnLi9jb3VudGVycy9ZYW5kZXhNZXRyaWthJztcblxuY2xhc3MgSW50ZW50QW5hbHl0aWNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucygpO1xuICB9XG5cbiAgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgdGhpcy5jb3VudGVyc0xpc3QgPSB7fTtcbiAgICB0aGlzLmFjdGlvblF1ZXVlID0ge307XG4gIH1cblxuICBpbml0KGNvdW50ZXJzTGlzdCkge1xuICAgIGZvciAoY29uc3QgY291bnRlclR5cGUgaW4gY291bnRlcnNMaXN0KSB7XG4gICAgICBpZiAoY291bnRlcnNMaXN0Lmhhc093blByb3BlcnR5KGNvdW50ZXJUeXBlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBjb3VudGVyID0gY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXTtcbiAgICAgIGNvbnN0IGNvdW50ZXJDbGFzcyA9IEludGVudEFuYWx5dGljcy5jcmVhdGVDb3VudGVyKGNvdW50ZXIsIGNvdW50ZXJUeXBlKTtcbiAgICAgIGlmIChjb3VudGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb3VudGVyc0xpc3RbY291bnRlclR5cGVdID0gY291bnRlckNsYXNzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVDb3VudGVyKGNvdW50ZXIsIGNvdW50ZXJUeXBlKSB7XG4gICAgc3dpdGNoIChjb3VudGVyVHlwZSkge1xuICAgIGNhc2UgJ0dvb2dsZUFuYWx5dGljcyc6XG4gICAgICByZXR1cm4gbmV3IEdvb2dsZUFuYWx5dGljcyhjb3VudGVyLmphdmFzY3JpcHRPYmplY3ROYW1lLCBjb3VudGVyKTtcbiAgICBjYXNlICdZYW5kZXhNZXRyaWthJzpcbiAgICAgIHJldHVybiBuZXcgWWFuZGV4TWV0cmlrYShjb3VudGVyLmphdmFzY3JpcHRPYmplY3ROYW1lLCBjb3VudGVyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkVG9RdWV1ZShjb3VudGVyVHlwZSwgZnVuY3Rpb25OYW1lLCBhcmd1bWVudCkge1xuICAgIGlmICh0eXBlb2YodGhpcy5hY3Rpb25RdWV1ZVtjb3VudGVyVHlwZV0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5hY3Rpb25RdWV1ZVtjb3VudGVyVHlwZV0gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5hY3Rpb25RdWV1ZVtjb3VudGVyVHlwZV0ucHVzaCh7XG4gICAgICAnZnVuY3Rpb25OYW1lJzogZnVuY3Rpb25OYW1lLFxuICAgICAgJ2FyZ3VtZW50JzogYXJndW1lbnQsXG4gICAgfSk7XG4gIH1cblxuICBjaGVja1VuaGFuZGxlZCgpIHtcbiAgICBmb3IgKGNvbnN0IGNvdW50ZXJUeXBlIGluIHRoaXMuYWN0aW9uUXVldWUpIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvblF1ZXVlLmhhc093blByb3BlcnR5KGNvdW50ZXJUeXBlKSAmJiB0eXBlb2YodGhpcy5hY3Rpb25RdWV1ZVtjb3VudGVyVHlwZV0pID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyAuY291bnRlciBnZXR0ZXIgd2lsbCBjaGVjayBpZiBjb3VudGVyIGdsb2JhbCBvYmplY3QoaWUuIGdhLCB5YUNvdW50ZXIpIG5vdyBleGlzdHNcbiAgICAgICAgaWYgKHRoaXMuY291bnRlcnNMaXN0Lmhhc093blByb3BlcnR5KGNvdW50ZXJUeXBlKSAmJiB0aGlzLmNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV0uY291bnRlciAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgcXVldWVJdGVtcyBvZiB0aGlzIGNvdW50ZXJcbiAgICAgICAgICBjb25zdCBjb3VudGVyQ2xhc3MgPSB0aGlzLmNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV07XG4gICAgICAgICAgZm9yIChjb25zdCBxdWV1ZUl0ZW0gb2YgdGhpcy5hY3Rpb25RdWV1ZVtjb3VudGVyVHlwZV0pIHtcbiAgICAgICAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IHF1ZXVlSXRlbS5mdW5jdGlvbk5hbWU7XG4gICAgICAgICAgICBjb25zdCBhcmd1bWVudCA9IHF1ZXVlSXRlbS5hcmd1bWVudDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvdW50ZXJDbGFzc1tmdW5jdGlvbk5hbWVdKGFyZ3VtZW50KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKGBFeGNlcHRpb24gZHVyaW5nIHF1ZXVlZCAke2Z1bmN0aW9uTmFtZX0gY2FsbDogJHtKU09OLnN0cmluZ2lmeShlKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZGlzYWJsZSBxdWV1ZSBmb3IgdGhpcyBjb3VudGVyIGFzIGl0IGlzIG5vdCBuZWVkZWQgYW55bW9yZVxuICAgICAgICAgIC8vIGFsbCBuZXh0IGNhbGxzIHRvIHRoaXMgY291bnRlciBzaG91bGQgYmUgaGFuZGxlZCBva1xuICAgICAgICAgIHRoaXMuYWN0aW9uUXVldWVbY291bnRlclR5cGVdID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0cmFjayhjb3VudGVyc0luc3RydWN0aW9ucykge1xuICAgIHRoaXMuY2hlY2tVbmhhbmRsZWQoKTtcbiAgICBmb3IgKGNvbnN0IGNvdW50ZXJUeXBlIGluIGNvdW50ZXJzSW5zdHJ1Y3Rpb25zKSB7XG4gICAgICBpZiAoY291bnRlcnNJbnN0cnVjdGlvbnMuaGFzT3duUHJvcGVydHkoY291bnRlclR5cGUpID09PSBmYWxzZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSBjb3VudGVyc0luc3RydWN0aW9uc1tjb3VudGVyVHlwZV07XG4gICAgICBpZiAodGhpcy5jb3VudGVyc0xpc3RbY291bnRlclR5cGVdLmNvdW50ZXIgPT09IG51bGwpIHtcbiAgICAgICAgLy8gaWYgZ2xvYmFsIGpzIG9iamVjdCBvZiBjb3VudGVyIGlzIG5vdCBsb2FkZWQgLSB0aGlzIHdpbGwgYWRkIGl0IHRvIHF1ZXVlXG4gICAgICAgIHRoaXMuYWRkVG9RdWV1ZShjb3VudGVyVHlwZSwgJ3RyYWNrJywgaW5zdHJ1Y3Rpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnRlcnNMaXN0Lmhhc093blByb3BlcnR5KGNvdW50ZXJUeXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV0udHJhY2soaW5zdHJ1Y3Rpb24pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIEludGVudEFuYWx5dGljcy5sb2dFcnJvcignRXhjZXB0aW9uIGR1cmluZyB0cmFjayBjYWxsOiAnICsgSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNlbmRWYXJpYWJsZXModmFyaWFibGVzKSB7XG4gICAgdGhpcy5jaGVja1VuaGFuZGxlZCgpO1xuICAgIGZvciAoY29uc3QgY291bnRlclR5cGUgaW4gdGhpcy5jb3VudGVyc0xpc3QpIHtcbiAgICAgIGlmICh0aGlzLmNvdW50ZXJzTGlzdC5oYXNPd25Qcm9wZXJ0eShjb3VudGVyVHlwZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgY291bnRlciA9IHRoaXMuY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXTtcbiAgICAgIGlmIChjb3VudGVyLmNvdW50ZXIgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5hZGRUb1F1ZXVlKGNvdW50ZXJUeXBlLCAnc2VuZFZhcmlhYmxlcycsIHZhcmlhYmxlcyk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBjb3VudGVyLnNlbmRWYXJpYWJsZXModmFyaWFibGVzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKCdFeGNlcHRpb24gZHVyaW5nIHNlbmRWYXJpYWJsZXMgY2FsbDogJyArIEpTT04uc3RyaW5naWZ5KGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbG9nRXJyb3IobWVzc2FnZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSovXG4gIH1cbn1cblxuZXhwb3J0IHtJbnRlbnRBbmFseXRpY3N9O1xuIiwiaW1wb3J0IHtDb3VudGVyR29vZ2xlQW5hbHl0aWNzfSBmcm9tICcuL2NvdW50ZXJzL0NvdW50ZXJHb29nbGVBbmFseXRpY3MnO1xuaW1wb3J0IHtDb3VudGVyWWFuZGV4TWV0cmlrYX0gZnJvbSAnLi9jb3VudGVycy9Db3VudGVyWWFuZGV4TWV0cmlrYSc7XG5pbXBvcnQge0NvdW50ZXJQaXdpa30gZnJvbSAnLi9jb3VudGVycy9Db3VudGVyUGl3aWsnO1xuaW1wb3J0IHtDbGlja30gZnJvbSAnLi9ldmVudHMvQ2xpY2snO1xuXG5jbGFzcyBVbmlvbkFuYWx5dGljcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY291bnRlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm1vZHVsZU1hcCA9IG5ldyBNYXAoKTtcblxuICAgICAgICB0aGlzLm1vZHVsZU1hcC5zZXQoJ0NvdW50ZXJHb29nbGVBbmFseXRpY3MnLCBDb3VudGVyR29vZ2xlQW5hbHl0aWNzKTtcbiAgICAgICAgdGhpcy5tb2R1bGVNYXAuc2V0KCdDb3VudGVyWWFuZGV4TWV0cmlrYScsIENvdW50ZXJZYW5kZXhNZXRyaWthKTtcbiAgICAgICAgdGhpcy5tb2R1bGVNYXAuc2V0KCdDb3VudGVyUGl3aWsnLCBDb3VudGVyUGl3aWspO1xuICAgICAgICB0aGlzLm1vZHVsZU1hcC5zZXQoJ0NsaWNrJywgQ2xpY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBtb2R1bGVcbiAgICAgKiBAcGFyYW0ganNNb2R1bGVcbiAgICAgKiBAcGFyYW0ganNPYmplY3RcbiAgICAgKi9cbiAgICBhZGRNb2R1bGUoanNNb2R1bGUsIGpzT2JqZWN0KSB7XG4gICAgICAgIHRoaXMubW9kdWxlTWFwLnNldChqc01vZHVsZSwganNPYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBjb3VudGVyXG4gICAgICogQHBhcmFtIGpzTW9kdWxlXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIGpzT2JqZWN0XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBhZGRDb3VudGVyKGlkLCBqc01vZHVsZSwganNPYmplY3QsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1vZHVsZU1hcC5oYXMoanNNb2R1bGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgIGpzTW9kdWxlID0gdGhpcy5tb2R1bGVNYXAuZ2V0KGpzTW9kdWxlKTtcbiAgICAgICAgdGhpcy5jb3VudGVycy5zZXQoaWQsIG5ldyBqc01vZHVsZSh0aGlzLCBqc09iamVjdCwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBldmVudFxuICAgICAqIEBwYXJhbSBqc01vZHVsZVxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBhZGRFdmVudChqc01vZHVsZSwgdHlwZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAoIXRoaXMubW9kdWxlTWFwLmhhcyhqc01vZHVsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH1cbiAgICAgICAganNNb2R1bGUgPSB0aGlzLm1vZHVsZU1hcC5nZXQoanNNb2R1bGUpO1xuXG4gICAgICAgIGxldCBfYXJyYXkgPSB0aGlzLmV2ZW50cy5oYXModHlwZSkgPyB0aGlzLmV2ZW50cy5nZXQodHlwZSkgOiBbXTtcbiAgICAgICAgX2FycmF5LnB1c2gobmV3IGpzTW9kdWxlKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgICAgdGhpcy5ldmVudHMuc2V0KHR5cGUsIF9hcnJheSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGNvdW50ZXJzXG4gICAgICogQHBhcmFtIGNvdW50ZXJzXG4gICAgICovXG4gICAgYWRkQ291bnRlcnMoY291bnRlcnMpIHtcbiAgICAgICAgZm9yIChsZXQgY291bnRlciBvZiBjb3VudGVycykge1xuICAgICAgICAgICAgdGhpcy5hZGRDb3VudGVyKGNvdW50ZXIuaWQsIGNvdW50ZXIuanNNb2R1bGUsIGNvdW50ZXIuanNPYmplY3QsIGNvdW50ZXIub3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgZXZlbnRzXG4gICAgICogQHBhcmFtIGV2ZW50c1xuICAgICAqL1xuICAgIGFkZEV2ZW50cyhldmVudHMpIHtcbiAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50KGV2ZW50LmpzTW9kdWxlLCBldmVudC50eXBlLCBldmVudC5vcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgYW4gZXZlbnRcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICB0cmlnZ2VyKHR5cGUsIHBhcmFtcykge1xuICAgICAgICBsZXQgX2FycmF5ID0gdGhpcy5ldmVudHMuaGFzKHR5cGUpID8gdGhpcy5ldmVudHMuZ2V0KHR5cGUpIDogW107XG4gICAgICAgIGZvciAobGV0IGV2ZW50IG9mIF9hcnJheSkge1xuICAgICAgICAgICAgZXZlbnQudHJpZ2dlcihwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgX2lhcSA9IG5ldyBVbmlvbkFuYWx5dGljcygpO1xuIiwiaW1wb3J0IHtJbnRlbnRBbmFseXRpY3N9IGZyb20gJy4vSW50ZW50QW5hbHl0aWNzJztcbmltcG9ydCB7X2lhcX0gZnJvbSAnLi9VbmlvbkFuYWx5dGljcyc7XG5cbmdsb2JhbC5pbnRlbnRBbmFseXRpY3MgPSBuZXcgSW50ZW50QW5hbHl0aWNzKCk7XG5nbG9iYWwuX2lhcSA9IF9pYXE7XG4iLCJjbGFzcyBBYnN0cmFjdENvdW50ZXIge1xuICAvLyBIZXJlIHdlIHR1cm4gb2ZmIG5vLXVudXNlZC12YXJzIHdhcm5pbmcgYmVjYXVzZSB0aGlzIGNsYXNzIGlzIGFjdHVhbGx5IGFic3RyYWN0LlxuICAvLyBTbyB0aGVyZSdzIGEgbG90IG9mIHVudXNlZCB2YXJzIGFuZCBpdCBpcyBub3JtYWwgLSB3ZSBqdXN0IHdhbnQgdG8gZGVzY3JpYmUgdGhlIHdob2xlIGludGVyZmFjZS5cbiAgLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cbiAgY29uc3RydWN0b3IoamF2YXNjcmlwdE9iamVjdE5hbWUsIHBhcmFtcykge1xuICAgIHRoaXMuamF2YXNjcmlwdE9iamVjdE5hbWUgPSBqYXZhc2NyaXB0T2JqZWN0TmFtZTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDb3VudGVyT2JqZWN0KGphdmFzY3JpcHRPYmplY3ROYW1lKSB7XG4gICAgcmV0dXJuIHdpbmRvd1tqYXZhc2NyaXB0T2JqZWN0TmFtZV0gfHwgbnVsbDtcbiAgfVxuXG4gIHRyYWNrKHBhcmFtcykge1xuICB9XG5cbiAgc2VuZFZhcmlhYmxlcyh2YXJpYWJsZXMpIHtcblxuICB9XG5cbiAgZ2V0IGNvdW50ZXIoKSB7XG4gICAgcmV0dXJuIEFic3RyYWN0Q291bnRlci5nZXRDb3VudGVyT2JqZWN0KHRoaXMuamF2YXNjcmlwdE9iamVjdE5hbWUpO1xuICB9XG5cbn1cblxuZXhwb3J0IHtBYnN0cmFjdENvdW50ZXJ9O1xuIiwiaW1wb3J0IHtDb3VudGVySW50ZXJmYWNlLCBUWVBFX0dBfSBmcm9tICcuL0NvdW50ZXJJbnRlcmZhY2UnO1xuXG5jbGFzcyBDb3VudGVyR29vZ2xlQW5hbHl0aWNzIGV4dGVuZHMgQ291bnRlckludGVyZmFjZSB7XG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICovXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiBUWVBFX0dBO1xuICAgIH1cbn1cblxuZXhwb3J0IHtDb3VudGVyR29vZ2xlQW5hbHl0aWNzfTtcbiIsImNsYXNzIENvdW50ZXJJbnRlcmZhY2Uge1xuICAgIGNvbnN0cnVjdG9yKGxvY2F0b3IsIGpzT2JqZWN0LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMubG9jYXRvciA9IGxvY2F0b3I7XG4gICAgICAgIHRoaXMuanNPYmplY3QgPSBqc09iamVjdDtcbiAgICAgICAgdGhpcy5yYXdPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5pbml0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGluaXQob3B0aW9ucykge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0eXBlIG9mIGNvdW50ZXIgYXMgc3RyaW5nXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG59XG5cbmNvbnN0IFRZUEVfR0EgPSAnR29vZ2xlIEFuYWx5dGljcyc7XG5jb25zdCBUWVBFX1lBID0gJ1lhbmRleC5NZXRyaWthJztcbmNvbnN0IFRZUEVfUEkgPSAnUGl3aWsnO1xuXG5leHBvcnQge0NvdW50ZXJJbnRlcmZhY2UsIFRZUEVfR0EsIFRZUEVfWUEsIFRZUEVfUEl9O1xuIiwiaW1wb3J0IHtDb3VudGVySW50ZXJmYWNlLCBUWVBFX1BJfSBmcm9tICcuL0NvdW50ZXJJbnRlcmZhY2UnO1xuXG5jbGFzcyBDb3VudGVyUGl3aWsgZXh0ZW5kcyBDb3VudGVySW50ZXJmYWNlIHtcbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKi9cbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIFRZUEVfUEk7XG4gICAgfVxufVxuXG5leHBvcnQge0NvdW50ZXJQaXdpa307XG4iLCJpbXBvcnQge0NvdW50ZXJJbnRlcmZhY2UsIFRZUEVfWUF9IGZyb20gJy4vQ291bnRlckludGVyZmFjZSc7XG5cbmNsYXNzIENvdW50ZXJZYW5kZXhNZXRyaWthIGV4dGVuZHMgQ291bnRlckludGVyZmFjZSB7XG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICovXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiBUWVBFX1lBO1xuICAgIH1cbn1cblxuZXhwb3J0IHtDb3VudGVyWWFuZGV4TWV0cmlrYX07XG4iLCJpbXBvcnQge0Fic3RyYWN0Q291bnRlcn0gZnJvbSAnLi9BYnN0cmFjdENvdW50ZXInO1xuaW1wb3J0IHtJbnRlbnRBbmFseXRpY3N9IGZyb20gJy4uL0ludGVudEFuYWx5dGljcyc7XG5cbmNsYXNzIEdvb2dsZUFuYWx5dGljcyBleHRlbmRzIEFic3RyYWN0Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKGphdmFzY3JpcHRPYmplY3ROYW1lID0gJ2dhJywgcGFyYW1zID0ge30pIHtcbiAgICBzdXBlcihqYXZhc2NyaXB0T2JqZWN0TmFtZSwgcGFyYW1zKTtcbiAgICB0aGlzLnRyYWNrZXJOYW1lID0gcGFyYW1zLnRyYWNrZXJOYW1lIHx8ICcnO1xuICB9XG5cbiAgZ2V0IHRyYWNrZXJTZW5kUHJlZml4KCkge1xuICAgIHJldHVybiB0aGlzLnRyYWNrZXJOYW1lIHx8ICcnO1xuICB9XG5cbiAgdHJhY2socGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZihwYXJhbXMuYWN0aW9uKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIEludGVudEFuYWx5dGljcy5sb2dFcnJvcignTm8gYWN0aW9uIHN1cHBsaWVkIGZvciBHb29nbGVBbmFseXRpY3MudHJhY2s6ICcgKyBKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gdGhpcy50cmFja2VyU2VuZFByZWZpeCArICdzZW5kJztcblxuICAgIHRoaXMuY291bnRlcihmdW5jdGlvbk5hbWUsIHtcbiAgICAgICdoaXRUeXBlJzogJ2V2ZW50JyxcbiAgICAgICdldmVudENhdGVnb3J5JzogcGFyYW1zLmNhdGVnb3J5IHx8ICdjb21tb24nLFxuICAgICAgJ2V2ZW50QWN0aW9uJzogcGFyYW1zLmFjdGlvbixcbiAgICAgICdldmVudExhYmVsJzogcGFyYW1zLmxhYmVsIHx8IHVuZGVmaW5lZCxcbiAgICAgICdldmVudFZhbHVlJzogcGFyYW1zLnZhbHVlIHx8IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRWYXJpYWJsZXModmFyaWFibGVzKSB7XG4gICAgLy8hIEB0b2RvIFRoaW5rIG9mIGJpZyBkZXB0aCAtIGdhIGRvZXNuJ3QgYWNjZXB0IGl0LlxuICAgIHRoaXMuY291bnRlcih0aGlzLnRyYWNrZXJTZW5kUHJlZml4ICsgJ3NldCcsIHZhcmlhYmxlcyk7XG4gIH1cbn1cblxuZXhwb3J0IHtHb29nbGVBbmFseXRpY3N9O1xuIiwiaW1wb3J0IHtBYnN0cmFjdENvdW50ZXJ9IGZyb20gJy4vQWJzdHJhY3RDb3VudGVyJztcbmltcG9ydCB7SW50ZW50QW5hbHl0aWNzfSBmcm9tICcuLi9JbnRlbnRBbmFseXRpY3MnO1xuXG5jbGFzcyBZYW5kZXhNZXRyaWthIGV4dGVuZHMgQWJzdHJhY3RDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoamF2YXNjcmlwdE9iamVjdE5hbWUsIHBhcmFtcykge1xuICAgIHN1cGVyKGphdmFzY3JpcHRPYmplY3ROYW1lLCBwYXJhbXMpO1xuICB9XG5cbiAgdHJhY2socGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZihwYXJhbXMuZ29hbCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBJbnRlbnRBbmFseXRpY3MubG9nRXJyb3IoJ05vIGdvYWwgc3VwcGxpZWQgZm9yIFlhbmRleE1ldHJpa2EudHJhY2s6ICcgKyBKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jb3VudGVyLnJlYWNoR29hbChcbiAgICAgIHBhcmFtcy5nb2FsLFxuICAgICAgcGFyYW1zLnBhcmFtcyB8fCB7fVxuICAgICk7XG4gIH1cblxuICBzZW5kVmFyaWFibGVzKHZhcmlhYmxlcykge1xuICAgIHRoaXMuY291bnRlci5wYXJhbXModmFyaWFibGVzKTtcbiAgfVxufVxuXG5leHBvcnQge1lhbmRleE1ldHJpa2F9O1xuIiwiaW1wb3J0IHtFdmVudEludGVyZmFjZX0gZnJvbSAnLi9FdmVudEludGVyZmFjZSc7XG5pbXBvcnQge1RZUEVfR0EsIFRZUEVfWUEsIFRZUEVfUEl9IGZyb20gJy4uL2NvdW50ZXJzL0NvdW50ZXJJbnRlcmZhY2UnO1xuXG5jbGFzcyBDbGljayBleHRlbmRzIEV2ZW50SW50ZXJmYWNlIHtcbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChvcHRpb25zKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0b3JzJykpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5zZWxlY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcSA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3JzW2ldKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgcS5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcVtpaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHRoaXMuZXZlbnRIYW5kbGVyKGV2ZW50KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlclxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIGV2ZW50SGFuZGxlcihldmVudCkge1xuICAgICAgICB0aGlzLnNlbmREYXRhKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHRyaWdnZXIocGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLnRyaWdnZXIocGFyYW1zKTtcbiAgICAgICAgdGhpcy5zZW5kRGF0YSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgc2VuZERhdGEoKSB7XG4gICAgICAgIGZvciAobGV0IGNvdW50ZXIgb2YgdGhpcy5sb2NhdG9yLmNvdW50ZXJzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBpZiAoVFlQRV9HQSA9PSBjb3VudGVyLnR5cGUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dbY291bnRlci5qc09iamVjdF0oJ3NlbmQnLCAnZXZlbnQnLCAnQWN0aW9uJywgJ2NsaWNrJywgJ0NsaWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7Q2xpY2t9O1xuIiwiY2xhc3MgRXZlbnRJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsb2NhdG9yIFVuaW9uQW5hbHl0aWNzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihsb2NhdG9yLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMubG9jYXRvciA9IGxvY2F0b3I7XG4gICAgICAgIHRoaXMuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHRyaWdnZXIocGFyYW1zKSB7XG4gICAgfVxufVxuXG5leHBvcnQge0V2ZW50SW50ZXJmYWNlfTtcbiJdfQ==
