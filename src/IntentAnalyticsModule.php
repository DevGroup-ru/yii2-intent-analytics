<?php

namespace DevGroup\Analytics;

use Yii;
use yii\base\Module;

/**
 * Class IntentAnalyticsModule is the base module class for yii2-intent-analytics package!
 *
 * @package DevGroup\Analytics
 */
class IntentAnalyticsModule extends Module
{
    /**
     * Name of javascript google analytics object. Usually 'ga'.
     * Set to false or empty string if you don't want to use this counter.
     *
     * @var string
     */
    public $gaObject = 'ga';

    /**
     * If you are using multiple trackers - here should be the prefix of tracker with trailing dot,
     * that will be used by this module. For example - 'newTracker.'.
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#multipletrackers
     *
     * @var string
     */
    public $gaTrackerPrefix = '';

    /**
     * Name of javascript Yandex metrika counter object.
     * Usually in format of 'yaCounterX', where X is counter id
     * Set to false or empty string if you don't want to use this counter.
     *
     * @var string
     */
    public $yaCounterObject = 'yaCounter21370474';

    /**
     * Detect first visit source
     *
     * @var bool
     */
    public $detectFirstVisitSource = true;

    /**
     * Detect all visits source
     *
     * @var bool
     */
    public $detectAllVisitsSources = true;

    /**
     * Store last activity information
     *
     * @var bool
     */
    public $storeLastActivity = true;

    /**
     * Store information about visits of all pages
     *
     * @var bool
     */
    public $storeVisitedPages = true;
}
