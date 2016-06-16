<?php
namespace DevGroup\Analytics\widgets;

use DevGroup\Analytics\assets\AssetBundle;
use DevGroup\Analytics\components\CounterAbstract;
use DevGroup\Analytics\components\EventAbstract;
use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\Event;
use yii\base\Widget;
use yii\helpers\Json;
use yii\web\View;

class CountersWidget extends Widget
{
    /**
     * @inheritdoc
     */
    public function run()
    {
        parent::run();

        AssetBundle::register($this->view);

        $counters = [];
        /** @var Counter $model */
        foreach (Counter::getActiveCounters() as $model) {
            /** @var CounterAbstract $class */
            $class = $model->class;
            if (false === is_subclass_of($class, CounterAbstract::class)) {
                continue ;
            }
            $counters[] = $class::init($model);
        }
        
        $counters = Json::encode($counters);
        $this->view->registerJs(
            "UnionAnalytics.getInstance().addCounters(${counters});",
            View::POS_END
        );

        $events = [];
        /** @var Event $model */
        foreach (Event::getActiveEvents() as $model) {
            /** @var EventAbstract $class */
            $class = $model->class;
            if (false === is_subclass_of($class, EventAbstract::class)) {
                continue ;
            }
            $events[] = $class::init($model);
        }
        $events = Json::encode($events);
        $this->view->registerJs(
            "UnionAnalytics.getInstance().addEvents(${events});",
            View::POS_END
        );
    }
}
