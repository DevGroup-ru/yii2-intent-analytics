import {CounterInterface} from './CounterInterface';

class CounterYandexMetrika extends CounterInterface {
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
        return window[`yaCounter${name}`] || super.resolveJsObject(name);
    }

    /**
     * @param event
     * @param data
     * @param params
     */
    sendEvent(event, data, params) {
        console.log(event);
        //this.jsObject.reachGoal(event, params || {});
    }
}

export {CounterYandexMetrika};
