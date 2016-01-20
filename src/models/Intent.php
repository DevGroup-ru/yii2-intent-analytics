<?php

namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "intent".
 *
 * @property integer $id
 * @property string $name
 * @property integer $timeout
 *
 * @property IntentDetectorsChain $id0
 * @property VisitorSessionIntents[] $visitorSessionIntents
 * @property VisitorSession[] $visitorSessions
 */
class Intent extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'name'], 'required'],
            [['id', 'timeout'], 'integer'],
            [['name'], 'string'],
            [['id'], 'exist', 'skipOnError' => true, 'targetClass' => IntentDetectorsChain::className(), 'targetAttribute' => ['id' => 'intent_id']],
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
            'timeout' => 'Timeout',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getId0()
    {
        return $this->hasOne(IntentDetectorsChain::className(), ['intent_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorSessionIntents()
    {
        return $this->hasMany(VisitorSessionIntents::className(), ['intent_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorSessions()
    {
        return $this->hasMany(VisitorSession::className(), ['id' => 'visitor_session_id'])->viaTable('visitor_session_intents', ['intent_id' => 'id']);
    }
}