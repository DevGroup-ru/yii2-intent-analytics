import {CounterGoogleAnalytics} from './counters/CounterGoogleAnalytics';
import {CounterYandexMetrika} from './counters/CounterYandexMetrika';
import {CounterPiwik} from './counters/CounterPiwik';
import {Click} from './events/Click';

class UnionAnalytics {
    constructor() {
        this.counters = new Map();
        this.events = new Map();
        this.moduleMap = new Map();

        this.moduleMap.set('CounterGoogleAnalytics', CounterGoogleAnalytics);
        this.moduleMap.set('CounterYandexMetrika', CounterYandexMetrika);
        this.moduleMap.set('CounterPiwik', CounterPiwik);
        this.moduleMap.set('Click', Click);
    }

    /**
     * Add module
     * @param jsModule
     * @param jsObject
     */
    addModule(jsModule, jsObject) {
        this.moduleMap.set(jsModule, jsObject);
    }

    /**
     * Add counter
     * @param jsModule
     * @param id
     * @param jsObject
     * @param options
     */
    addCounter(id, jsModule, jsObject, options) {
        if (!this.moduleMap.has(jsModule)) {
            return ;
        }
        jsModule = this.moduleMap.get(jsModule);
        this.counters.set(id, new jsModule(this, jsObject, options));
    }

    /**
     * Add event
     * @param jsModule
     * @param type
     * @param options
     */
    addEvent(jsModule, type, options) {
        if (!this.moduleMap.has(jsModule)) {
            return ;
        }
        jsModule = this.moduleMap.get(jsModule);

        let _array = this.events.has(type) ? this.events.get(type) : [];
        _array.push(new jsModule(this, options));
        this.events.set(type, _array);
    }

    /**
     * Add counters
     * @param counters
     */
    addCounters(counters) {
        for (let counter of counters) {
            this.addCounter(counter.id, counter.jsModule, counter.jsObject, counter.options);
        }
    }

    /**
     * Add events
     * @param events
     */
    addEvents(events) {
        for (let event of events) {
            this.addEvent(event.jsModule, event.type, event.options);
        }
    }

    /**
     * Trigger an event
     * @param type
     * @param params
     */
    trigger(type, params) {
        let _array = this.events.has(type) ? this.events.get(type) : [];
        for (let event of _array) {
            event.trigger(params);
        }
    }
}

export const _iaq = new UnionAnalytics();
