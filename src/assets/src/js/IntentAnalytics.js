let instance = null;

class IntentAnalytics {
    /**
     * Singleton
     * @return {*}
     */
    constructor() {
        if (null === instance || (false === instance instanceof this)) {
            this.counters = new Map();
            this.events = new Map();
            this.moduleMap = new Map();
            instance = this;
        }
    }

    /**
     * Add module
     * @param jsModule
     * @param jsObject
     * @return {IntentAnalytics}
     */
    addModule(jsModule, jsObject) {
        this.moduleMap.set(jsModule, jsObject);

        return this;
    }

    /**
     * Add counter
     * @param counter
     * @return {IntentAnalytics}
     */
    addCounter(counter) {
        const has = Object.prototype.hasOwnProperty;
        if (false === has.call(counter, 'jsModule') || false === this.moduleMap.has(counter.jsModule)) {
            return this;
        }
        const jsModule = this.moduleMap.get(counter.jsModule);
        this.counters.set(counter.id, new jsModule(this, counter));

        return this;
    }

    /**
     * Add event
     * @param jsModule
     * @param type
     * @param options
     * @return {IntentAnalytics}
     */
    addEvent({jsModule, type, options = {}}) {
        if (!this.moduleMap.has(jsModule)) {
            return this;
        }
        jsModule = this.moduleMap.get(jsModule);

        let _array = this.events.has(type) ? this.events.get(type) : [];
        _array.push(new jsModule(this, options));
        this.events.set(type, _array);

        return this;
    }

    /**
     * Add counters
     * @param countersArray
     * @return {IntentAnalytics}
     */
    addCounters(countersArray) {
        for (let counter of countersArray) {
            this.addCounter(counter);
        }
        return this;
    }

    /**
     * Add events
     * @param events
     * @return {IntentAnalytics}
     */
    addEvents(events) {
        for (let event of events) {
            this.addEvent(event);
        }

        return this;
    }

    static logError(message) {
        /*eslint-disable */
        if (typeof(console) !== 'undefined') {
            console.log(message);
        }
        /*eslint-enable*/
    }
}

export {IntentAnalytics};
