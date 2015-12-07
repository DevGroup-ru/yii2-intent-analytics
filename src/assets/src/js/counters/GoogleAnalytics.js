import {AbstractCounter} from './AbstractCounter';
import {IntentAnalytics} from '../IntentAnalytics';

class GoogleAnalytics extends AbstractCounter {
  constructor(javascriptObjectName = 'ga', params = {}) {
    super(javascriptObjectName, params);
    this.trackerName = params.trackerName || '';
  }

  get trackerSendPrefix() {
    return this.trackerName || '';
  }

  track(params) {
    if (typeof(params.action) === 'undefined') {
      IntentAnalytics.logError('No action supplied for GoogleAnalytics.track: ' + JSON.stringify(params));
      return;
    }
    const functionName = this.trackerSendPrefix + 'send';

    this.counter(functionName, {
      'hitType': 'event',
      'eventCategory': params.category || 'common',
      'eventAction': params.action,
      'eventLabel': params.label || undefined,
      'eventValue': params.value || undefined,
    });
  }

  sendVariables(variables) {
    //! @todo Think of big depth - ga doesn't accept it.
    this.counter(this.trackerSendPrefix + 'set', variables);
  }
}

export {GoogleAnalytics};
