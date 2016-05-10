<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Event;
use DevGroup\Analytics\models\EventType;
use yii\helpers\Json;

abstract class EventAbstract
{
    /**
     * @param Event $model
     * @return array
     */
    final public static function init(Event $model)
    {
        $array = static::initEvent($model);
        /** @var EventType $type */
        $type = $model->type;
        return array_replace_recursive(
            [
                'jsModule' => $type->js_module,
                'type' => $type->type,
                'options' => Json::decode($model->options_json),
            ],
            (true === is_array($array)) ? $array : []
        );
    }
    
    /**
     * @param Event $model
     * @return array
     */
    abstract protected static function initEvent(Event $model);
}
