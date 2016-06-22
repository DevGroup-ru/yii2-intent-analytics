<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Event;
use DevGroup\Analytics\models\EventType;

abstract class AbstractEvent
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
                'options' => $model->getOptions(),
            ],
            (true === is_array($array)) ? $array : []
        );
    }

    /**
     * @param Event $model
     * @return array
     */
    protected static function initEvent(Event $model)
    {

    }
}
