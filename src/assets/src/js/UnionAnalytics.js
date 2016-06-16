let instance = null;
let counters = new Map();
let events = new Map();
let moduleMap = new Map();

class UnionAnalytics {
  /**
   * Singleton
   * @return {*}
   */
  constructor() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }

  /**
   * Singleton
   * @return {UnionAnalytics}
   */
  static getInstance() {
    if (!instance) {
      instance = new UnionAnalytics();
    }

    return instance;
  }

  /**
   * Add module
   * @param jsModule
   * @param jsObject
   * @return {UnionAnalytics}
   */
  addModule(jsModule, jsObject) {
    moduleMap.set(jsModule, jsObject);

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
  addCounter(id, jsModule, jsObject, options) {
    if (!moduleMap.has(jsModule)) {
      return this;
    }
    jsModule = moduleMap.get(jsModule);
    counters.set(id, new jsModule(this, jsObject, options));

    return this;
  }

  /**
   * Add event
   * @param jsModule
   * @param type
   * @param options
   * @return {UnionAnalytics}
   */
  addEvent(jsModule, type, options) {
    if (!moduleMap.has(jsModule)) {
      return this;
    }
    jsModule = moduleMap.get(jsModule);

    let _array = events.has(type) ? events.get(type) : [];
    _array.push(new jsModule(this, options));
    events.set(type, _array);

    return this;
  }

  /**
   * Add counters
   * @param counters
   * @return {UnionAnalytics}
   */
  addCounters(counters) {
    for (let counter of counters) {
      this.addCounter(counter.id, counter.jsModule, counter.jsObject, counter.options);
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
      this.addEvent(event.jsModule, event.type, event.options);
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
    let _array = events.has(type) ? events.get(type) : [];
    for (let event of _array) {
      event.trigger(params);
    }

    return this;
  }
}

export {UnionAnalytics};
