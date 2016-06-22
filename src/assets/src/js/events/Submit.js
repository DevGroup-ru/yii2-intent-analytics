import {EventInterface} from './EventInterface';

class Submit extends EventInterface {

    get eventName () {
        return 'submit';
    }

    /**
     * Handler
     * @param event
     */
    handle(event) {
        for (let counter of this.locator.counters.values()) {
            counter.sendEvent(event, {}, {});
        }
    }
}

export {Submit};
