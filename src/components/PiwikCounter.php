<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;

class PiwikCounter extends CounterAbstract
{
    /**
     * @inheritdoc
     */
    protected static function initCounter(Counter $model)
    {
        return [];
    }
}