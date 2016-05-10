import {CounterInterface, TYPE_YA} from './CounterInterface';

class CounterYandexMetrika extends CounterInterface {
    init(options) {
        super.init(options);
    }

    /**
     */
    get type() {
        return TYPE_YA;
    }
}

export {CounterYandexMetrika};
