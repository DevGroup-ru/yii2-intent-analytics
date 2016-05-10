import {CounterInterface, TYPE_PI} from './CounterInterface';

class CounterPiwik extends CounterInterface {
    init(options) {
        super.init(options);
    }

    /**
     */
    get type() {
        return TYPE_PI;
    }
}

export {CounterPiwik};
