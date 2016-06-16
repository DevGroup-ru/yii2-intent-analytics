<?php
namespace DevGroup\Analytics\models;

use Yii;
use yii\base\InvalidParamException;
use yii\helpers\Json;

/**
 * This is the model class for table "{{%intent_counter}}".
 *
 * @property integer $id
 * @property integer $type_id
 * @property string $title
 * @property string $js_object
 * @property string $options_json
 * @property integer $active
 *
 * @property CounterType $type
 */
class Counter extends \yii\db\ActiveRecord
{
    /**
     * @var Counter[]|array
     */
    protected static $_activeCounters = null;
    
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
            [['options_json',], 'string'],
            [['title', 'js_object', 'type_id',], 'required'],
            [['title', 'js_object',], 'string', 'max' => 255],
            [['title', 'js_object',], 'unique'],
            [['type_id', 'active',], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'type_id' => Yii::t('app', 'Type ID'),
            'title' => Yii::t('app', 'Title'),
            'js_object' => Yii::t('app', 'Js Object'),
            'options_json' => Yii::t('app', 'Options Json'),
            'active' => Yii::t('app', 'Active'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getType()
    {
        return $this->hasOne(CounterType::class, ['id' => 'type_id']);
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->type->class;
    }

    /**
     * @return Counter[]|array
     */
    public static function getActiveCounters()
    {
        if (null === static::$_activeCounters) {
            static::$_activeCounters = static::find()->where(['active' => 1])->all();
        }

        return static::$_activeCounters;
    }
    
    /**
     * @return array
     */
    public function getOptions()
    {
        try {
            $result = Json::decode($this->options_json);
        } catch (InvalidParamException $e) {
            $result = [];
        }
        
        return $result;
    }
}
