class CounterInterface {

    /**
     * Here we turn off no-unused-vars warning because this class is actually abstract.
     * So there's a lot of unused vars and it is normal - we just want to describe the whole interface.
     *
     * eslint no-unused-vars: 0
     *
     * @param locator {IntentAnalytics}
     * @param counter
     */
    constructor(locator, counter) {
        Object.assign(this, counter);
        this.counterSet = false;
        this.locator = locator;
        this.init(counter.options);
        this.resolveJsObject(counter.jsObject);
    }

    /**
     * Init
     * @param options
     */
    init(options) {
    }

    /**
     * @param name
     * @return {{}}
     */
    resolveJsObject(name) {
        return {};
    }
    
    /**
     * Send event
     * @param event
     * @param data
     * @param params
     */
    sendEvent(event, data, params) {
    }
}

export {CounterInterface};
