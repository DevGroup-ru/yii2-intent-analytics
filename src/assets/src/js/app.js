import {IntentAnalytics} from './IntentAnalytics';
import {_iaq} from './UnionAnalytics';

global.intentAnalytics = new IntentAnalytics();
global._iaq = _iaq;
