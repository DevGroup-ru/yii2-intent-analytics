<?php
namespace DevGroup\Analytics\models;

use Yii;
use yii\helpers\Json;

/**
 * This is the model class for table "{{%intent_event_type}}".
 *
 * @property integer $id
 * @property string $type
 * @property string $title
 * @property string $class
 * @property string $js_module
 * @property string $default_options_json
 * 
 * @property array $default_options
 *
 * @property Event[] $events
 */
class EventType extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_event_type}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type', 'title', 'js_module'], 'required'],
            [['default_options_json'], 'string'],
            [['type', 'class', 'title', 'js_module'], 'string', 'max' => 255],
            [['type'], 'unique'],
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
            'default_options_json' => Yii::t('app', 'Default Options Json'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getEvents()
    {
        return $this->hasMany(Event::class, ['type_id' => 'id']);
    }

    /**
     * @param array $value
     * @return $this
     */
    public function setDefault_options(array $value)
    {
        $this->default_options_json = Json::encode($value);
        return $this;
    }

    /**
     * @return array
     */
    public function getDefault_options()
    {
        if (true === empty($this->default_options_json)) {
            return [];
        }
        
        return Json::decode($this->default_options_json);
    }
    
    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        if (true === empty($this->default_options_json)) {
            $this->default_options_json = '{}';
        }
        
        return parent::beforeSave($insert);
    }
}
