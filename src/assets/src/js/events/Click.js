import {EventInterface} from './EventInterface';

class Click extends EventInterface {

    get eventName () {
        return 'click';
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

export {Click};
