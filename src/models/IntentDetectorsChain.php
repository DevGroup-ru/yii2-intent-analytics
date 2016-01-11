<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "intent_detectors_chain".
 *
 * @property integer $intent_id
 * @property integer $intent_detectors_id
 * @property integer $sort_order
 *
 * @property Intent $intent
 * @property IntentDetectors $intentDetectors
 */
class IntentDetectorsChain extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_detectors_chain}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['intent_id', 'intent_detectors_id'], 'required'],
            [['intent_id', 'intent_detectors_id', 'sort_order'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'intent_id' => 'Intent ID',
            'intent_detectors_id' => 'Intent Detectors ID',
            'sort_order' => 'Sort Order',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIntent()
    {
        return $this->hasOne(Intent::className(), ['id' => 'intent_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIntentDetectors()
    {
        return $this->hasOne(IntentDetectors::className(), ['id' => 'intent_detectors_id']);
    }
}