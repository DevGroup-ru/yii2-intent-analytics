(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var UnionAnalytics = function () {
    /**
     * Singleton
     * @return {*}
     */

    function UnionAnalytics() {
        _classCallCheck(this, UnionAnalytics);

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
     * @return {UnionAnalytics}
     */


    _createClass(UnionAnalytics, [{
        key: "addModule",
        value: function addModule(jsModule, jsObject) {
            this.moduleMap.set(jsModule, jsObject);

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
        value: function addCounter(_ref) {
            var id = _ref.id;
            var jsModule = _ref.jsModule;
            var jsObject = _ref.jsObject;
            var _ref$options = _ref.options;
            var options = _ref$options === undefined ? {} : _ref$options;

            if (!this.moduleMap.has(jsModule)) {
                return this;
            }
            jsModule = this.moduleMap.get(jsModule);
            this.counters.set(id, new jsModule(this, jsObject, options));

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
        value: function addEvent(_ref2) {
            var jsModule = _ref2.jsModule;
            var type = _ref2.type;
            var _ref2$options = _ref2.options;
            var options = _ref2$options === undefined ? {} : _ref2$options;

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
         * @return {UnionAnalytics}
         */

    }, {
        key: "addCounters",
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

        /**
         * Trigger an event
         * @param type
         * @param params
         * @return {UnionAnalytics}
         */

    }, {
        key: "trigger",
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

            return this;
        }
    }]);

    return UnionAnalytics;
}();

exports.UnionAnalytics = UnionAnalytics;

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var _UnionAnalytics = require('./UnionAnalytics');

var _CounterGoogleAnalytics = require('./counters/CounterGoogleAnalytics');

var _CounterYandexMetrika = require('./counters/CounterYandexMetrika');

var _CounterPiwik = require('./counters/CounterPiwik');

var _Click = require('./events/Click');

var _Submit = require('./events/Submit');

//import {IntentAnalytics} from './IntentAnalytics';


var ua = new _UnionAnalytics.UnionAnalytics();
ua.addModule('CounterGoogleAnalytics', _CounterGoogleAnalytics.CounterGoogleAnalytics);
ua.addModule('CounterYandexMetrika', _CounterYandexMetrika.CounterYandexMetrika);
ua.addModule('CounterPiwik', _CounterPiwik.CounterPiwik);
ua.addModule('Click', _Click.Click);
ua.addModule('Submit', _Submit.Submit);

//global.intentAnalytics = new IntentAnalytics();
global.UnionAnalytics = ua;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./UnionAnalytics":1,"./counters/CounterGoogleAnalytics":3,"./counters/CounterPiwik":5,"./counters/CounterYandexMetrika":6,"./events/Click":7,"./events/Submit":9}],3:[function(require,module,exports){
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

},{"./CounterInterface":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./CounterInterface":4}],6:[function(require,module,exports){
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
            console.log(event);
            //this.jsObject.reachGoal(event, params || {});
        }
    }]);

    return CounterYandexMetrika;
}(_CounterInterface2.CounterInterface);

exports.CounterYandexMetrika = CounterYandexMetrika;

},{"./CounterInterface":4}],7:[function(require,module,exports){
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
     * @param locator UnionAnalytics
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9VbmlvbkFuYWx5dGljcy5qcyIsImpzL2FwcC5qcyIsImpzL2NvdW50ZXJzL0NvdW50ZXJHb29nbGVBbmFseXRpY3MuanMiLCJqcy9jb3VudGVycy9Db3VudGVySW50ZXJmYWNlLmpzIiwianMvY291bnRlcnMvQ291bnRlclBpd2lrLmpzIiwianMvY291bnRlcnMvQ291bnRlcllhbmRleE1ldHJpa2EuanMiLCJqcy9ldmVudHMvQ2xpY2suanMiLCJqcy9ldmVudHMvRXZlbnRJbnRlcmZhY2UuanMiLCJqcy9ldmVudHMvU3VibWl0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBLElBQUksV0FBVyxJQUFmOztJQUVNLGM7Ozs7OztBQUtGLDhCQUFjO0FBQUE7O0FBQ1YsWUFBSSxTQUFTLFFBQVQsSUFBc0IsVUFBVSxvQkFBb0IsSUFBeEQsRUFBK0Q7QUFDM0QsaUJBQUssUUFBTCxHQUFnQixJQUFJLEdBQUosRUFBaEI7QUFDQSxpQkFBSyxNQUFMLEdBQWMsSUFBSSxHQUFKLEVBQWQ7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLElBQUksR0FBSixFQUFqQjtBQUNBLHVCQUFXLElBQVg7QUFDSDtBQUNKOzs7Ozs7Ozs7Ozs7a0NBUVMsUSxFQUFVLFEsRUFBVTtBQUMxQixpQkFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixRQUFuQixFQUE2QixRQUE3Qjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7eUNBVWtEO0FBQUEsZ0JBQXZDLEVBQXVDLFFBQXZDLEVBQXVDO0FBQUEsZ0JBQW5DLFFBQW1DLFFBQW5DLFFBQW1DO0FBQUEsZ0JBQXpCLFFBQXlCLFFBQXpCLFFBQXlCO0FBQUEsb0NBQWYsT0FBZTtBQUFBLGdCQUFmLE9BQWUsZ0NBQUwsRUFBSzs7QUFDL0MsZ0JBQUksQ0FBQyxLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLFFBQW5CLENB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S0FBWixDQUFYO0FBQUEsNkJBQTdDO0FBQ0g7QUFDSjtBQU5tRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT3ZEO0FBQ0o7Ozs7Ozs7OzsrQkFNTSxNLEVBQVEsQ0FDZDs7OzRCQTdCZTtBQUNaLG1CQUFPLEVBQVA7QUFDSDs7Ozs7O1FBOEJHLGMsR0FBQSxjOzs7Ozs7Ozs7Ozs7QUM1Q1I7Ozs7Ozs7O0lBRU0sTTs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBVUssSyxFQUFPO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ1YscUNBQW9CLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsTUFBdEIsRUFBcEIsOEhBQW9EO0FBQUEsd0JBQTNDLE9BQTJDOztBQUNoRCw0QkFBUSxTQUFSLENBQWtCLEtBQWxCLEVBQXlCLEVBQXpCLEVBQTZCLEVBQTdCO0FBQ0g7QUFIUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSWI7Ozs0QkFaZ0I7QUFDYixtQkFBTyxRQUFQO0FBQ0g7Ozs7OztRQWFHLE0sR0FBQSxNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBpbnN0YW5jZSA9IG51bGw7XG5cbmNsYXNzIFVuaW9uQW5hbHl0aWNzIHtcbiAgICAvKipcbiAgICAgKiBTaW5nbGV0b25cbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAobnVsbCA9PT0gaW5zdGFuY2UgfHwgKGZhbHNlID09PSBpbnN0YW5jZSBpbnN0YW5jZW9mIHRoaXMpKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50ZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICB0aGlzLm1vZHVsZU1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBtb2R1bGVcbiAgICAgKiBAcGFyYW0ganNNb2R1bGVcbiAgICAgKiBAcGFyYW0ganNPYmplY3RcbiAgICAgKiBAcmV0dXJuIHtVbmlvbkFuYWx5dGljc31cbiAgICAgKi9cbiAgICBhZGRNb2R1bGUoanNNb2R1bGUsIGpzT2JqZWN0KSB7XG4gICAgICAgIHRoaXMubW9kdWxlTWFwLnNldChqc01vZHVsZSwganNPYmplY3QpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBjb3VudGVyXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIGpzTW9kdWxlXG4gICAgICogQHBhcmFtIGpzT2JqZWN0XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJuIHtVbmlvbkFuYWx5dGljc31cbiAgICAgKi9cbiAgICBhZGRDb3VudGVyKHtpZCwganNNb2R1bGUsIGpzT2JqZWN0LCBvcHRpb25zID0ge319KSB7XG4gICAgICAgIGlmICghdGhpcy5tb2R1bGVNYXAuaGFzKGpzTW9kdWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAganNNb2R1bGUgPSB0aGlzLm1vZHVsZU1hcC5nZXQoanNNb2R1bGUpO1xuICAgICAgICB0aGlzLmNvdW50ZXJzLnNldChpZCwgbmV3IGpzTW9kdWxlKHRoaXMsIGpzT2JqZWN0LCBvcHRpb25zKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGV2ZW50XG4gICAgICogQHBhcmFtIGpzTW9kdWxlXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm4ge1VuaW9uQW5hbHl0aWNzfVxuICAgICAqL1xuICAgIGFkZEV2ZW50KHtqc01vZHVsZSwgdHlwZSwgb3B0aW9ucyA9IHt9fSkge1xuICAgICAgICBpZiAoIXRoaXMubW9kdWxlTWFwLmhhcyhqc01vZHVsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGpzTW9kdWxlID0gdGhpcy5tb2R1bGVNYXAuZ2V0KGpzTW9kdWxlKTtcblxuICAgICAgICBsZXQgX2FycmF5ID0gdGhpcy5ldmVudHMuaGFzKHR5cGUpID8gdGhpcy5ldmVudHMuZ2V0KHR5cGUpIDogW107XG4gICAgICAgIF9hcnJheS5wdXNoKG5ldyBqc01vZHVsZSh0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuZXZlbnRzLnNldCh0eXBlLCBfYXJyYXkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBjb3VudGVyc1xuICAgICAqIEBwYXJhbSBjb3VudGVyc0FycmF5XG4gICAgICogQHJldHVybiB7VW5pb25BbmFseXRpY3N9XG4gICAgICovXG4gICAgYWRkQ291bnRlcnMoY291bnRlcnNBcnJheSkge1xuICAgICAgICBmb3IgKGxldCBjb3VudGVyIG9mIGNvdW50ZXJzQXJyYXkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ291bnRlcihjb3VudGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgZXZlbnRzXG4gICAgICogQHBhcmFtIGV2ZW50c1xuICAgICAqIEByZXR1cm4ge1VuaW9uQW5hbHl0aWNzfVxuICAgICAqL1xuICAgIGFkZEV2ZW50cyhldmVudHMpIHtcbiAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50KGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgYW4gZXZlbnRcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJuIHtVbmlvbkFuYWx5dGljc31cbiAgICAgKi9cbiAgICB0cmlnZ2VyKHR5cGUsIHBhcmFtcykge1xuICAgICAgICBsZXQgX2FycmF5ID0gdGhpcy5ldmVudHMuaGFzKHR5cGUpID8gdGhpcy5ldmVudHMuZ2V0KHR5cGUpIDogW107XG4gICAgICAgIGZvciAobGV0IGV2ZW50IG9mIF9hcnJheSkge1xuICAgICAgICAgICAgZXZlbnQudHJpZ2dlcihwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5leHBvcnQge1VuaW9uQW5hbHl0aWNzfTtcbiIsIi8vaW1wb3J0IHtJbnRlbnRBbmFseXRpY3N9IGZyb20gJy4vSW50ZW50QW5hbHl0aWNzJztcbmltcG9ydCB7VW5pb25BbmFseXRpY3N9IGZyb20gJy4vVW5pb25BbmFseXRpY3MnO1xuXG5pbXBvcnQge0NvdW50ZXJHb29nbGVBbmFseXRpY3N9IGZyb20gJy4vY291bnRlcnMvQ291bnRlckdvb2dsZUFuYWx5dGljcyc7XG5pbXBvcnQge0NvdW50ZXJZYW5kZXhNZXRyaWthfSBmcm9tICcuL2NvdW50ZXJzL0NvdW50ZXJZYW5kZXhNZXRyaWthJztcbmltcG9ydCB7Q291bnRlclBpd2lrfSBmcm9tICcuL2NvdW50ZXJzL0NvdW50ZXJQaXdpayc7XG5pbXBvcnQge0NsaWNrfSBmcm9tICcuL2V2ZW50cy9DbGljayc7XG5pbXBvcnQge1N1Ym1pdH0gZnJvbSAnLi9ldmVudHMvU3VibWl0JztcblxubGV0IHVhID0gbmV3IFVuaW9uQW5hbHl0aWNzKCk7XG51YS5hZGRNb2R1bGUoJ0NvdW50ZXJHb29nbGVBbmFseXRpY3MnLCBDb3VudGVyR29vZ2xlQW5hbHl0aWNzKTtcbnVhLmFkZE1vZHVsZSgnQ291bnRlcllhbmRleE1ldHJpa2EnLCBDb3VudGVyWWFuZGV4TWV0cmlrYSk7XG51YS5hZGRNb2R1bGUoJ0NvdW50ZXJQaXdpaycsIENvdW50ZXJQaXdpayk7XG51YS5hZGRNb2R1bGUoJ0NsaWNrJywgQ2xpY2spO1xudWEuYWRkTW9kdWxlKCdTdWJtaXQnLCBTdWJtaXQpO1xuXG4vL2dsb2JhbC5pbnRlbnRBbmFseXRpY3MgPSBuZXcgSW50ZW50QW5hbHl0aWNzKCk7XG5nbG9iYWwuVW5pb25BbmFseXRpY3MgPSB1YTtcbiIsImltcG9ydCB7Q291bnRlckludGVyZmFjZX0gZnJvbSAnLi9Db3VudGVySW50ZXJmYWNlJztcblxuY2xhc3MgQ291bnRlckdvb2dsZUFuYWx5dGljcyBleHRlbmRzIENvdW50ZXJJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJuIHt7fX1cbiAgICAgKi9cbiAgICByZXNvbHZlSnNPYmplY3QobmFtZSkge1xuICAgICAgICByZXR1cm4gd2luZG93W25hbWVdIHx8IHN1cGVyLnJlc29sdmVKc09iamVjdChuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBzZW5kRXZlbnQoZXZlbnQsIGRhdGEsIHBhcmFtcykge1xuICAgICAgICAvLyB0aGlzLmpzT2JqZWN0KCdzZW5kJywgJ2V2ZW50JywgKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7Q291bnRlckdvb2dsZUFuYWx5dGljc307XG4iLCJjbGFzcyBDb3VudGVySW50ZXJmYWNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbG9jYXRvclxuICAgICAqIEBwYXJhbSBqc09iamVjdFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobG9jYXRvciwganNPYmplY3QsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5sb2NhdG9yID0gbG9jYXRvcjtcbiAgICAgICAgdGhpcy5qc09iamVjdCA9IHRoaXMucmVzb2x2ZUpzT2JqZWN0KGpzT2JqZWN0KTtcbiAgICAgICAgdGhpcy5yYXdPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5pbml0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGluaXQob3B0aW9ucykge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybiB7e319XG4gICAgICovXG4gICAgcmVzb2x2ZUpzT2JqZWN0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTZW5kIGV2ZW50XG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICB9XG59XG5cbmV4cG9ydCB7Q291bnRlckludGVyZmFjZX07XG4iLCJpbXBvcnQge0NvdW50ZXJJbnRlcmZhY2V9IGZyb20gJy4vQ291bnRlckludGVyZmFjZSc7XG5cbmNsYXNzIENvdW50ZXJQaXdpayBleHRlbmRzIENvdW50ZXJJbnRlcmZhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgaW5pdChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLmluaXQob3B0aW9ucyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4ge3t9fVxuICAgICAqL1xuICAgIHJlc29sdmVKc09iamVjdChuYW1lKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3dbbmFtZV0gfHwgc3VwZXIucmVzb2x2ZUpzT2JqZWN0KG5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHNlbmRFdmVudChldmVudCwgZGF0YSwgcGFyYW1zKSB7XG4gICAgfVxufVxuXG5leHBvcnQge0NvdW50ZXJQaXdpa307XG4iLCJpbXBvcnQge0NvdW50ZXJJbnRlcmZhY2V9IGZyb20gJy4vQ291bnRlckludGVyZmFjZSc7XG5cbmNsYXNzIENvdW50ZXJZYW5kZXhNZXRyaWthIGV4dGVuZHMgQ291bnRlckludGVyZmFjZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4ge3t9fVxuICAgICAqL1xuICAgIHJlc29sdmVKc09iamVjdChuYW1lKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3dbYHlhQ291bnRlciR7bmFtZX1gXSB8fCBzdXBlci5yZXNvbHZlSnNPYmplY3QobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc2VuZEV2ZW50KGV2ZW50LCBkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICAvL3RoaXMuanNPYmplY3QucmVhY2hHb2FsKGV2ZW50LCBwYXJhbXMgfHwge30pO1xuICAgIH1cbn1cblxuZXhwb3J0IHtDb3VudGVyWWFuZGV4TWV0cmlrYX07XG4iLCJpbXBvcnQge0V2ZW50SW50ZXJmYWNlfSBmcm9tICcuL0V2ZW50SW50ZXJmYWNlJztcblxuY2xhc3MgQ2xpY2sgZXh0ZW5kcyBFdmVudEludGVyZmFjZSB7XG5cbiAgICBnZXQgZXZlbnROYW1lICgpIHtcbiAgICAgICAgcmV0dXJuICdjbGljayc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlclxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZShldmVudCkge1xuICAgICAgICBmb3IgKGxldCBjb3VudGVyIG9mIHRoaXMubG9jYXRvci5jb3VudGVycy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgY291bnRlci5zZW5kRXZlbnQoZXZlbnQsIHt9LCB7fSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7Q2xpY2t9O1xuIiwiY2xhc3MgRXZlbnRJbnRlcmZhY2Uge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxvY2F0b3IgVW5pb25BbmFseXRpY3NcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxvY2F0b3IsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5sb2NhdG9yID0gbG9jYXRvcjtcbiAgICAgICAgdGhpcy5pbml0KG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmF0dGFjaEhhbmRsZXJzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBldmVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KG9wdGlvbnMpIHtcblxuICAgIH1cblxuICAgIGF0dGFjaEhhbmRsZXJzKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgICAgaWYgKG9wdGlvbnMgIT09IG51bGwgJiYgaGFzLmNhbGwob3B0aW9ucywgJ3NlbGVjdG9ycycpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIG9wdGlvbnMuc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzW2ldLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ldmVudE5hbWUsIChldmVudCkgPT4gdGhpcy5oYW5kbGUoZXZlbnQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIGhhbmRsZShwYXJhbXMpIHtcbiAgICB9XG59XG5cbmV4cG9ydCB7RXZlbnRJbnRlcmZhY2V9O1xuIiwiaW1wb3J0IHtFdmVudEludGVyZmFjZX0gZnJvbSAnLi9FdmVudEludGVyZmFjZSc7XG5cbmNsYXNzIFN1Ym1pdCBleHRlbmRzIEV2ZW50SW50ZXJmYWNlIHtcblxuICAgIGdldCBldmVudE5hbWUgKCkge1xuICAgICAgICByZXR1cm4gJ3N1Ym1pdCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlclxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZShldmVudCkge1xuICAgICAgICBmb3IgKGxldCBjb3VudGVyIG9mIHRoaXMubG9jYXRvci5jb3VudGVycy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgY291bnRlci5zZW5kRXZlbnQoZXZlbnQsIHt9LCB7fSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7U3VibWl0fTtcbiJdfQ==
