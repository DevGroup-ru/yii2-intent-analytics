import {CounterInterface} from './CounterInterface';
import {IntentAnalytics} from '../IntentAnalytics';

class YandexMetrika extends CounterInterface {
    /**
     * @param options
     */
    init(options) {
        this.eventsQueue = new Map();
        super.init(options);
    }

    /**
     * @param name
     * @return {{}}
     */
    resolveJsObject(name) {
        document.addEventListener(
            String(`${name}${this.counterId}inited`).toLowerCase(),
            () => {
                if ('undefined' !== typeof window[name + this.counterId]) {
                    this.jsObject = window[name + this.counterId];
                    this.counterSet = true;
                } else {
                    IntentAnalytics.logError(`Cant initialize YandexCounter with id '${this.counterId}'`);
                }
            }
        );
    }

    /**
     * @param event
     * @param data
     * @param params
     */
    sendEvent(event, data, params) {
        //some kind of queue for Yandex before counter not yet initialized
        //Google has own queue
        if (false === this.counterSet) {
            this.eventsQueue.set(Symbol(), {event, data, params});
        } else {
            if (this.eventsQueue.size > 0) {
                for (const [key, value] of this.eventsQueue) {
                    this.send(value);
                    this.eventsQueue.delete(key);
                }
            }
            this.send({event, data, params});
        }
    }

    /**
     * @param event
     * @param data
     * @param params
     */
    send({event, data, params}) {
        //this.jsObject.reachGoal(event, params || {});
    }
}

export {YandexMetrika};
