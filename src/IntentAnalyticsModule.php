<?php

namespace DevGroup\Analytics;

use DevGroup\Analytics\models\Visitor;
use Yii;
use yii\base\BootstrapInterface;
use yii\base\Module;
use yii\helpers\ArrayHelper;
use yii\web\Application;
use yii\web\Cookie;

/**
 * Class IntentAnalyticsModule is the base module class for yii2-intent-analytics package!
 *
 * @package DevGroup\Analytics
 */
class IntentAnalyticsModule extends Module implements BootstrapInterface
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

    /**
     * Cookie name for store visitor
     *
     * @var string
     */
    public $visitorCookieName = 'visitor_id';

    /**
     * Cookie lifetime in seconds. Defaults to 2 year (61516800)
     *
     * @var int
     */
    public $visitorCookieTime = 61516800;


    public $modelMap = [];

    protected $defaultModelMap = [
        'Visitor' => [
            'class' => 'DevGroup\Analytics\models\Visitor',
        ],
        'VisitorVisit' => [
            'class' => 'DevGroup\Analytics\models\Visitor',
        ],
    ];

    /**
     * @var Visitor
     */
    protected $visitor;

    /**
     * Bootstrap method to be called during application bootstrap stage.
     * @param Application $app the application currently running
     */
    public function bootstrap($app)
    {
        $this->buildModelMap();
        $app->on(Application::EVENT_AFTER_REQUEST, function () {
            $this->saveInfo();
        });
    }

    /**
     * Builds model map, setups di container
     */
    private function buildModelMap()
    {
        $this->modelMap = ArrayHelper::merge($this->defaultModelMap, $this->modelMap);
        foreach ($this->modelMap as $modelName => $configuration) {
            Yii::$container->set($configuration['class'], $configuration);
        }
    }

    /**
     * Create Visitor record
     *
     * @return int
     * @throws \yii\base\InvalidConfigException
     */
    private function createVisitor()
    {
        $this->visitor = Yii::$container->get($this->modelMap['Visitor']['class']);
        $this->visitor->save();
        return $this->visitor->getPrimaryKey();
    }

    /**
     * Store visitor_id in session and in cookie and save model
     *
     * @param int $visitor_id
     */
    private function saveVisitor()
    {
        Yii::$app->session->set($this->visitorCookieName, $this->visitor->getPrimaryKey());
        Yii::$app->response->cookies->add(new Cookie([
            'name' => $this->visitorCookieName,
            'value' => $this->visitor->getPrimaryKey(),
            'expire' => time() + $this->visitorCookieTime,
        ]));
    }

    /**
     * Check if visitor exists
     *
     * @param int $visitor_id
     * @return bool
     * @throws \yii\base\InvalidConfigException
     */
    private function hasVisitor($visitor_id)
    {
        /**
         * @var Visitor $model
         */
        $model = Yii::$container->get($this->modelMap['Visitor']['class']);
        $this->visitor = $model->find()
            ->where(['id' => $visitor_id])
            ->one();
        return boolval($this->visitor);
    }

    /**
     * Return current Visitor
     *
     * @return Visitor
     */
    public function getVisitor()
    {
        if (Yii::$app->session->has($this->visitorCookieName)) {
            $visitor_id = Yii::$app->session->get($this->visitorCookieName);
        } elseif (Yii::$app->request->cookies->has($this->visitorCookieName)) {
            $visitor_id = Yii::$app->request->cookies->get($this->visitorCookieName);
        }
        if (!isset($visitor_id) || !$this->hasVisitor($visitor_id)) {
            $this->createVisitor();
        }

        $this->saveVisitor();
        return $this->visitor;
    }

    /**
     * Fills $this->visitor
     */
    public function saveInfo()
    {
        $this->getVisitor();

        if (!$this->visitor->hasUser() && !Yii::$app->user->isGuest) {
            $this->visitor->setUser(Yii::$app->user->identity->getId());
        }

        if ($this->detectFirstVisitSource) {

        }

        if ($this->detectAllVisitsSources) {

        }

        if ($this->storeLastActivity) {
            $this->visitor->save();
        }

        if ($this->storeVisitedPages) {

        }
    }
}
