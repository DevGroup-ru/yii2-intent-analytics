import {EventInterface} from './EventInterface';
import {TYPE_GA, TYPE_YA, TYPE_PI} from '../counters/CounterInterface';

class Click extends EventInterface {
    init(options) {
        super.init(options);

        if (options.hasOwnProperty('selectors')) {
            for (let i = 0; i < options.selectors.length; i++) {
                let q = window.document.querySelectorAll(options.selectors[i]);
                for (let ii = 0; ii < q.length; ii++) {
                    q[ii].addEventListener('click', (event) => this.eventHandler(event));
                }
            }
        }
    }

    /**
     * Handler
     * @param event
     */
    eventHandler(event) {
        this.sendData();
    }

    /**
     * @param params
     */
    trigger(params) {
        super.trigger(params);
        this.sendData();
    }

    /**
     *
     */
    sendData() {
        for (let counter of this.locator.counters.values()) {
            if (TYPE_GA == counter.type) {
                window[counter.jsObject]('send', 'event', 'Action', 'click', 'Click');
            }
        }
    }
}

export {Click};
