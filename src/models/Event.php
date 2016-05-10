<?php
namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "{{%intent_event}}".
 *
 * @property integer $id
 * @property integer $type_id
 * @property string $title
 * @property string $options_json
 * @property integer $active
 *
 * @property EventType $type
 */
class Event extends \yii\db\ActiveRecord
{
    /**
     * @var Event[]
     */
    protected static $_activeEvents = null;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_event}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type_id', 'title',], 'required'],
            [['type_id', 'active',], 'integer'],
            [['options_json',], 'string'],
            [['title',], 'string', 'max' => 255],
            [
                ['type_id'],
                'exist', 'skipOnError' => true,
                'targetClass' => EventType::class, 'targetAttribute' => ['type_id' => 'id']
            ],
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
            'options_json' => Yii::t('app', 'Options Json'),
            'active' => Yii::t('app', 'Active'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getType()
    {
        return $this->hasOne(EventType::class, ['id' => 'type_id']);
    }

    /**
     * @return Event[]
     */
    public static function getActiveEvents()
    {
        if (null === static::$_activeEvents) {
            static::$_activeEvents = static::find()->where(['active' => 1])->all();
        }

        return static::$_activeEvents;
    }
}
