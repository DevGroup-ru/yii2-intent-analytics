<?php
namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "{{%intent_counter}}".
 *
 * @property integer $id
 * @property string $type
 * @property string $title
 * @property string $class
 * @property string $js_module
 * @property string $js_object
 * @property string $options_json
 */
class Counter extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_counter}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type', 'options_json',], 'string'],
            [['title', 'class', 'js_module', 'js_object',], 'required'],
            [['title', 'js_object', 'class', 'js_module',], 'string', 'max' => 255],
            [['title', 'js_object',], 'unique'],
            [['active',], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'type' => Yii::t('app', 'Type'),
            'title' => Yii::t('app', 'Title'),
            'class' => Yii::t('app', 'Class'),
            'js_module' => Yii::t('app', 'Js Module'),
            'js_object' => Yii::t('app', 'Js Object'),
            'options_json' => Yii::t('app', 'Options Json'),
            'active' => Yii::t('app', 'Active'),
        ];
    }
}
