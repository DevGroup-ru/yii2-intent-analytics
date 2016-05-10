import {CounterInterface, TYPE_GA} from './CounterInterface';

class CounterGoogleAnalytics extends CounterInterface {
    init(options) {
        super.init(options);
    }

    /**
     */
    get type() {
        return TYPE_GA;
    }
}

export {CounterGoogleAnalytics};
