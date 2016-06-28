import {GoogleAnalytics} from './counters/GoogleAnalytics';
import {YandexMetrika} from './counters/YandexMetrika';

class IntentAnalytics {
  constructor() {
    this.defaultOptions();
  }

  defaultOptions() {
    this.countersList = {};
    this.actionQueue = {};
  }

  init(countersList) {
    for (const counterType in countersList) {
      if (countersList.hasOwnProperty(counterType) === false) {
        continue;
      }
      const counter = countersList[counterType];
      const counterClass = IntentAnalytics.createCounter(counter, counterType);
      if (counterClass !== null) {
        this.countersList[counterType] = counterClass;
      }
    }
  }

  static createCounter(counter, counterType) {
      if (typeof [counterType] === 'function') {
          return new [counterType](counter.javascriptObjectName, counter);
      } else {
          return null;
      }
  }

  addToQueue(counterType, functionName, argument) {
    if (typeof(this.actionQueue[counterType]) !== 'object') {
      this.actionQueue[counterType] = [];
    }
    this.actionQueue[counterType].push({
      'functionName': functionName,
      'argument': argument
    });
  }

  checkUnhandled() {
    for (const counterType in this.actionQueue) {
      if (this.actionQueue.hasOwnProperty(counterType) && typeof(this.actionQueue[counterType]) === 'object') {
        // .counter getter will check if counter global object(ie. ga, yaCounter) now exists
        if (this.countersList.hasOwnProperty(counterType) && this.countersList[counterType].counter !== null) {
          // loop through all queueItems of this counter
          const counterClass = this.countersList[counterType];
          for (const queueItem of this.actionQueue[counterType]) {
            const functionName = queueItem.functionName;
            const argument = queueItem.argument;
            try {
              counterClass[functionName](argument);
            } catch (e) {
              IntentAnalytics.logError(`Exception during queued ${functionName} call: ${JSON.stringify(e)}`);
            }
          }
          // disable queue for this counter as it is not needed anymore
          // all next calls to this counter should be handled ok
          this.actionQueue[counterType] = false;
        }
      }
    }
  }

  track(countersInstructions) {
    this.checkUnhandled();
    for (const counterType in countersInstructions) {
      if (countersInstructions.hasOwnProperty(counterType) === false) {
        continue;
      }

      const instruction = countersInstructions[counterType];
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

  sendVariables(variables) {
    this.checkUnhandled();
    for (const counterType in this.countersList) {
      if (this.countersList.hasOwnProperty(counterType) === false) {
        continue;
      }
      const counter = this.countersList[counterType];
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

  static logError(message) {
    /*eslint-disable */
    if (typeof(console) !== 'undefined') {
      console.log(message);
    }
    /*eslint-enable*/
  }
}

export {IntentAnalytics};
