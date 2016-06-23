<?php

namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;
use yii\web\Response;

/**
 * Interface CounterInterface
 *
 * @package DevGroup\Analytics\components
 */
interface CounterInterface
{
    /**
     * Gets API access_token
     *
     * @param CounterType $counter
     * @param array $config
     * @return bool | Response
     */
    static function authorizeCounter(CounterType $counter, $config);

    /**
     * @param Counter $counter
     * @return bool
     */
    static function getCounterHtml(Counter $counter);

    /**
     * @param CounterType $counter
     * @param null $client
     * @return bool
     */
    static function isAuthorized(CounterType $counter, $client = null);
}