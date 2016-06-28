(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var IntentAnalytics = function () {
    /**
     * Singleton
     * @return {*}
     */

    function IntentAnalytics() {
        _classCallCheck(this, IntentAnalytics);

        if (null === instance || false === instance instanceof this) {
            this.counters = new Map();
            this.events = new Map();
            this.moduleMap = new Map();
            instance = this;
        }
    }

    /**
     * Add module
     * @param jsModule
     * @param jsObject
     * @return {IntentAnalytics}
     */


    _createClass(IntentAnalytics, [{
        key: 'addModule',
        value: function addModule(jsModule, jsObject) {
            this.moduleMap.set(jsModule, jsObject);

            return this;
        }

        /**
         * Add counter
         * @param counter
         * @return {IntentAnalytics}
         */

    }, {
        key: 'addCounter',
        value: function addCounter(counter) {
            var has = Object.prototype.hasOwnProperty;
            if (false === has.call(counter, 'jsModule') || false === this.moduleMap.has(counter.jsModule)) {
                return this;
            }
            var jsModule = this.moduleMap.get(counter.jsModule);
            this.counters.set(counter.id, new jsModule(this, counter));

            return this;
        }

        /**
         * Add event
         * @param jsModule
         * @param type
         * @param options
         * @return {IntentAnalytics}
         */

    }, {
        key: 'addEvent',
        value: function addEvent(_ref) {
            var jsModule = _ref.jsModule;
            var type = _ref.type;
            var _ref$options = _ref.options;
            var options = _ref$options === undefined ? {} : _ref$options;

            if (!this.moduleMap.has(jsModule)) {
                return this;
            }
            jsModule = this.moduleMap.get(jsModule);

            var _array = this.events.has(type) ? this.events.get(type) : [];
            _array.push(new jsModule(this, options));
            this.events.set(type, _array);

            return this;
        }

        /**
         * Add counters
         * @param countersArray
         * @return {IntentAnalytics}
         */

    }, {
        key: 'addCounters',
        value: function addCounters(countersArray) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = countersArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var counter = _step.value;

                    this.addCounter(counter);
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
         * @return {IntentAnalytics}
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

                    this.addEvent(event);
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
    }], [{
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

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var _IntentAnalytics = require('./IntentAnalytics');

var _GoogleAnalytics = require('./counters/GoogleAnalytics');

var _YandexMetrika = require('./counters/YandexMetrika');

var _Piwik = require('./counters/Piwik');

var _Click = require('./events/Click');

var _Submit = require('./events/Submit');

var ua = new _IntentAnalytics.IntentAnalytics();
ua.addModule('GoogleAnalytics', _GoogleAnalytics.GoogleAnalytics);
ua.addModule('YandexMetrika', _YandexMetrika.YandexMetrika);
ua.addModule('Piwik', _Piwik.Piwik);
ua.addModule('Click', _Click.Click);
ua.addModule('Submit', _Submit.Submit);
//global.intentAnalytics = new IntentAnalytics();
global.IntentAnalytics = ua;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./IntentAnalytics":1,"./counters/GoogleAnalytics":4,"./counters/Piwik":5,"./counters/YandexMetrika":6,"./events/Click":7,"./events/Submit":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CounterInterface = function () {

  /**
   * Here we turn off no-unused-vars warning because this class is actually abstract.
   * So there's a lot of unused vars and it is normal - we just want to describe the whole interface.
   *
   * eslint no-unused-vars: 0
   *
   * @param locator {IntentAnalytics}
   * @param counter
   */

  function CounterInterface(locator, counter) {
    _classCallCheck(this, CounterInterface);

    Object.assign(this, counter);
    this.counterSet = false;
    this.locator = locator;
    this.init(counter.options);
    this.resolveJsObject(counter.jsObject);
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GoogleAnalytics = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CounterInterface2 = require('./CounterInterface');

var _IntentAnalytics = require('../IntentAnalytics');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GoogleAnalytics = function (_CounterInterface) {
    _inherits(GoogleAnalytics, _CounterInterface);

    function GoogleAnalytics() {
        _classCallCheck(this, GoogleAnalytics);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(GoogleAnalytics).apply(this, arguments));
    }

    _createClass(GoogleAnalytics, [{
        key: 'init',

        /**
         * @param options
         */
        value: function init(options) {
            _get(Object.getPrototypeOf(GoogleAnalytics.prototype), 'init', this).call(this, options);
        }

        /**
         * @param name
         * @return {{}}
         */

    }, {
        key: 'resolveJsObject',
        value: function resolveJsObject(name) {
            var _this2 = this;

            if (typeof window[name] === "function") {
                window[name](function () {
                    try {
                        _this2.jsObject = window[name].getByName(_this2.title);
                        _this2.counterSet = true;
                    } catch ($e) {
                        _IntentAnalytics.IntentAnalytics.logError('Cant initialize GoogleCounter with title \'' + _this2.title + '\'');
                    }
                });
            } else {
                _IntentAnalytics.IntentAnalytics.logError('Global Google Analytics function \'' + name + '\' not found!');
            }
        }

        /**
         * @param event
         * @param data
         * @param params
         */

    }, {
        key: 'sendEvent',
        value: function sendEvent(event, data, params) {
            console.log(_typeof(this.jsObject));
            // this.jsObject('send', 'event', );
        }
    }]);

    return GoogleAnalytics;
}(_CounterInterface2.CounterInterface);

exports.GoogleAnalytics = GoogleAnalytics;

},{"../IntentAnalytics":1,"./CounterInterface":3}],5:[function(require,module,exports){
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

},{"./CounterInterface":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.YandexMetrika = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CounterInterface2 = require('./CounterInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YandexMetrika = function (_CounterInterface) {
    _inherits(YandexMetrika, _CounterInterface);

    function YandexMetrika() {
        _classCallCheck(this, YandexMetrika);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(YandexMetrika).apply(this, arguments));
    }

    _createClass(YandexMetrika, [{
        key: 'init',

        /**
         * @param options
         */
        value: function init(options) {
            this.eventsQueue = new Map();
            _get(Object.getPrototypeOf(YandexMetrika.prototype), 'init', this).call(this, options);
        }

        /**
         * @param name
         * @return {{}}
         */

    }, {
        key: 'resolveJsObject',
        value: function resolveJsObject(name) {
            var _this2 = this;

            document.addEventListener(String('' + name + this.counterId + 'inited').toLowerCase(), function () {
                if ('undefined' !== typeof window[name + _this2.counterId]) {
                    _this2.jsObject = window[name + _this2.counterId];
                    _this2.counterSet = true;
                } else {
                    IntentAnalytics.logError('Cant initialize YandexCounter with id \'' + _this2.counterId + '\'');
                }
            });
        }

        /**
         * @param event
         * @param data
         * @param params
         */

    }, {
        key: 'sendEvent',
        value: function sendEvent(event, data, params) {
            //some kind of queue for Yandex before counter not yet initialized
            //Google has own queue
            if (false === this.counterSet) {
                this.eventsQueue.set(Symbol(), { event: event, data: data, params: params });
            } else {
                if (this.eventsQueue.size > 0) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.eventsQueue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _step$value = _slicedToArray(_step.value, 2);

                            var key = _step$value[0];
                            var value = _step$value[1];

                            this.send(value);
                            this.eventsQueue.delete(key);
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
                this.send({ event: event, data: data, params: params });
            }
        }

        /**
         * @param event
         * @param data
         * @param params
         */

    }, {
        key: 'send',
        value: function send(_ref) {
            var event = _ref.event;
            var data = _ref.data;
            var params = _ref.params;

            console.log(event);
            //this.jsObject.reachGoal(event, params || {});
        }
    }]);

    return YandexMetrika;
}(_CounterInterface2.CounterInterface);

exports.YandexMetrika = YandexMetrika;

},{"./CounterInterface":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Click = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
        key: 'handle',


        /**
         * Handler
         * @param event
         */
        value: function handle(event) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.locator.counters.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var counter = _step.value;

                    counter.sendEvent(event, {}, {});
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
    }, {
        key: 'eventName',
        get: function get() {
            return 'click';
        }
    }]);

    return Click;
}(_EventInterface2.EventInterface);

exports.Click = Click;

},{"./EventInterface":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventInterface = function () {

    /**
     * @param locator IntentAnalytics
     * @param options
     */

    function EventInterface(locator, options) {
        _classCallCheck(this, EventInterface);

        this.locator = locator;
        this.init(options);
        this.attachHandlers(options);
    }

    _createClass(EventInterface, [{
        key: 'init',


        /**
         * Init
         * @param options
         */
        value: function init(options) {}
    }, {
        key: 'attachHandlers',
        value: function attachHandlers(options) {
            var _this = this;

            var has = Object.prototype.hasOwnProperty;
            if (options !== null && has.call(options, 'selectors')) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = options.selectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var selector = _step.value;

                        var elements = document.querySelectorAll(selector);
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].addEventListener(this.eventName, function (event) {
                                return _this.handle(event);
                            });
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
         * Trigger
         * @param params
         */

    }, {
        key: 'handle',
        value: function handle(params) {}
    }, {
        key: 'eventName',
        get: function get() {
            return '';
        }
    }]);

    return EventInterface;
}();

exports.EventInterface = EventInterface;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Submit = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventInterface2 = require('./EventInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Submit = function (_EventInterface) {
    _inherits(Submit, _EventInterface);

    function Submit() {
        _classCallCheck(this, Submit);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Submit).apply(this, arguments));
    }

    _createClass(Submit, [{
        key: 'handle',


        /**
         * Handler
         * @param event
         */
        value: function handle(event) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.locator.counters.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var counter = _step.value;

                    counter.sendEvent(event, {}, {});
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
    }, {
        key: 'eventName',
        get: function get() {
            return 'submit';
        }
    }]);

    return Submit;
}(_EventInterface2.EventInterface);

exports.Submit = Submit;

},{"./EventInterface":8}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9JbnRlbnRBbmFseXRpY3MuanMiLCJqcy9hcHAuanMiLCJqcy9jb3VudGVycy9Db3VudGVySW50ZXJmYWNlLmpzIiwianMvY291bnRlcnMvR29vZ2xlQW5hbHl0aWNzLmpzIiwianMvY291bnRlcnMvUGl3aWsuanMiLCJqcy9jb3VudGVycy9ZYW5kZXhNZXRyaWthLmpzIiwianMvZXZlbnRzL0NsaWNrLmpzIiwianMvZXZlbnRzL0V2ZW50SW50ZXJmYWNlLmpzIiwianMvZXZlbnRzL1N1Ym1pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJLFdBQVcsSUFBZjs7SUFFTSxlOzs7Ozs7QUFLRiwrQkFBYztBQUFBOztBQUNWLFlBQUksU0FBUyxRQUFULElBQXNCLFVBQVUsb0JBQW9CLElBQXhELEVBQStEO0FBQzNELGlCQUFLLFFBQUwsR0FBZ0IsSUFBSSxHQUFKLEVBQWhCO0FBQ0EsaUJBQUssTUFBTCxHQUFjLElBQUksR0FBSixFQUFkO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixJQUFJLEdBQUosRUFBakI7QUFDQSx1QkFBVyxJQUFYO0FBQ0g7QUFDSjs7Ozs7Ozs7Ozs7O2tDQVFTLFEsRUFBVSxRLEVBQVU7QUFDMUIsaUJBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsUUFBbkIsRUFBNkIsUUFBN0I7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7Ozs7Ozs7O21DQU9VLE8sRUFBUztBQUNoQixnQkFBTSxNQUFNLE9BQU8sU0FBUCxDQUFpQixjQUE3QjtBQUNBLGdCQUFJLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBVCxFQUFrQixVQUFsQixDQUFWLElBQTJDLFVBQVUsS0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixRQUFRLFFBQTNCLENBQXpELEVBQStGO0FBQzNGLHVCQUFPLElBQVA7QUFDSDtBQUNELGdCQUFNLFdBQVcsS0FBSyxTQUFMLENB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TUFBSyxNQUFMLENBQVksS0FBWixDQUFYO0FBQUEsNkJBQTdDO0FBQ0g7QUFDSjtBQU5tRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT3ZEO0FBQ0o7Ozs7Ozs7OzsrQkFNTSxNLEVBQVEsQ0FDZDs7OzRCQTdCZTtBQUNaLG1CQUFPLEVBQVA7QUFDSDs7Ozs7O1FBOEJHLGMsR0FBQSxjOzs7Ozs7Ozs7Ozs7QUM1Q1I7Ozs7Ozs7O0lBRU0sTTs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBVUssSyxFQUFPO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ1YscUNBQW9CLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsTUFBdEIsRUFBcEIsOEhBQW9EO0FBQUEsd0JBQTNDLE9BQTJDOztBQUNoRCw0QkFBUSxTQUFSLENBQWtCLEtBQWxCLEVBQXlCLEVBQXpCLEVBQTZCLEVBQTdCO0FBQ0g7QUFIUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSWI7Ozs0QkFaZ0I7QUFDYixtQkFBTyxRQUFQO0FBQ0g7Ozs7OztRQWFHLE0sR0FBQSxNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBpbnN0YW5jZSA9IG51bGw7XG5cbmNsYXNzIEludGVudEFuYWx5dGljcyB7XG4gICAgLyoqXG4gICAgICogU2luZ2xldG9uXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKG51bGwgPT09IGluc3RhbmNlIHx8IChmYWxzZSA9PT0gaW5zdGFuY2UgaW5zdGFuY2VvZiB0aGlzKSkge1xuICAgICAgICAgICAgdGhpcy5jb3VudGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgdGhpcy5tb2R1bGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgbW9kdWxlXG4gICAgICogQHBhcmFtIGpzTW9kdWxlXG4gICAgICogQHBhcmFtIGpzT2JqZWN0XG4gICAgICogQHJldHVybiB7SW50ZW50QW5hbHl0aWNzfVxuICAgICAqL1xuICAgIGFkZE1vZHVsZShqc01vZHVsZSwganNPYmplY3QpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVNYXAuc2V0KGpzTW9kdWxlLCBqc09iamVjdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGNvdW50ZXJcbiAgICAgKiBAcGFyYW0gY291bnRlclxuICAgICAqIEByZXR1cm4ge0ludGVudEFuYWx5dGljc31cbiAgICAgKi9cbiAgICBhZGRDb3VudGVyKGNvdW50ZXIpIHtcbiAgICAgICAgY29uc3QgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgICAgaWYgKGZhbHNlID09PSBoYXMuY2FsbChjb3VudGVyLCAnanNNb2R1bGUnKSB8fCBmYWxzZSA9PT0gdGhpcy5tb2R1bGVNYXAuaGFzKGNvdW50ZXIuanNNb2R1bGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBqc01vZHVsZSA9IHRoaXMubW9kdWxlTWFwLmdldChjb3VudGVyLmpzTW9kdWxlKTtcbiAgICAgICAgdGhpcy5jb3VudGVycy5zZXQoY291bnRlci5pZCwgbmV3IGpzTW9kdWxlKHRoaXMsIGNvdW50ZXIpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgZXZlbnRcbiAgICAgKiBAcGFyYW0ganNNb2R1bGVcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybiB7SW50ZW50QW5hbHl0aWNzfVxuICAgICAqL1xuICAgIGFkZEV2ZW50KHtqc01vZHVsZSwgdHlwZSwgb3B0aW9ucyA9IHt9fSkge1xuICAgICAgICBpZiAoIXRoaXMubW9kdWxlTWFwLmhhcyhqc01vZHVsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGpzTW9kdWxlID0gdGhpcy5tb2R1bGVNYXAuZ2V0KGpzTW9kdWxlKTtcblxuICAgICAgICBsZXQgX2FycmF5ID0gdGhpcy5ldmVudHMuaGFzKHR5cGUpID8gdGhpcy5ldmVudHMuZ2V0KHR5cGUpIDogW107XG4gICAgICAgIF9hcnJheS5wdXNoKG5ldyBqc01vZHVsZSh0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuZXZlbnRzLnNldCh0eXBlLCBfYXJyYXkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBjb3VudGVyc1xuICAgICAqIEBwYXJhbSBjb3VudGVyc0FycmF5XG4gICAgICogQHJldHVybiB7SW50ZW50QW5hbHl0aWNzfVxuICAgICAqL1xuICAgIGFkZENvdW50ZXJzKGNvdW50ZXJzQXJyYXkpIHtcbiAgICAgICAgZm9yIChsZXQgY291bnRlciBvZiBjb3VudGVyc0FycmF5KSB7XG4gICAgICAgICAgICB0aGlzLmFkZENvdW50ZXIoY291bnRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGV2ZW50c1xuICAgICAqIEBwYXJhbSBldmVudHNcbiAgICAgKiBAcmV0dXJuIHtJbnRlbnRBbmFseXRpY3N9XG4gICAgICovXG4gICAgYWRkRXZlbnRzKGV2ZW50cykge1xuICAgICAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnQoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvZ0Vycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgLyplc2xpbnQtZW5hYmxlKi9cbiAgICB9XG59XG5cbmV4cG9ydCB7SW50ZW50QW5hbHl0aWNzfTtcbiIsImltcG9ydCB7SW50ZW50QW5hbHl0aWNzfSBmcm9tICcuL0ludGVudEFuYWx5dGljcyc7XG5cbmltcG9ydCB7R29vZ2xlQW5hbHl0aWNzfSBmcm9tICcuL2NvdW50ZXJzL0dvb2dsZUFuYWx5dGljcyc7XG5pbXBvcnQge1lhbmRleE1ldHJpa2F9IGZyb20gJy4vY291bnRlcnMvWWFuZGV4TWV0cmlrYSc7XG5pbXBvcnQge1Bpd2lrfSBmcm9tICcuL2NvdW50ZXJzL1Bpd2lrJztcbmltcG9ydCB7Q2xpY2t9IGZyb20gJy4vZXZlbnRzL0NsaWNrJztcbmltcG9ydCB7U3VibWl0fSBmcm9tICcuL2V2ZW50cy9TdWJtaXQnO1xuXG5sZXQgdWEgPSBuZXcgSW50ZW50QW5hbHl0aWNzKCk7XG51YS5hZGRNb2R1bGUoJ0dvb2dsZUFuYWx5dGljcycsIEdvb2dsZUFuYWx5dGljcyk7XG51YS5hZGRNb2R1bGUoJ1lhbmRleE1ldHJpa2EnLCBZYW5kZXhNZXRyaWthKTtcbnVhLmFkZE1vZHVsZSgnUGl3aWsnLCBQaXdpayk7XG51YS5hZGRNb2R1bGUoJ0NsaWNrJywgQ2xpY2spO1xudWEuYWRkTW9kdWxlKCdTdWJtaXQnLCBTdWJtaXQpO1xuLy9nbG9iYWwuaW50ZW50QW5hbHl0aWNzID0gbmV3IEludGVudEFuYWx5dGljcygpO1xuZ2xvYmFsLkludGVudEFuYWx5dGljcyA9IHVhO1xuIiwiY2xhc3MgQ291bnRlckludGVyZmFjZSB7XG5cbiAgICAvKipcbiAgICAgKiBIZXJlIHdlIHR1cm4gb2ZmIG5vLXVudXNlZC12YXJzIHdhcm5pbmcgYmVjYXVzZSB0aGlzIGNsYXNzIGlzIGFjdHVhbGx5IGFic3RyYWN0LlxuICAgICAqIFNvIHRoZXJlJ3MgYSBsb3Qgb2YgdW51c2VkIHZhcnMgYW5kIGl0IGlzIG5vcm1hbCAtIHdlIGp1c3Qgd2FudCB0byBkZXNjcmliZSB0aGUgd2hvbGUgaW50ZXJmYWNlLlxuICAgICAqXG4gICAgICogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9jYXRvciB7SW50ZW50QW5hbHl0aWNzfVxuICAgICAqIEBwYXJhbSBjb3VudGVyXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobG9jYXRvciwgY291bnRlcikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGNvdW50ZXIpO1xuICAgICAgICB0aGlzLmNvdW50ZXJTZXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2NhdG9yID0gbG9jYXRvcjtcbiAgICAgICAgdGhpcy5pbml0KGNvdW50ZXIub3B0aW9ucyk7XG4gICAgICAgIHRoaXMucmVzb2x2ZUpzT2JqZWN0KGNvdW50ZXIuanNPYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGluaXQob3B0aW9ucykge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybiB7e319XG4gICAgICovXG4gICAgcmVzb2x2ZUpzT2JqZWN0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTZW5kIGV2ZW50XG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICB9XG59XG5cbmV4cG9ydCB7Q291bnRlckludGVyZmFjZX07XG4iLCJpbXBvcnQge0NvdW50ZXJJbnRlcmZhY2V9IGZyb20gJy4vQ291bnRlckludGVyZmFjZSc7XG5pbXBvcnQge0ludGVudEFuYWx5dGljc30gZnJvbSAnLi4vSW50ZW50QW5hbHl0aWNzJztcblxuY2xhc3MgR29vZ2xlQW5hbHl0aWNzIGV4dGVuZHMgQ291bnRlckludGVyZmFjZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4ge3t9fVxuICAgICAqL1xuICAgIHJlc29sdmVKc09iamVjdChuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93W25hbWVdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdpbmRvd1tuYW1lXSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qc09iamVjdCA9IHdpbmRvd1tuYW1lXS5nZXRCeU5hbWUodGhpcy50aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnRlclNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoJGUpIHtcbiAgICAgICAgICAgICAgICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKGBDYW50IGluaXRpYWxpemUgR29vZ2xlQ291bnRlciB3aXRoIHRpdGxlICcke3RoaXMudGl0bGV9J2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKGBHbG9iYWwgR29vZ2xlIEFuYWx5dGljcyBmdW5jdGlvbiAnJHtuYW1lfScgbm90IGZvdW5kIWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2codHlwZW9mIHRoaXMuanNPYmplY3QpO1xuICAgICAgICAvLyB0aGlzLmpzT2JqZWN0KCdzZW5kJywgJ2V2ZW50JywgKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7R29vZ2xlQW5hbHl0aWNzfTtcbiIsImltcG9ydCB7Q291bnRlckludGVyZmFjZX0gZnJvbSAnLi9Db3VudGVySW50ZXJmYWNlJztcblxuY2xhc3MgQ291bnRlclBpd2lrIGV4dGVuZHMgQ291bnRlckludGVyZmFjZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybiB7e319XG4gICAgICovXG4gICAgcmVzb2x2ZUpzT2JqZWN0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvd1tuYW1lXSB8fCBzdXBlci5yZXNvbHZlSnNPYmplY3QobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICB9XG59XG5cbmV4cG9ydCB7Q291bnRlclBpd2lrfTtcbiIsImltcG9ydCB7Q291bnRlckludGVyZmFjZX0gZnJvbSAnLi9Db3VudGVySW50ZXJmYWNlJztcblxuY2xhc3MgWWFuZGV4TWV0cmlrYSBleHRlbmRzIENvdW50ZXJJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzUXVldWUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJuIHt7fX1cbiAgICAgKi9cbiAgICByZXNvbHZlSnNPYmplY3QobmFtZSkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgU3RyaW5nKGAke25hbWV9JHt0aGlzLmNvdW50ZXJJZH1pbml0ZWRgKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdpbmRvd1tuYW1lICsgdGhpcy5jb3VudGVySWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuanNPYmplY3QgPSB3aW5kb3dbbmFtZSArIHRoaXMuY291bnRlcklkXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudGVyU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBJbnRlbnRBbmFseXRpY3MubG9nRXJyb3IoYENhbnQgaW5pdGlhbGl6ZSBZYW5kZXhDb3VudGVyIHdpdGggaWQgJyR7dGhpcy5jb3VudGVySWR9J2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBzZW5kRXZlbnQoZXZlbnQsIGRhdGEsIHBhcmFtcykge1xuICAgICAgICAvL3NvbWUga2luZCBvZiBxdWV1ZSBmb3IgWWFuZGV4IGJlZm9yZSBjb3VudGVyIG5vdCB5ZXQgaW5pdGlhbGl6ZWRcbiAgICAgICAgLy9Hb29nbGUgaGFzIG93biBxdWV1ZVxuICAgICAgICBpZiAoZmFsc2UgPT09IHRoaXMuY291bnRlclNldCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNRdWV1ZS5zZXQoU3ltYm9sKCksIHtldmVudCwgZGF0YSwgcGFyYW1zfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNRdWV1ZS5zaXplID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHRoaXMuZXZlbnRzUXVldWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNRdWV1ZS5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbmQoe2V2ZW50LCBkYXRhLCBwYXJhbXN9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHNlbmQoe2V2ZW50LCBkYXRhLCBwYXJhbXN9KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICAgICAgLy90aGlzLmpzT2JqZWN0LnJlYWNoR29hbChldmVudCwgcGFyYW1zIHx8IHt9KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7WWFuZGV4TWV0cmlrYX07XG4iLCJpbXBvcnQge0V2ZW50SW50ZXJmYWNlfSBmcm9tICcuL0V2ZW50SW50ZXJmYWNlJztcblxuY2xhc3MgQ2xpY2sgZXh0ZW5kcyBFdmVudEludGVyZmFjZSB7XG5cbiAgICBnZXQgZXZlbnROYW1lICgpIHtcbiAgICAgICAgcmV0dXJuICdjbGljayc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlclxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZShldmVudCkge1xuICAgICAgICBmb3IgKGxldCBjb3VudGVyIG9mIHRoaXMubG9jYXRvci5jb3VudGVycy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgY291bnRlci5zZW5kRXZlbnQoZXZlbnQsIHt9LCB7fSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7Q2xpY2t9O1xuIiwiY2xhc3MgRXZlbnRJbnRlcmZhY2Uge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxvY2F0b3IgSW50ZW50QW5hbHl0aWNzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihsb2NhdG9yLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMubG9jYXRvciA9IGxvY2F0b3I7XG4gICAgICAgIHRoaXMuaW5pdChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5hdHRhY2hIYW5kbGVycyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgZXZlbnROYW1lKCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgaW5pdChvcHRpb25zKSB7XG5cbiAgICB9XG5cbiAgICBhdHRhY2hIYW5kbGVycyhvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICAgIGlmIChvcHRpb25zICE9PSBudWxsICYmIGhhcy5jYWxsKG9wdGlvbnMsICdzZWxlY3RvcnMnKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBvcHRpb25zLnNlbGVjdG9ycykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1tpXS5hZGRFdmVudExpc3RlbmVyKHRoaXMuZXZlbnROYW1lLCAoZXZlbnQpID0+IHRoaXMuaGFuZGxlKGV2ZW50KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlclxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBoYW5kbGUocGFyYW1zKSB7XG4gICAgfVxufVxuXG5leHBvcnQge0V2ZW50SW50ZXJmYWNlfTtcbiIsImltcG9ydCB7RXZlbnRJbnRlcmZhY2V9IGZyb20gJy4vRXZlbnRJbnRlcmZhY2UnO1xuXG5jbGFzcyBTdWJtaXQgZXh0ZW5kcyBFdmVudEludGVyZmFjZSB7XG5cbiAgICBnZXQgZXZlbnROYW1lICgpIHtcbiAgICAgICAgcmV0dXJuICdzdWJtaXQnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXJcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBoYW5kbGUoZXZlbnQpIHtcbiAgICAgICAgZm9yIChsZXQgY291bnRlciBvZiB0aGlzLmxvY2F0b3IuY291bnRlcnMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGNvdW50ZXIuc2VuZEV2ZW50KGV2ZW50LCB7fSwge30pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1N1Ym1pdH07XG4iXX0=
