<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;

class PiwikCounter extends AbstractCounter
{
    /**
     * @inheritdoc
     */
    protected static function initCounter(Counter $model)
    {
        return [];
    }

    /**
     * TODO implement
     * @inheritdoc
     */
    public static function authorizeCounter($config)
    {
        return false;
    }
}
