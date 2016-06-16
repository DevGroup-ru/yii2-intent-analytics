class CounterInterface {
    /**
     * @param locator
     * @param jsObject
     * @param options
     */
    constructor(locator, jsObject, options) {
        this.locator = locator;
        this.jsObject = this.resolveJsObject(jsObject);
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
