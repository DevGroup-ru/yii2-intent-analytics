<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Event;

class ClickEvent extends EventAbstract
{
    /**
     * @inheritdoc
     */
    protected static function initEvent(Event $model)
    {
        return [];
    }
}
