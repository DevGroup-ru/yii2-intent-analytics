<?php

namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Event;

/**
 * Class SubmitEvent
 *
 * @package DevGroup\Analytics\components
 */
class SubmitEvent extends AbstractEvent
{
    /**
     * @inheritdoc
     */
    protected static function initEvent(Event $model)
    {
        return [];
    }
}