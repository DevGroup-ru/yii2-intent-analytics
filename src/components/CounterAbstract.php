<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use yii\helpers\Json;

abstract class CounterAbstract
{
    /**
     * @param Counter $model
     * @return array
     */
    final public static function init(Counter $model)
    {
        $array = static::initCounter($model);
        return array_replace_recursive(
            [
                'id' => $model->id,
                'jsModule' => $model->js_module,
                'jsObject' => $model->js_object,
                'options' => Json::decode($model->options_json),
            ],
            (true === is_array($array)) ? $array : []
        );
    }

    /**
     * @param Counter $model
     * @return array
     */
    abstract protected static function initCounter(Counter $model);
}
