<?php
namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "{{%intent_counter_type}}".
 *
 * @property integer $id
 * @property string $type
 * @property string $title
 * @property string $class
 * @property string $js_module
 * @property string $default_js_object
 * @property string $default_options_json
 *
 * @property Counter[] $counters
 */
class CounterType extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_counter_type}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type', 'title', 'class', 'js_module', 'default_js_object'], 'required'],
            [['default_options_json'], 'string'],
            [['type', 'title', 'class', 'js_module', 'default_js_object'], 'string', 'max' => 255],
            [['type'], 'unique'],
            [['title'], 'unique'],
            [['default_js_object'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'type' => 'Type',
            'title' => 'Title',
            'class' => 'Class',
            'js_module' => 'Js Module',
            'default_js_object' => 'Default Js Object',
            'default_options_json' => 'Default Options Json',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCounters()
    {
        return $this->hasMany(Counter::class, ['type_id' => 'id']);
    }
}
