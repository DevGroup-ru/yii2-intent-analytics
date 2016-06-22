let instance = null;

class UnionAnalytics {
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
     * @return {UnionAnalytics}
     */
    addModule(jsModule, jsObject) {
        this.moduleMap.set(jsModule, jsObject);

        return this;
    }

    /**
     * Add counter
     * @param id
     * @param jsModule
     * @param jsObject
     * @param options
     * @return {UnionAnalytics}
     */
    addCounter({id, jsModule, jsObject, options = {}}) {
        if (!this.moduleMap.has(jsModule)) {
            return this;
        }
        jsModule = this.moduleMap.get(jsModule);
        this.counters.set(id, new jsModule(this, jsObject, options));

        return this;
    }

    /**
     * Add event
     * @param jsModule
     * @param type
     * @param options
     * @return {UnionAnalytics}
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
     * @return {UnionAnalytics}
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
     * @return {UnionAnalytics}
     */
    addEvents(events) {
        for (let event of events) {
            this.addEvent(event);
        }

        return this;
    }

    /**
     * Trigger an event
     * @param type
     * @param params
     * @return {UnionAnalytics}
     */
    trigger(type, params) {
        let _array = this.events.has(type) ? this.events.get(type) : [];
        for (let event of _array) {
            event.trigger(params);
        }

        return this;
    }
}

export {UnionAnalytics};
