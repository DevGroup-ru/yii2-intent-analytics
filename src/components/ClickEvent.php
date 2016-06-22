<?php

namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Event;

/**
 * Class ClickEvent
 *
 * @package DevGroup\Analytics\components
 */
class ClickEvent extends AbstractEvent
{
    /**
     * @inheritdoc
     */
    protected static function initEvent(Event $model)
    {
        return [];
    }
}
