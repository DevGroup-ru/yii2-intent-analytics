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
    public function init()
    {
        parent::init();

        AssetBundle::register($this->view);
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        parent::run();

        $counters = [];
        /** @var Counter $model */
        foreach (Counter::find()->all() as $model) {
            /** @var CounterAbstract $class */
            $class = $model->class;
            if (false === is_subclass_of($class, CounterAbstract::class)) {
                continue ;
            }
            $counters[] = $class::init($model);
        }
        
        $counters = Json::encode($counters);
        $this->view->registerJs(
            "_iaq.addCounters(${counters});",
            View::POS_END
        );

        $events = [];
        /** @var Event $model */
        foreach (Event::getActiveEvents() as $model) {
            $type = $model->type;
            /** @var EventAbstract $class */
            $class = $type->class;
            if (false === is_subclass_of($class, EventAbstract::class)) {
                continue ;
            }
            $events[] = $class::init($model);
        }
        $events = Json::encode($events);
        $this->view->registerJs(
            "_iaq.addEvents(${events});",
            View::POS_END
        );
    }
}
