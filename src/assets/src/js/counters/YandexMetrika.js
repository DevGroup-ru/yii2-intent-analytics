import {AbstractCounter} from './AbstractCounter';
import {IntentAnalytics} from '../IntentAnalytics';

class YandexMetrika extends AbstractCounter {
  constructor(javascriptObjectName, params) {
    super(javascriptObjectName, params);
  }

  track(params) {
    if (typeof(params.goal) === 'undefined') {
      IntentAnalytics.logError('No goal supplied for YandexMetrika.track: ' + JSON.stringify(params));
      return;
    }
    this.counter.reachGoal(
      params.goal,
      params.params || {}
    );
  }

  sendVariables(variables) {
    this.counter.params(variables);
  }
}

export {YandexMetrika};
