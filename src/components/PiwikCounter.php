<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;

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
    public static function authorizeCounter(CounterType $counter, $config)
    {
        return false;
    }

    /**
     * @param Counter $counter
     * @return bool
     */
    static function getCounterHtml(Counter $counter)
    {
        // TODO: Implement getCounterHtml() method.
    }

    /**
     * @inheritdoc
     */
    static function isAuthorized(CounterType $counter, $client = null)
    {
        // TODO: Implement isAuthorized() method.
    }


}
