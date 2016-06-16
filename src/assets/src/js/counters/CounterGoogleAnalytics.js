import {CounterInterface} from './CounterInterface';

class CounterGoogleAnalytics extends CounterInterface {
    /**
     * @param options
     */
    init(options) {
        super.init(options);
    }

    /**
     * @param name
     * @return {{}}
     */
    resolveJsObject(name) {
        return window[name] || super.resolveJsObject(name);
    }

    /**
     * @param event
     * @param data
     * @param params
     */
    sendEvent(event, data, params) {
        // this.jsObject('send', 'event', );
    }
}

export {CounterGoogleAnalytics};
