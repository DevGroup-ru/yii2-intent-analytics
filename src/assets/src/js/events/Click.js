import {EventInterface} from './EventInterface';

class Click extends EventInterface {
    init(options) {
        super.init(options);

        if (options.hasOwnProperty('selectors')) {
            for (let selector of options.selectors) {
                let elements = window.document.querySelectorAll(selector);
                for (let el of elements) {
                    el.addEventListener('click', (event) => this.eventHandler(event));
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
            counter.sendEvent('click', {}, {});
        }
    }
}

export {Click};
