<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "intent_detectors".
 *
 * @property integer $id
 * @property string $name
 * @property string $class_name
 * @property string $params
 * @property integer $needs_traffic_sources_id
 *
 * @property IntentDetectorsChain $id0
 * @property TrafficSources $trafficSources
 */
class IntentDetectors extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'intent_detectors';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'name', 'class_name'], 'required'],
            [['id', 'needs_traffic_sources_id'], 'integer'],
            [['name', 'class_name', 'params'], 'string'],
            [['id'], 'exist', 'skipOnError' => true, 'targetClass' => IntentDetectorsChain::className(), 'targetAttribute' => ['id' => 'intent_detectors_id']],
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
            'needs_traffic_sources_id' => 'Needs Traffic Sources ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getId0()
    {
        return $this->hasOne(IntentDetectorsChain::className(), ['intent_detectors_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTrafficSources()
    {
        return $this->hasOne(TrafficSources::className(), ['id' => 'needs_traffic_sources_id']);
    }
}