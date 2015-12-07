(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _typeof6(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _typeof5(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof6(obj);
}

function _typeof4(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof5(obj);
}

function _typeof3(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof4(obj);
}

function _typeof2(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
}

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntentAnalytics = undefined;

var _GoogleAnalytics = require('./counters/GoogleAnalytics');

var _YandexMetrika = require('./counters/YandexMetrika');

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var IntentAnalytics = (function () {
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
})();

exports.IntentAnalytics = IntentAnalytics;

},{"./counters/GoogleAnalytics":4,"./counters/YandexMetrika":5}],2:[function(require,module,exports){
(function (global){
'use strict';

var _IntentAnalytics = require('./IntentAnalytics');

global.intentAnalytics = new _IntentAnalytics.IntentAnalytics();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./IntentAnalytics":1}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var AbstractCounter = (function () {
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
})();

exports.AbstractCounter = AbstractCounter;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleAnalytics = undefined;

var _AbstractCounter2 = require('./AbstractCounter');

var _IntentAnalytics = require('../IntentAnalytics');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GoogleAnalytics = (function (_AbstractCounter) {
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
})(_AbstractCounter2.AbstractCounter);

exports.GoogleAnalytics = GoogleAnalytics;

},{"../IntentAnalytics":1,"./AbstractCounter":3}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YandexMetrika = undefined;

var _AbstractCounter2 = require('./AbstractCounter');

var _IntentAnalytics = require('../IntentAnalytics');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YandexMetrika = (function (_AbstractCounter) {
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
})(_AbstractCounter2.AbstractCounter);

exports.YandexMetrika = YandexMetrika;

},{"../IntentAnalytics":1,"./AbstractCounter":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9JbnRlbnRBbmFseXRpY3MuanMiLCJqcy9hcHAuanMiLCJqcy9jb3VudGVycy9BYnN0cmFjdENvdW50ZXIuanMiLCJqcy9jb3VudGVycy9Hb29nbGVBbmFseXRpY3MuanMiLCJqcy9jb3VudGVycy9ZYW5kZXhNZXRyaWthLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0dNLGVBQWUsZ0JBQ25CO1dBREksZUFBZSxHQUNMOzBCQURWLGVBQWUsRUFFakI7O1FBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7ZUFIRyxlQUFlOztxQ0FLRixBQUNmO1VBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLEFBQ3ZCO1VBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ3ZCOzs7eUJBRUksWUFBWSxFQUFFLEFBQ2pCO1dBQUssSUFBTSxXQUFXLElBQUksWUFBWSxFQUFFLEFBQ3RDO1lBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxLQUFLLEVBQUUsQUFDdEQ7bUJBQVM7U0FDVixBQUNEO1lBQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxBQUMxQztZQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxBQUN6RTtZQUFJLFlBQVksS0FBSyxJQUFJLEVBQUUsQUFDekI7Y0FBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxZQUFZLENBQUM7U0FDL0M7T0FDRjtLQUNGOzs7K0JBYVUsV0FBVyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsQUFDOUM7VUFBSSxRQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0s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QUV2QixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDekQ7Ozt3QkF2QnVCO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7S0FDL0I7OztTQVJHLGVBQWU7cUJBSGIsZUFBZTs7UUFtQ2YsZUFBZSxHQUFmLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNoQ2pCLGFBQWE7WUFBYixhQUFhOztBQUNqQixXQURJLGFBQWEsQ0FDTCxvQkFBb0IsRUFBRSxNQUFNLEVBQUU7MEJBRHRDLGFBQWE7O2tFQUFiLGFBQWEsYUFFVCxvQkFBb0IsRUFBRSxNQUFNO0dBQ25DOztlQUhHLGFBQWE7OzBCQUtYLE1BQU0sRUFBRTtBQUNaLFVBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxBQUFDLEtBQUssV0FBVyxFQUFFO0FBQ3ZDLHlCQVRFLGVBQWUsQ0FTRCxRQUFRLENBQUMsNENBQTRDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2hHLGVBQU87T0FDUjtBQUNELFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUNwQixNQUFNLENBQUMsSUFBSSxFQUNYLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUNwQixDQUFDO0tBQ0g7OztrQ0FFYSxTQUFTLEVBQUU7QUFDdkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEM7OztTQWxCRyxhQUFhO3FCQUhYLGVBQWU7O1FBd0JmLGFBQWEsR0FBYixhQUFhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7R29vZ2xlQW5hbHl0aWNzfSBmcm9tICcuL2NvdW50ZXJzL0dvb2dsZUFuYWx5dGljcyc7XG5pbXBvcnQge1lhbmRleE1ldHJpa2F9IGZyb20gJy4vY291bnRlcnMvWWFuZGV4TWV0cmlrYSc7XG5cbmNsYXNzIEludGVudEFuYWx5dGljcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMoKTtcbiAgfVxuXG4gIGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHRoaXMuY291bnRlcnNMaXN0ID0ge307XG4gICAgdGhpcy5hY3Rpb25RdWV1ZSA9IHt9O1xuICB9XG5cbiAgaW5pdChjb3VudGVyc0xpc3QpIHtcbiAgICBmb3IgKGNvbnN0IGNvdW50ZXJUeXBlIGluIGNvdW50ZXJzTGlzdCkge1xuICAgICAgaWYgKGNvdW50ZXJzTGlzdC5oYXNPd25Qcm9wZXJ0eShjb3VudGVyVHlwZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgY291bnRlciA9IGNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV07XG4gICAgICBjb25zdCBjb3VudGVyQ2xhc3MgPSBJbnRlbnRBbmFseXRpY3MuY3JlYXRlQ291bnRlcihjb3VudGVyLCBjb3VudGVyVHlwZSk7XG4gICAgICBpZiAoY291bnRlckNsYXNzICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXSA9IGNvdW50ZXJDbGFzcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlQ291bnRlcihjb3VudGVyLCBjb3VudGVyVHlwZSkge1xuICAgIHN3aXRjaCAoY291bnRlclR5cGUpIHtcbiAgICBjYXNlICdHb29nbGVBbmFseXRpY3MnOlxuICAgICAgcmV0dXJuIG5ldyBHb29nbGVBbmFseXRpY3MoY291bnRlci5qYXZhc2NyaXB0T2JqZWN0TmFtZSwgY291bnRlcik7XG4gICAgY2FzZSAnWWFuZGV4TWV0cmlrYSc6XG4gICAgICByZXR1cm4gbmV3IFlhbmRleE1ldHJpa2EoY291bnRlci5qYXZhc2NyaXB0T2JqZWN0TmFtZSwgY291bnRlcik7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZFRvUXVldWUoY291bnRlclR5cGUsIGZ1bmN0aW9uTmFtZSwgYXJndW1lbnQpIHtcbiAgICBpZiAodHlwZW9mKHRoaXMuYWN0aW9uUXVldWVbY291bnRlclR5cGVdKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuYWN0aW9uUXVldWVbY291bnRlclR5cGVdID0gW107XG4gICAgfVxuICAgIHRoaXMuYWN0aW9uUXVldWVbY291bnRlclR5cGVdLnB1c2goe1xuICAgICAgJ2Z1bmN0aW9uTmFtZSc6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICdhcmd1bWVudCc6IGFyZ3VtZW50LFxuICAgIH0pO1xuICB9XG5cbiAgY2hlY2tVbmhhbmRsZWQoKSB7XG4gICAgZm9yIChjb25zdCBjb3VudGVyVHlwZSBpbiB0aGlzLmFjdGlvblF1ZXVlKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb25RdWV1ZS5oYXNPd25Qcm9wZXJ0eShjb3VudGVyVHlwZSkgJiYgdHlwZW9mKHRoaXMuYWN0aW9uUXVldWVbY291bnRlclR5cGVdKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gLmNvdW50ZXIgZ2V0dGVyIHdpbGwgY2hlY2sgaWYgY291bnRlciBnbG9iYWwgb2JqZWN0KGllLiBnYSwgeWFDb3VudGVyKSBub3cgZXhpc3RzXG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXJzTGlzdC5oYXNPd25Qcm9wZXJ0eShjb3VudGVyVHlwZSkgJiYgdGhpcy5jb3VudGVyc0xpc3RbY291bnRlclR5cGVdLmNvdW50ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHF1ZXVlSXRlbXMgb2YgdGhpcyBjb3VudGVyXG4gICAgICAgICAgY29uc3QgY291bnRlckNsYXNzID0gdGhpcy5jb3VudGVyc0xpc3RbY291bnRlclR5cGVdO1xuICAgICAgICAgIGZvciAoY29uc3QgcXVldWVJdGVtIG9mIHRoaXMuYWN0aW9uUXVldWVbY291bnRlclR5cGVdKSB7XG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBxdWV1ZUl0ZW0uZnVuY3Rpb25OYW1lO1xuICAgICAgICAgICAgY29uc3QgYXJndW1lbnQgPSBxdWV1ZUl0ZW0uYXJndW1lbnQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb3VudGVyQ2xhc3NbZnVuY3Rpb25OYW1lXShhcmd1bWVudCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIEludGVudEFuYWx5dGljcy5sb2dFcnJvcihgRXhjZXB0aW9uIGR1cmluZyBxdWV1ZWQgJHtmdW5jdGlvbk5hbWV9IGNhbGw6ICR7SlNPTi5zdHJpbmdpZnkoZSl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGRpc2FibGUgcXVldWUgZm9yIHRoaXMgY291bnRlciBhcyBpdCBpcyBub3QgbmVlZGVkIGFueW1vcmVcbiAgICAgICAgICAvLyBhbGwgbmV4dCBjYWxscyB0byB0aGlzIGNvdW50ZXIgc2hvdWxkIGJlIGhhbmRsZWQgb2tcbiAgICAgICAgICB0aGlzLmFjdGlvblF1ZXVlW2NvdW50ZXJUeXBlXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdHJhY2soY291bnRlcnNJbnN0cnVjdGlvbnMpIHtcbiAgICB0aGlzLmNoZWNrVW5oYW5kbGVkKCk7XG4gICAgZm9yIChjb25zdCBjb3VudGVyVHlwZSBpbiBjb3VudGVyc0luc3RydWN0aW9ucykge1xuICAgICAgaWYgKGNvdW50ZXJzSW5zdHJ1Y3Rpb25zLmhhc093blByb3BlcnR5KGNvdW50ZXJUeXBlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gY291bnRlcnNJbnN0cnVjdGlvbnNbY291bnRlclR5cGVdO1xuICAgICAgaWYgKHRoaXMuY291bnRlcnNMaXN0W2NvdW50ZXJUeXBlXS5jb3VudGVyID09PSBudWxsKSB7XG4gICAgICAgIC8vIGlmIGdsb2JhbCBqcyBvYmplY3Qgb2YgY291bnRlciBpcyBub3QgbG9hZGVkIC0gdGhpcyB3aWxsIGFkZCBpdCB0byBxdWV1ZVxuICAgICAgICB0aGlzLmFkZFRvUXVldWUoY291bnRlclR5cGUsICd0cmFjaycsIGluc3RydWN0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXJzTGlzdC5oYXNPd25Qcm9wZXJ0eShjb3VudGVyVHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb3VudGVyc0xpc3RbY291bnRlclR5cGVdLnRyYWNrKGluc3RydWN0aW9uKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBJbnRlbnRBbmFseXRpY3MubG9nRXJyb3IoJ0V4Y2VwdGlvbiBkdXJpbmcgdHJhY2sgY2FsbDogJyArIEpTT04uc3RyaW5naWZ5KGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZW5kVmFyaWFibGVzKHZhcmlhYmxlcykge1xuICAgIHRoaXMuY2hlY2tVbmhhbmRsZWQoKTtcbiAgICBmb3IgKGNvbnN0IGNvdW50ZXJUeXBlIGluIHRoaXMuY291bnRlcnNMaXN0KSB7XG4gICAgICBpZiAodGhpcy5jb3VudGVyc0xpc3QuaGFzT3duUHJvcGVydHkoY291bnRlclR5cGUpID09PSBmYWxzZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvdW50ZXIgPSB0aGlzLmNvdW50ZXJzTGlzdFtjb3VudGVyVHlwZV07XG4gICAgICBpZiAoY291bnRlci5jb3VudGVyID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYWRkVG9RdWV1ZShjb3VudGVyVHlwZSwgJ3NlbmRWYXJpYWJsZXMnLCB2YXJpYWJsZXMpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY291bnRlci5zZW5kVmFyaWFibGVzKHZhcmlhYmxlcyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIEludGVudEFuYWx5dGljcy5sb2dFcnJvcignRXhjZXB0aW9uIGR1cmluZyBzZW5kVmFyaWFibGVzIGNhbGw6ICcgKyBKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGxvZ0Vycm9yKG1lc3NhZ2UpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgaWYgKHR5cGVvZihjb25zb2xlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH1cbiAgICAvKmVzbGludC1lbmFibGUqL1xuICB9XG59XG5cbmV4cG9ydCB7SW50ZW50QW5hbHl0aWNzfTtcbiIsImltcG9ydCB7SW50ZW50QW5hbHl0aWNzfSBmcm9tICcuL0ludGVudEFuYWx5dGljcyc7XG5nbG9iYWwuaW50ZW50QW5hbHl0aWNzID0gbmV3IEludGVudEFuYWx5dGljcygpO1xuIiwiY2xhc3MgQWJzdHJhY3RDb3VudGVyIHtcbiAgLy8gSGVyZSB3ZSB0dXJuIG9mZiBuby11bnVzZWQtdmFycyB3YXJuaW5nIGJlY2F1c2UgdGhpcyBjbGFzcyBpcyBhY3R1YWxseSBhYnN0cmFjdC5cbiAgLy8gU28gdGhlcmUncyBhIGxvdCBvZiB1bnVzZWQgdmFycyBhbmQgaXQgaXMgbm9ybWFsIC0gd2UganVzdCB3YW50IHRvIGRlc2NyaWJlIHRoZSB3aG9sZSBpbnRlcmZhY2UuXG4gIC8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCovXG4gIGNvbnN0cnVjdG9yKGphdmFzY3JpcHRPYmplY3ROYW1lLCBwYXJhbXMpIHtcbiAgICB0aGlzLmphdmFzY3JpcHRPYmplY3ROYW1lID0gamF2YXNjcmlwdE9iamVjdE5hbWU7XG4gIH1cblxuICBzdGF0aWMgZ2V0Q291bnRlck9iamVjdChqYXZhc2NyaXB0T2JqZWN0TmFtZSkge1xuICAgIHJldHVybiB3aW5kb3dbamF2YXNjcmlwdE9iamVjdE5hbWVdIHx8IG51bGw7XG4gIH1cblxuICB0cmFjayhwYXJhbXMpIHtcbiAgfVxuXG4gIHNlbmRWYXJpYWJsZXModmFyaWFibGVzKSB7XG5cbiAgfVxuXG4gIGdldCBjb3VudGVyKCkge1xuICAgIHJldHVybiBBYnN0cmFjdENvdW50ZXIuZ2V0Q291bnRlck9iamVjdCh0aGlzLmphdmFzY3JpcHRPYmplY3ROYW1lKTtcbiAgfVxuXG59XG5cbmV4cG9ydCB7QWJzdHJhY3RDb3VudGVyfTtcbiIsImltcG9ydCB7QWJzdHJhY3RDb3VudGVyfSBmcm9tICcuL0Fic3RyYWN0Q291bnRlcic7XG5pbXBvcnQge0ludGVudEFuYWx5dGljc30gZnJvbSAnLi4vSW50ZW50QW5hbHl0aWNzJztcblxuY2xhc3MgR29vZ2xlQW5hbHl0aWNzIGV4dGVuZHMgQWJzdHJhY3RDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoamF2YXNjcmlwdE9iamVjdE5hbWUgPSAnZ2EnLCBwYXJhbXMgPSB7fSkge1xuICAgIHN1cGVyKGphdmFzY3JpcHRPYmplY3ROYW1lLCBwYXJhbXMpO1xuICAgIHRoaXMudHJhY2tlck5hbWUgPSBwYXJhbXMudHJhY2tlck5hbWUgfHwgJyc7XG4gIH1cblxuICBnZXQgdHJhY2tlclNlbmRQcmVmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2tlck5hbWUgfHwgJyc7XG4gIH1cblxuICB0cmFjayhwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mKHBhcmFtcy5hY3Rpb24pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgSW50ZW50QW5hbHl0aWNzLmxvZ0Vycm9yKCdObyBhY3Rpb24gc3VwcGxpZWQgZm9yIEdvb2dsZUFuYWx5dGljcy50cmFjazogJyArIEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSB0aGlzLnRyYWNrZXJTZW5kUHJlZml4ICsgJ3NlbmQnO1xuXG4gICAgdGhpcy5jb3VudGVyKGZ1bmN0aW9uTmFtZSwge1xuICAgICAgJ2hpdFR5cGUnOiAnZXZlbnQnLFxuICAgICAgJ2V2ZW50Q2F0ZWdvcnknOiBwYXJhbXMuY2F0ZWdvcnkgfHwgJ2NvbW1vbicsXG4gICAgICAnZXZlbnRBY3Rpb24nOiBwYXJhbXMuYWN0aW9uLFxuICAgICAgJ2V2ZW50TGFiZWwnOiBwYXJhbXMubGFiZWwgfHwgdW5kZWZpbmVkLFxuICAgICAgJ2V2ZW50VmFsdWUnOiBwYXJhbXMudmFsdWUgfHwgdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG5cbiAgc2VuZFZhcmlhYmxlcyh2YXJpYWJsZXMpIHtcbiAgICAvLyEgQHRvZG8gVGhpbmsgb2YgYmlnIGRlcHRoIC0gZ2EgZG9lc24ndCBhY2NlcHQgaXQuXG4gICAgdGhpcy5jb3VudGVyKHRoaXMudHJhY2tlclNlbmRQcmVmaXggKyAnc2V0JywgdmFyaWFibGVzKTtcbiAgfVxufVxuXG5leHBvcnQge0dvb2dsZUFuYWx5dGljc307XG4iLCJpbXBvcnQge0Fic3RyYWN0Q291bnRlcn0gZnJvbSAnLi9BYnN0cmFjdENvdW50ZXInO1xuaW1wb3J0IHtJbnRlbnRBbmFseXRpY3N9IGZyb20gJy4uL0ludGVudEFuYWx5dGljcyc7XG5cbmNsYXNzIFlhbmRleE1ldHJpa2EgZXh0ZW5kcyBBYnN0cmFjdENvdW50ZXIge1xuICBjb25zdHJ1Y3RvcihqYXZhc2NyaXB0T2JqZWN0TmFtZSwgcGFyYW1zKSB7XG4gICAgc3VwZXIoamF2YXNjcmlwdE9iamVjdE5hbWUsIHBhcmFtcyk7XG4gIH1cblxuICB0cmFjayhwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mKHBhcmFtcy5nb2FsKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIEludGVudEFuYWx5dGljcy5sb2dFcnJvcignTm8gZ29hbCBzdXBwbGllZCBmb3IgWWFuZGV4TWV0cmlrYS50cmFjazogJyArIEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNvdW50ZXIucmVhY2hHb2FsKFxuICAgICAgcGFyYW1zLmdvYWwsXG4gICAgICBwYXJhbXMucGFyYW1zIHx8IHt9XG4gICAgKTtcbiAgfVxuXG4gIHNlbmRWYXJpYWJsZXModmFyaWFibGVzKSB7XG4gICAgdGhpcy5jb3VudGVyLnBhcmFtcyh2YXJpYWJsZXMpO1xuICB9XG59XG5cbmV4cG9ydCB7WWFuZGV4TWV0cmlrYX07XG4iXX0=
