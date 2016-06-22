//import {IntentAnalytics} from './IntentAnalytics';
import {UnionAnalytics} from './UnionAnalytics';

import {CounterGoogleAnalytics} from './counters/CounterGoogleAnalytics';
import {CounterYandexMetrika} from './counters/CounterYandexMetrika';
import {CounterPiwik} from './counters/CounterPiwik';
import {Click} from './events/Click';
import {Submit} from './events/Submit';

let ua = new UnionAnalytics();
ua.addModule('CounterGoogleAnalytics', CounterGoogleAnalytics);
ua.addModule('CounterYandexMetrika', CounterYandexMetrika);
ua.addModule('CounterPiwik', CounterPiwik);
ua.addModule('Click', Click);
ua.addModule('Submit', Submit);

//global.intentAnalytics = new IntentAnalytics();
global.UnionAnalytics = ua;
