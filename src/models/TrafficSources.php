<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "traffic_sources".
 *
 * @property integer $id
 * @property string $name
 * @property string $class_name
 * @property string $params
 *
 * @property IntentDetectors $id0
 */
class TrafficSources extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'traffic_sources';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id'], 'integer'],
            [['name', 'class_name', 'params'], 'string'],
            [['id'], 'exist', 'skipOnError' => true, 'targetClass' => IntentDetectors::className(), 'targetAttribute' => ['id' => 'needs_traffic_sources_id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'class_name' => 'Class Name',
            'params' => 'Params',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getId0()
    {
        return $this->hasOne(IntentDetectors::className(), ['needs_traffic_sources_id' => 'id']);
    }
}