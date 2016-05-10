class EventInterface {
    /**
     * @param locator UnionAnalytics
     * @param options
     */
    constructor(locator, options) {
        this.locator = locator;
        this.init(options);
    }

    /**
     * Init
     * @param options
     */
    init(options) {
    }

    /**
     * Trigger
     * @param params
     */
    trigger(params) {
    }
}

export {EventInterface};
