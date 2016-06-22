<?php
namespace DevGroup\Analytics\widgets;

use DevGroup\Analytics\assets\AssetBundle;
use DevGroup\Analytics\components\AbstractCounter;
use DevGroup\Analytics\components\AbstractEvent;
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
            /** @var AbstractCounter $class */
            $class = $model->class;
            if (false === is_subclass_of($class, AbstractCounter::class)) {
                continue ;
            }
            $counters[] = $class::init($model);
        }
        
        $counters = Json::encode($counters);
        $this->view->registerJs(
            "UnionAnalytics.addCounters({$counters});",
            View::POS_END
        );

        $events = [];
        /** @var Event $model */
        foreach (Event::getActiveEvents() as $model) {
            /** @var AbstractEvent $class */
            $class = $model->class;
            if (false === is_subclass_of($class, AbstractEvent::class)) {
                continue ;
            }
            $events[] = $class::init($model);
        }
        $events = Json::encode($events);
        $this->view->registerJs(
            "UnionAnalytics.addEvents({$events});",
            View::POS_END
        );
    }
}
