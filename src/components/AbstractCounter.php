<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;

/**
 * Class AbstractCounter
 *
 * @package DevGroup\Analytics\components
 */
abstract class AbstractCounter implements CounterInterface
{
    /**
     * @param Counter $model
     * @return array
     */
    final public static function init(Counter $model)
    {
        $array = static::initCounter($model);
        /** @var CounterType $type */
        $type = $model->type;
        return array_replace_recursive(
            [
                'id' => $model->id,
                'jsModule' => $type->js_module,
                'jsObject' => $model->js_object,
                'options' => $model->getOptions(),
            ],
            (true === is_array($array)) ? $array : []
        );
    }

    /**
     * @param Counter $model
     * @return array
     */
    protected static function initCounter(Counter $model)
    {

    }
}
