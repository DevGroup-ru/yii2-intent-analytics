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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;
var counters = new Map();
var events = new Map();
var moduleMap = new Map();

var UnionAnalytics = function () {
  /**
   * Singleton
   * @return {*}
   */

  function UnionAnalytics() {
    _classCallCheck(this, UnionAnalytics);

    if (!instance) {
      instance = this;
    }

    return instance;
  }

  /**
   * Singleton
   * @return {UnionAnalytics}
   */


  _createClass(UnionAnalytics, [{
    key: "addModule",


    /**
     * Add module
     * @param jsModule
     * @param jsObject
     * @return {UnionAnalytics}
     */
    value: function addModule(jsModule, jsObject) {
      moduleMap.set(jsModule, jsObject);

      return this;
    }

    /**
     * Add counter
     * @param id
     * @param jsModule
     * @param jsObject
     * @param options
     * @return {UnionAnalytics}
     */

  }, {
    key: "addCounter",
    value: function addCounter(id, jsModule, jsObject, options) {
      if (!moduleMap.has(jsModule)) {
        return this;
      }
      jsModule = moduleMap.get(jsModule);
      counters.set(id, new jsModule(this, jsObject, options));

      return this;
    }

    /**
     * Add event
     * @param jsModule
     * @param type
     * @param options
     * @return {UnionAnalytics}
     */

  }, {
    key: "addEvent",
    value: function addEvent(jsModule, type, options) {
      if (!moduleMap.has(jsModule)) {
        return this;
      }
      jsModule = moduleMap.get(jsModule);

      var _array = events.has(type) ? events.get(type) : [];
      _array.push(new jsModule(this, options));
      events.set(type, _array);

      return this;
    }

    /**
     * Add counters
     * @param counters
     * @return {UnionAnalytics}
     */

  }, {
    key: "addCounters",
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

      return this;
    }

    /**
     * Add events
     * @param events
     * @return {UnionAnalytics}
     */

  }, {
    key: "addEvents",
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

      return this;
    }

    /**
     * Trigger an event
     * @param type
     * @param params
     * @return {UnionAnalytics}
     */

  }, {
    key: "trigger",
    value: function trigger(type, params) {
      var _array = events.has(type) ? events.get(type) : [];
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

      return this;
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!instance) {
        instance = new UnionAnalytics();
      }

      return instance;
    }
  }]);

  return UnionAnalytics;
}();

exports.UnionAnalytics = UnionAnalytics;

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _IntentAnalytics = require('./IntentAnalytics');

var _UnionAnalytics = require('./UnionAnalytics');

var _CounterGoogleAnalytics = require('./counters/CounterGoogleAnalytics');

var _CounterYandexMetrika = require('./counters/CounterYandexMetrika');

var _CounterPiwik = require('./counters/CounterPiwik');

var _Click = require('./events/Click');

var ua = new _UnionAnalytics.UnionAnalytics();
ua.addModule('CounterGoogleAnalytics', _CounterGoogleAnalytics.CounterGoogleAnalytics);
ua.addModule('CounterYandexMetrika', _CounterYandexMetrika.CounterYandexMetrika);
ua.addModule('CounterPiwik', _CounterPiwik.CounterPiwik);
ua.addModule('Click', _Click.Click);

global.intentAnalytics = new _IntentAnalytics.IntentAnalytics();
global.UnionAnalytics = _UnionAnalytics.UnionAnalytics;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./IntentAnalytics":1,"./UnionAnalytics":2,"./counters/CounterGoogleAnalytics":5,"./counters/CounterPiwik":7,"./counters/CounterYandexMetrika":8,"./events/Click":11}],4:[function(require,module,exports){
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

        /**
         * @param options
         */
        value: function init(options) {
            _get(Object.getPrototypeOf(CounterGoogleAnalytics.prototype), 'init', this).call(this, options);
        }

        /**
         * @param name
         * @return {{}}
         */

    }, {
        key: 'resolveJsObject',
        value: function resolveJsObject(name) {
            return window[name] || _get(Object.getPrototypeOf(CounterGoogleAnalytics.prototype), 'resolveJsObject', this).call(this, name);
        }

        /**
         * @param event
         * @param data
         * @param params
         */

    }, {
        key: 'sendEvent',
        value: function sendEvent(event, data, params) {
            // this.jsObject('send', 'event', );
        }
    }]);

    return CounterGoogleAnalytics;
}(_CounterInterface2.CounterInterface);

exports.CounterGoogleAnalytics = CounterGoogleAnalytics;

},{"./CounterInterface":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CounterInterface = function () {
  /**
   * @param locator
   * @param jsObject
   * @param options
   */

  function CounterInterface(locator, jsObject, options) {
    _classCallCheck(this, CounterInterface);

    this.locator = locator;
    this.jsObject = this.resolveJsObject(jsObject);
    this.rawOptions = options;
    this.init(options);
  }

  /**
   * Init
   * @param options
   */


  _createClass(CounterInterface, [{
    key: "init",
    value: function init(options) {}

    /**
     * @param name
     * @return {{}}
     */

  }, {
    key: "resolveJsObject",
    value: function resolveJsObject(name) {
      return {};
    }

    /**
     * Send event
     * @param event
     * @param data
     * @param params
     */

  }, {
    key: "sendEvent",
    value: function sendEvent(event, data, params) {}
  }]);

  return CounterInterface;
}();

exports.CounterInterface = CounterInterface;

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

    /**
     * @param options
     */
    value: function init(options) {
      _get(Object.getPrototypeOf(CounterPiwik.prototype), 'init', this).call(this, options);
    }

    /**
     * @param name
     * @return {{}}
     */

  }, {
    key: 'resolveJsObject',
    value: function resolveJsObject(name) {
      return window[name] || _get(Object.getPrototypeOf(CounterPiwik.prototype), 'resolveJsObject', this).call(this, name);
    }

    /**
     * @param event
     * @param data
     * @param params
     */

  }, {
    key: 'sendEvent',
    value: function sendEvent(event, data, params) {}
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

        /**
         * @param options
         */
        value: function init(options) {
            _get(Object.getPrototypeOf(CounterYandexMetrika.prototype), 'init', this).call(this, options);
        }

        /**
         * @param name
         * @return {{}}
         */

    }, {
        key: 'resolveJsObject',
        value: function resolveJsObject(name) {
            return window['yaCounter' + name] || _get(Object.getPrototypeOf(CounterYandexMetrika.prototype), 'resolveJsObject', this).call(this, name);
        }

        /**
         * @param event
         * @param data
         * @param params
         */

    }, {
        key: 'sendEvent',
        value: function sendEvent(event, data, params) {
            // this.jsObject.reachGoal(event, params || {});
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
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = options.selectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var selector = _step.value;

                        var elements = window.document.querySelectorAll(selector);
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var el = _step2.value;

                                el.addEventListener('click', function (event) {
                                    return _this2.eventHandler(event);
                                });
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
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.locator.counters.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var counter = _step3.value;

                    counter.sendEvent('click', {}, {});
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

    return Click;
}(_EventInterface2.EventInterface);

exports.Click = Click;

},{"./EventInterface":12}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9JbnRlbnRBbmFseXRpY3MuanMiLCJqcy9VbmlvbkFuYWx5dGljcy5qcyIsImpzL2FwcC5qcyIsImpzL2NvdW50ZXJzL0Fic3RyYWN0Q291bnRlci5qcyIsImpzL2NvdW50ZXJzL0NvdW50ZXJHb29nbGVBbmFseXRpY3MuanMiLCJqcy9jb3VudGVycy9Db3VudGVySW50ZXJmYWNlLmpzIiwianMvY291bnRlcnMvQ291bnRlclBpd2lrLmpzIiwianMvY291bnRlcnMvQ291bnRlcllhbmRleE1ldHJpa2EuanMiLCJqcy9jb3VudGVycy9Hb29nbGVBbmFseXRpY3MuanMiLCJqcy9jb3VudGVycy9ZYW5kZXhNZXRyaWthLmpzIiwianMvZXZlbnRzL0NsaWNrLmpzIiwianMvZXZlbnRzL0V2ZW50SW50ZXJmYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7OztJQUVNLGU7QUFDSiw2QkFBYztBQUFBOztBQUNaLFNBQUssY0FBTDtBQUNEOzs7O3FDQUVnQjtBQUNmLFdBQUssWUFBTCxHQUFvQixFQUFwQjtBQUNBLFdBQUssV0FBTCxHQUFtQixFQUFuQjtBQUNEOzs7eUJBRUksWSxFQUFjO0FBQ2pCLFdBQUssSUFBTSxXQUFYLElBQTBCLFlBQTFCLEVBQXdDO0FBQ3RDLFlBQUksYUFBYSxjQUFiLENBQTRCLFdBQTVCLE1BQTZDLEtBQWpELEVBQXdEO0FBQ3REO0FBQ0Q7QUFDRCxZQUFNLFVBQVUsYUFBYSxXQUFiLENBQWhCO0FBQ0EsWUFBTSxlQUFlLGdCQUFnQixhQUFoQixDQUE4QixPQUE5QixFQUF1QyxXQUF2QyxDQUFyQjtBQUNBLFlBQUksaUJBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLGVBQUssWUFBTCxDQUFrQixXQUFsQixJQUFpQyxZQUFqQztBQUNEO0FBQ0Y7QUFDRjs7OytCQWFVLFcsRUFBYSxZLEVBQWMsUSxFQUFVO0FB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Ozs7O2dDQUtPLE0sRUFBUTtBQUNaLHFGQUFjLE1BQWQ7QUFDQSxpQkFBSyxRQUFMO0FBQ0g7Ozs7Ozs7O21DQUtVO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ1Asc0NBQW9CLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsTUFBdEIsRUFBcEIsbUlBQW9EO0FBQUEsd0JBQTNDLE9BQTJDOztBQUNoRCw0QkFBUSxTQUFSLENBQWtCLE9BQWxCLEVBQTJCLEVBQTNCLEVBQStCLEVBQS9CO0FBQ0g7QUFITTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSVY7Ozs7OztRQUdHLEssR0FBQSxLOzs7Ozs7Ozs7Ozs7O0lDMUNGLGM7Ozs7OztBQUtGLDBCQUFZLE9BQVosRUFBcUIsT0FBckIsRUFBOEI7QUFBQTs7QUFDMUIsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFNBQUssSUFBTCxDQUFVLE9BQVY7QUFDSDs7Ozs7Ozs7Ozt5QkFNSSxPLEVBQVMsQ0FDYjs7Ozs7Ozs7OzRCQU1PLE0sRUFBUSxDQUNmOzs7Ozs7UUFHRyxjLEdBQUEsYyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0dvb2dsZUFuYWx5dGljc30gZnJvbSAnLi9jb3VudGVycy9Hb29nbGVBbmFseXRpY3MnO1xuaW1wb3J0IHtZYW5kZXhNZXRyaWthfSBmcm9tICcuL2NvdW50ZXJzL1lhbmRleE1ldHJpa2EnO1xuXG5jbGFzcyBJbnRlbnRBbmFseXRpY3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zKCk7XG4gIH1cblxuICBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICB0aGlzLmNvdW50ZXJzTGlzdCA9IHt9O1xuICAgIHRoaXMuYWN0aW9uUXVldWUgPSB7fTtcbiAgfVxuXG4gIGluaXQoY291bnRlcnNMaXN0KSB7XG4gICAgZm9yIChjb25zdCBjb3VudGVyVHlwZSBpbiBjb3VudGVyc0xpc3QpIHtcbiAgICAgIGlmIChjb3VudGVyc0xpc3QuaGFzT3duUHJvcGVydHkoY291bnRlclR5cGUpID09PSBmYWxzZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvdW50ZXIgPSBjb3VudGVyc0xpc3RbY291bnRlclR5cGVdO1xuICAgICAgY29uc3QgY291bnRlckNsYXNzID0gSW50ZW50QW5hbHl0aWNzLmNyZWF0ZUNvdW50ZXIoY291bnRlciwgY291bnRlclR5cGUpO1xuICAgICAgaWYgKGNvdW50ZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV0gPSBjb3VudGVyQ2xhc3M7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUNvdW50ZXIoY291bnRlciwgY291bnRlclR5cGUpIHtcbiAgICBzd2l0Y2ggKGNvdW50ZXJUeXBlKSB7XG4gICAgY2FzZSAnR29vZ2xlQW5hbHl0aWNzJzpcbiAgICAgIHJldHVybiBuZXcgR29vZ2xlQW5hbHl0aWNzKGNvdW50ZXIuamF2YXNjcmlwdE9iamVjdE5hbWUsIGNvdW50ZXIpO1xuICAgIGNhc2UgJ1lhbmRleE1ldHJpa2EnOlxuICAgICAgcmV0dXJuIG5ldyBZYW5kZXhNZXRyaWthKGNvdW50ZXIuamF2YXNjcmlwdE9iamVjdE5hbWUsIGNvdW50ZXIpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGRUb1F1ZXVlKGNvdW50ZXJUeXBlLCBmdW5jdGlvbk5hbWUsIGFyZ3VtZW50KSB7XG4gICAgaWYgKHR5cGVvZih0aGlzLmFjdGlvblF1ZXVlW2NvdW50ZXJUeXBlXSkgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLmFjdGlvblF1ZXVlW2NvdW50ZXJUeXBlXSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmFjdGlvblF1ZXVlW2NvdW50ZXJUeXBlXS5wdXNoKHtcbiAgICAgICdmdW5jdGlvbk5hbWUnOiBmdW5jdGlvbk5hbWUsXG4gICAgICAnYXJndW1lbnQnOiBhcmd1bWVudCxcbiAgICB9KTtcbiAgfVxuXG4gIGNoZWNrVW5oYW5kbGVkKCkge1xuICAgIGZvciAoY29uc3QgY291bnRlclR5cGUgaW4gdGhpcy5hY3Rpb25RdWV1ZSkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uUXVldWUuaGFzT3duUHJvcGVydHkoY291bnRlclR5cGUpICYmIHR5cGVvZih0aGlzLmFjdGlvblF1ZXVlW2NvdW50ZXJUeXBlXSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIC5jb3VudGVyIGdldHRlciB3aWxsIGNoZWNrIGlmIGNvdW50ZXIgZ2xvYmFsIG9iamVjdChpZS4gZ2EsIHlhQ291bnRlcikgbm93IGV4aXN0c1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyc0xpc3QuaGFzT3duUHJvcGVydHkoY291bnRlclR5cGUpICYmIHRoaXMuY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXS5jb3VudGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCBxdWV1ZUl0ZW1zIG9mIHRoaXMgY291bnRlclxuICAgICAgICAgIGNvbnN0IGNvdW50ZXJDbGFzcyA9IHRoaXMuY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHF1ZXVlSXRlbSBvZiB0aGlzLmFjdGlvblF1ZXVlW2NvdW50ZXJUeXBlXSkge1xuICAgICAgICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gcXVldWVJdGVtLmZ1bmN0aW9uTmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3VtZW50ID0gcXVldWVJdGVtLmFyZ3VtZW50O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY291bnRlckNsYXNzW2Z1bmN0aW9uTmFtZV0oYXJndW1lbnQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBJbnRlbnRBbmFseXRpY3MubG9nRXJyb3IoYEV4Y2VwdGlvbiBkdXJpbmcgcXVldWVkICR7ZnVuY3Rpb25OYW1lfSBjYWxsOiAke0pTT04uc3RyaW5naWZ5KGUpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBkaXNhYmxlIHF1ZXVlIGZvciB0aGlzIGNvdW50ZXIgYXMgaXQgaXMgbm90IG5lZWRlZCBhbnltb3JlXG4gICAgICAgICAgLy8gYWxsIG5leHQgY2FsbHMgdG8gdGhpcyBjb3VudGVyIHNob3VsZCBiZSBoYW5kbGVkIG9rXG4gICAgICAgICAgdGhpcy5hY3Rpb25RdWV1ZVtjb3VudGVyVHlwZV0gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRyYWNrKGNvdW50ZXJzSW5zdHJ1Y3Rpb25zKSB7XG4gICAgdGhpcy5jaGVja1VuaGFuZGxlZCgpO1xuICAgIGZvciAoY29uc3QgY291bnRlclR5cGUgaW4gY291bnRlcnNJbnN0cnVjdGlvbnMpIHtcbiAgICAgIGlmIChjb3VudGVyc0luc3RydWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShjb3VudGVyVHlwZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IGNvdW50ZXJzSW5zdHJ1Y3Rpb25zW2NvdW50ZXJUeXBlXTtcbiAgICAgIGlmICh0aGlzLmNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV0uY291bnRlciA9PT0gbnVsbCkge1xuICAgICAgICAvLyBpZiBnbG9iYWwganMgb2JqZWN0IG9mIGNvdW50ZXIgaXMgbm90IGxvYWRlZCAtIHRoaXMgd2lsbCBhZGQgaXQgdG8gcXVldWVcbiAgICAgICAgdGhpcy5hZGRUb1F1ZXVlKGNvdW50ZXJUeXBlLCAndHJhY2snLCBpbnN0cnVjdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyc0xpc3QuaGFzT3duUHJvcGVydHkoY291bnRlclR5cGUpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXS50cmFjayhpbnN0cnVjdGlvbik7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKCdFeGNlcHRpb24gZHVyaW5nIHRyYWNrIGNhbGw6ICcgKyBKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2VuZFZhcmlhYmxlcyh2YXJpYWJsZXMpIHtcbiAgICB0aGlzLmNoZWNrVW5oYW5kbGVkKCk7XG4gICAgZm9yIChjb25zdCBjb3VudGVyVHlwZSBpbiB0aGlzLmNvdW50ZXJzTGlzdCkge1xuICAgICAgaWYgKHRoaXMuY291bnRlcnNMaXN0Lmhhc093blByb3BlcnR5KGNvdW50ZXJUeXBlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBjb3VudGVyID0gdGhpcy5jb3VudGVyc0xpc3RbY291bnRlclR5cGVdO1xuICAgICAgaWYgKGNvdW50ZXIuY291bnRlciA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmFkZFRvUXVldWUoY291bnRlclR5cGUsICdzZW5kVmFyaWFibGVzJywgdmFyaWFibGVzKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvdW50ZXIuc2VuZFZhcmlhYmxlcyh2YXJpYWJsZXMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBJbnRlbnRBbmFseXRpY3MubG9nRXJyb3IoJ0V4Y2VwdGlvbiBkdXJpbmcgc2VuZFZhcmlhYmxlcyBjYWxsOiAnICsgSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBsb2dFcnJvcihtZXNzYWdlKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgIGlmICh0eXBlb2YoY29uc29sZSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gICAgLyplc2xpbnQtZW5hYmxlKi9cbiAgfVxufVxuXG5leHBvcnQge0ludGVudEFuYWx5dGljc307XG4iLCJsZXQgaW5zdGFuY2UgPSBudWxsO1xubGV0IGNvdW50ZXJzID0gbmV3IE1hcCgpO1xubGV0IGV2ZW50cyA9IG5ldyBNYXAoKTtcbmxldCBtb2R1bGVNYXAgPSBuZXcgTWFwKCk7XG5cbmNsYXNzIFVuaW9uQW5hbHl0aWNzIHtcbiAgLyoqXG4gICAqIFNpbmdsZXRvblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW5nbGV0b25cbiAgICogQHJldHVybiB7VW5pb25BbmFseXRpY3N9XG4gICAqL1xuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBuZXcgVW5pb25BbmFseXRpY3MoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG1vZHVsZVxuICAgKiBAcGFyYW0ganNNb2R1bGVcbiAgICogQHBhcmFtIGpzT2JqZWN0XG4gICAqIEByZXR1cm4ge1VuaW9uQW5hbHl0aWNzfVxuICAgKi9cbiAgYWRkTW9kdWxlKGpzTW9kdWxlLCBqc09iamVjdCkge1xuICAgIG1vZHVsZU1hcC5zZXQoanNNb2R1bGUsIGpzT2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBjb3VudGVyXG4gICAqIEBwYXJhbSBpZFxuICAgKiBAcGFyYW0ganNNb2R1bGVcbiAgICogQHBhcmFtIGpzT2JqZWN0XG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqIEByZXR1cm4ge1VuaW9uQW5hbHl0aWNzfVxuICAgKi9cbiAgYWRkQ291bnRlcihpZCwganNNb2R1bGUsIGpzT2JqZWN0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFtb2R1bGVNYXAuaGFzKGpzTW9kdWxlKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGpzTW9kdWxlID0gbW9kdWxlTWFwLmdldChqc01vZHVsZSk7XG4gICAgY291bnRlcnMuc2V0KGlkLCBuZXcganNNb2R1bGUodGhpcywganNPYmplY3QsIG9wdGlvbnMpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBldmVudFxuICAgKiBAcGFyYW0ganNNb2R1bGVcbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICogQHJldHVybiB7VW5pb25BbmFseXRpY3N9XG4gICAqL1xuICBhZGRFdmVudChqc01vZHVsZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIGlmICghbW9kdWxlTWFwLmhhcyhqc01vZHVsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBqc01vZHVsZSA9IG1vZHVsZU1hcC5nZXQoanNNb2R1bGUpO1xuXG4gICAgbGV0IF9hcnJheSA9IGV2ZW50cy5oYXModHlwZSkgPyBldmVudHMuZ2V0KHR5cGUpIDogW107XG4gICAgX2FycmF5LnB1c2gobmV3IGpzTW9kdWxlKHRoaXMsIG9wdGlvbnMpKTtcbiAgICBldmVudHMuc2V0KHR5cGUsIF9hcnJheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY291bnRlcnNcbiAgICogQHBhcmFtIGNvdW50ZXJzXG4gICAqIEByZXR1cm4ge1VuaW9uQW5hbHl0aWNzfVxuICAgKi9cbiAgYWRkQ291bnRlcnMoY291bnRlcnMpIHtcbiAgICBmb3IgKGxldCBjb3VudGVyIG9mIGNvdW50ZXJzKSB7XG4gICAgICB0aGlzLmFkZENvdW50ZXIoY291bnRlci5pZCwgY291bnRlci5qc01vZHVsZSwgY291bnRlci5qc09iamVjdCwgY291bnRlci5vcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZXZlbnRzXG4gICAqIEBwYXJhbSBldmVudHNcbiAgICogQHJldHVybiB7VW5pb25BbmFseXRpY3N9XG4gICAqL1xuICBhZGRFdmVudHMoZXZlbnRzKSB7XG4gICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICB0aGlzLmFkZEV2ZW50KGV2ZW50LmpzTW9kdWxlLCBldmVudC50eXBlLCBldmVudC5vcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFuIGV2ZW50XG4gICAqIEBwYXJhbSB0eXBlXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7VW5pb25BbmFseXRpY3N9XG4gICAqL1xuICB0cmlnZ2VyKHR5cGUsIHBhcmFtcykge1xuICAgIGxldCBfYXJyYXkgPSBldmVudHMuaGFzKHR5cGUpID8gZXZlbnRzLmdldCh0eXBlKSA6IFtdO1xuICAgIGZvciAobGV0IGV2ZW50IG9mIF9hcnJheSkge1xuICAgICAgZXZlbnQudHJpZ2dlcihwYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmV4cG9ydCB7VW5pb25BbmFseXRpY3N9O1xuIiwiaW1wb3J0IHtJbnRlbnRBbmFseXRpY3N9IGZyb20gJy4vSW50ZW50QW5hbHl0aWNzJztcbmltcG9ydCB7VW5pb25BbmFseXRpY3N9IGZyb20gJy4vVW5pb25BbmFseXRpY3MnO1xuXG5pbXBvcnQge0NvdW50ZXJHb29nbGVBbmFseXRpY3N9IGZyb20gJy4vY291bnRlcnMvQ291bnRlckdvb2dsZUFuYWx5dGljcyc7XG5pbXBvcnQge0NvdW50ZXJZYW5kZXhNZXRyaWthfSBmcm9tICcuL2NvdW50ZXJzL0NvdW50ZXJZYW5kZXhNZXRyaWthJztcbmltcG9ydCB7Q291bnRlclBpd2lrfSBmcm9tICcuL2NvdW50ZXJzL0NvdW50ZXJQaXdpayc7XG5pbXBvcnQge0NsaWNrfSBmcm9tICcuL2V2ZW50cy9DbGljayc7XG5cbmxldCB1YSA9IG5ldyBVbmlvbkFuYWx5dGljcygpO1xudWEuYWRkTW9kdWxlKCdDb3VudGVyR29vZ2xlQW5hbHl0aWNzJywgQ291bnRlckdvb2dsZUFuYWx5dGljcyk7XG51YS5hZGRNb2R1bGUoJ0NvdW50ZXJZYW5kZXhNZXRyaWthJywgQ291bnRlcllhbmRleE1ldHJpa2EpO1xudWEuYWRkTW9kdWxlKCdDb3VudGVyUGl3aWsnLCBDb3VudGVyUGl3aWspO1xudWEuYWRkTW9kdWxlKCdDbGljaycsIENsaWNrKTtcblxuZ2xvYmFsLmludGVudEFuYWx5dGljcyA9IG5ldyBJbnRlbnRBbmFseXRpY3MoKTtcbmdsb2JhbC5VbmlvbkFuYWx5dGljcyA9IFVuaW9uQW5hbHl0aWNzO1xuIiwiY2xhc3MgQWJzdHJhY3RDb3VudGVyIHtcbiAgLy8gSGVyZSB3ZSB0dXJuIG9mZiBuby11bnVzZWQtdmFycyB3YXJuaW5nIGJlY2F1c2UgdGhpcyBjbGFzcyBpcyBhY3R1YWxseSBhYnN0cmFjdC5cbiAgLy8gU28gdGhlcmUncyBhIGxvdCBvZiB1bnVzZWQgdmFycyBhbmQgaXQgaXMgbm9ybWFsIC0gd2UganVzdCB3YW50IHRvIGRlc2NyaWJlIHRoZSB3aG9sZSBpbnRlcmZhY2UuXG4gIC8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCovXG4gIGNvbnN0cnVjdG9yKGphdmFzY3JpcHRPYmplY3ROYW1lLCBwYXJhbXMpIHtcbiAgICB0aGlzLmphdmFzY3JpcHRPYmplY3ROYW1lID0gamF2YXNjcmlwdE9iamVjdE5hbWU7XG4gIH1cblxuICBzdGF0aWMgZ2V0Q291bnRlck9iamVjdChqYXZhc2NyaXB0T2JqZWN0TmFtZSkge1xuICAgIHJldHVybiB3aW5kb3dbamF2YXNjcmlwdE9iamVjdE5hbWVdIHx8IG51bGw7XG4gIH1cblxuICB0cmFjayhwYXJhbXMpIHtcbiAgfVxuXG4gIHNlbmRWYXJpYWJsZXModmFyaWFibGVzKSB7XG5cbiAgfVxuXG4gIGdldCBjb3VudGVyKCkge1xuICAgIHJldHVybiBBYnN0cmFjdENvdW50ZXIuZ2V0Q291bnRlck9iamVjdCh0aGlzLmphdmFzY3JpcHRPYmplY3ROYW1lKTtcbiAgfVxuXG59XG5cbmV4cG9ydCB7QWJzdHJhY3RDb3VudGVyfTtcbiIsImltcG9ydCB7Q291bnRlckludGVyZmFjZX0gZnJvbSAnLi9Db3VudGVySW50ZXJmYWNlJztcblxuY2xhc3MgQ291bnRlckdvb2dsZUFuYWx5dGljcyBleHRlbmRzIENvdW50ZXJJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJuIHt7fX1cbiAgICAgKi9cbiAgICByZXNvbHZlSnNPYmplY3QobmFtZSkge1xuICAgICAgICByZXR1cm4gd2luZG93W25hbWVdIHx8IHN1cGVyLnJlc29sdmVKc09iamVjdChuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBzZW5kRXZlbnQoZXZlbnQsIGRhdGEsIHBhcmFtcykge1xuICAgICAgICAvLyB0aGlzLmpzT2JqZWN0KCdzZW5kJywgJ2V2ZW50JywgKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7Q291bnRlckdvb2dsZUFuYWx5dGljc307XG4iLCJjbGFzcyBDb3VudGVySW50ZXJmYWNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbG9jYXRvclxuICAgICAqIEBwYXJhbSBqc09iamVjdFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobG9jYXRvciwganNPYmplY3QsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5sb2NhdG9yID0gbG9jYXRvcjtcbiAgICAgICAgdGhpcy5qc09iamVjdCA9IHRoaXMucmVzb2x2ZUpzT2JqZWN0KGpzT2JqZWN0KTtcbiAgICAgICAgdGhpcy5yYXdPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5pbml0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGluaXQob3B0aW9ucykge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybiB7e319XG4gICAgICovXG4gICAgcmVzb2x2ZUpzT2JqZWN0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTZW5kIGV2ZW50XG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICB9XG59XG5cbmV4cG9ydCB7Q291bnRlckludGVyZmFjZX07XG4iLCJpbXBvcnQge0NvdW50ZXJJbnRlcmZhY2V9IGZyb20gJy4vQ291bnRlckludGVyZmFjZSc7XG5cbmNsYXNzIENvdW50ZXJQaXdpayBleHRlbmRzIENvdW50ZXJJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4ge3t9fVxuICAgICAqL1xuICAgIHJlc29sdmVKc09iamVjdChuYW1lKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3dbbmFtZV0gfHwgc3VwZXIucmVzb2x2ZUpzT2JqZWN0KG5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHNlbmRFdmVudChldmVudCwgZGF0YSwgcGFyYW1zKSB7XG4gICAgfVxufVxuXG5leHBvcnQge0NvdW50ZXJQaXdpa307XG4iLCJpbXBvcnQge0NvdW50ZXJJbnRlcmZhY2V9IGZyb20gJy4vQ291bnRlckludGVyZmFjZSc7XG5cbmNsYXNzIENvdW50ZXJZYW5kZXhNZXRyaWthIGV4dGVuZHMgQ291bnRlckludGVyZmFjZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4ge3t9fVxuICAgICAqL1xuICAgIHJlc29sdmVKc09iamVjdChuYW1lKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3dbYHlhQ291bnRlciR7bmFtZX1gXSB8fCBzdXBlci5yZXNvbHZlSnNPYmplY3QobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gdGhpcy5qc09iamVjdC5yZWFjaEdvYWwoZXZlbnQsIHBhcmFtcyB8fCB7fSk7XG4gICAgfVxufVxuXG5leHBvcnQge0NvdW50ZXJZYW5kZXhNZXRyaWthfTtcbiIsImltcG9ydCB7QWJzdHJhY3RDb3VudGVyfSBmcm9tICcuL0Fic3RyYWN0Q291bnRlcic7XG5pbXBvcnQge0ludGVudEFuYWx5dGljc30gZnJvbSAnLi4vSW50ZW50QW5hbHl0aWNzJztcblxuY2xhc3MgR29vZ2xlQW5hbHl0aWNzIGV4dGVuZHMgQWJzdHJhY3RDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoamF2YXNjcmlwdE9iamVjdE5hbWUgPSAnZ2EnLCBwYXJhbXMgPSB7fSkge1xuICAgIHN1cGVyKGphdmFzY3JpcHRPYmplY3ROYW1lLCBwYXJhbXMpO1xuICAgIHRoaXMudHJhY2tlck5hbWUgPSBwYXJhbXMudHJhY2tlck5hbWUgfHwgJyc7XG4gIH1cblxuICBnZXQgdHJhY2tlclNlbmRQcmVmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2tlck5hbWUgfHwgJyc7XG4gIH1cblxuICB0cmFjayhwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mKHBhcmFtcy5hY3Rpb24pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKCdObyBhY3Rpb24gc3VwcGxpZWQgZm9yIEdvb2dsZUFuYWx5dGljcy50cmFjazogJyArIEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSB0aGlzLnRyYWNrZXJTZW5kUHJlZml4ICsgJ3NlbmQnO1xuXG4gICAgdGhpcy5jb3VudGVyKGZ1bmN0aW9uTmFtZSwge1xuICAgICAgJ2hpdFR5cGUnOiAnZXZlbnQnLFxuICAgICAgJ2V2ZW50Q2F0ZWdvcnknOiBwYXJhbXMuY2F0ZWdvcnkgfHwgJ2NvbW1vbicsXG4gICAgICAnZXZlbnRBY3Rpb24nOiBwYXJhbXMuYWN0aW9uLFxuICAgICAgJ2V2ZW50TGFiZWwnOiBwYXJhbXMubGFiZWwgfHwgdW5kZWZpbmVkLFxuICAgICAgJ2V2ZW50VmFsdWUnOiBwYXJhbXMudmFsdWUgfHwgdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG5cbiAgc2VuZFZhcmlhYmxlcyh2YXJpYWJsZXMpIHtcbiAgICAvLyEgQHRvZG8gVGhpbmsgb2YgYmlnIGRlcHRoIC0gZ2EgZG9lc24ndCBhY2NlcHQgaXQuXG4gICAgdGhpcy5jb3VudGVyKHRoaXMudHJhY2tlclNlbmRQcmVmaXggKyAnc2V0JywgdmFyaWFibGVzKTtcbiAgfVxufVxuXG5leHBvcnQge0dvb2dsZUFuYWx5dGljc307XG4iLCJpbXBvcnQge0Fic3RyYWN0Q291bnRlcn0gZnJvbSAnLi9BYnN0cmFjdENvdW50ZXInO1xuaW1wb3J0IHtJbnRlbnRBbmFseXRpY3N9IGZyb20gJy4uL0ludGVudEFuYWx5dGljcyc7XG5cbmNsYXNzIFlhbmRleE1ldHJpa2EgZXh0ZW5kcyBBYnN0cmFjdENvdW50ZXIge1xuICBjb25zdHJ1Y3RvcihqYXZhc2NyaXB0T2JqZWN0TmFtZSwgcGFyYW1zKSB7XG4gICAgc3VwZXIoamF2YXNjcmlwdE9iamVjdE5hbWUsIHBhcmFtcyk7XG4gIH1cblxuICB0cmFjayhwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mKHBhcmFtcy5nb2FsKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIEludGVudEFuYWx5dGljcy5sb2dFcnJvcignTm8gZ29hbCBzdXBwbGllZCBmb3IgWWFuZGV4TWV0cmlrYS50cmFjazogJyArIEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNvdW50ZXIucmVhY2hHb2FsKFxuICAgICAgcGFyYW1zLmdvYWwsXG4gICAgICBwYXJhbXMucGFyYW1zIHx8IHt9XG4gICAgKTtcbiAgfVxuXG4gIHNlbmRWYXJpYWJsZXModmFyaWFibGVzKSB7XG4gICAgdGhpcy5jb3VudGVyLnBhcmFtcyh2YXJpYWJsZXMpO1xuICB9XG59XG5cbmV4cG9ydCB7WWFuZGV4TWV0cmlrYX07XG4iLCJpbXBvcnQge0V2ZW50SW50ZXJmYWNlfSBmcm9tICcuL0V2ZW50SW50ZXJmYWNlJztcblxuY2xhc3MgQ2xpY2sgZXh0ZW5kcyBFdmVudEludGVyZmFjZSB7XG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3NlbGVjdG9ycycpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzZWxlY3RvciBvZiBvcHRpb25zLnNlbGVjdG9ycykge1xuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbCBvZiBlbGVtZW50cykge1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4gdGhpcy5ldmVudEhhbmRsZXIoZXZlbnQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgZXZlbnRIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2VuZERhdGEoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgdHJpZ2dlcihwYXJhbXMpIHtcbiAgICAgICAgc3VwZXIudHJpZ2dlcihwYXJhbXMpO1xuICAgICAgICB0aGlzLnNlbmREYXRhKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBzZW5kRGF0YSgpIHtcbiAgICAgICAgZm9yIChsZXQgY291bnRlciBvZiB0aGlzLmxvY2F0b3IuY291bnRlcnMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGNvdW50ZXIuc2VuZEV2ZW50KCdjbGljaycsIHt9LCB7fSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7Q2xpY2t9O1xuIiwiY2xhc3MgRXZlbnRJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsb2NhdG9yIFVuaW9uQW5hbHl0aWNzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihsb2NhdG9yLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMubG9jYXRvciA9IGxvY2F0b3I7XG4gICAgICAgIHRoaXMuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHRyaWdnZXIocGFyYW1zKSB7XG4gICAgfVxufVxuXG5leHBvcnQge0V2ZW50SW50ZXJmYWNlfTtcbiJdfQ==
