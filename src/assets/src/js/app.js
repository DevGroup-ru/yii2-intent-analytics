import {IntentAnalytics} from './IntentAnalytics';

import {GoogleAnalytics} from './counters/GoogleAnalytics';
import {YandexMetrika} from './counters/YandexMetrika';
import {Piwik} from './counters/Piwik';
import {Click} from './events/Click';
import {Submit} from './events/Submit';

let ua = new IntentAnalytics();
ua.addModule('GoogleAnalytics', GoogleAnalytics);
ua.addModule('YandexMetrika', YandexMetrika);
ua.addModule('Piwik', Piwik);
ua.addModule('Click', Click);
ua.addModule('Submit', Submit);
global.IntentAnalytics = ua;
