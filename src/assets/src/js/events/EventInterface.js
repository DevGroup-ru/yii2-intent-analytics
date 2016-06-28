class EventInterface {

    /**
     * @param locator IntentAnalytics
     * @param options
     */
    constructor(locator, options) {
        this.locator = locator;
        this.init(options);
        this.attachHandlers(options);
    }

    get eventName() {
        return '';
    }

    /**
     * Init
     * @param options
     */
    init(options) {

    }

    attachHandlers(options) {
        const has = Object.prototype.hasOwnProperty;
        if (options !== null && has.call(options, 'selectors')) {
            for (const selector of options.selectors) {
                const elements = document.querySelectorAll(selector);
                for (let i = 0; i < elements.length; i++) {
                    elements[i].addEventListener(this.eventName, (event) => this.handle(event));
                }
            }
        }
    }

    /**
     * Trigger
     * @param params
     */
    handle(params) {
    }
}

export {EventInterface};
