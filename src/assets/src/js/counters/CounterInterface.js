class CounterInterface {
    constructor(locator, jsObject, options) {
        this.locator = locator;
        this.jsObject = jsObject;
        this.rawOptions = options;
        this.init(options);
    }

    /**
     * Init
     * @param options
     */
    init(options) {
    }

    /**
     * Return type of counter as string
     * @returns {*}
     */
    get type() {
        return '';
    }
}

const TYPE_GA = 'Google Analytics';
const TYPE_YA = 'Yandex.Metrika';
const TYPE_PI = 'Piwik';

export {CounterInterface, TYPE_GA, TYPE_YA, TYPE_PI};
