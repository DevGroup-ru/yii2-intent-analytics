import {CounterInterface} from './CounterInterface';
import {IntentAnalytics} from '../IntentAnalytics';

class GoogleAnalytics extends CounterInterface {
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
        if (typeof window[name] === "function") {
            window[name](() => {
                try {
                    this.jsObject = window[name].getByName(this.title);
                    this.counterSet = true;
                } catch ($e) {
                    IntentAnalytics.logError(`Cant initialize GoogleCounter with title '${this.title}'`);
                }
            });
        } else {
            IntentAnalytics.logError(`Global Google Analytics function '${name}' not found!`);
        }
    }

    /**
     * @param event
     * @param data
     * @param params
     */
    sendEvent(event, data, params) {
        if (true === this.counterSet) {
            // this.jsObject('send', 'event', );
        }
    }
}

export {GoogleAnalytics};
