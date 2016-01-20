<?php

namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "visitor_session_intents".
 *
 * @property integer $visitor_session_id
 * @property integer $intent_id
 * @property string $detected_at
 * @property integer $visited_page_id
 * @property double $detected_visited_page_id
 *
 * @property VisitorSession $visitorSession
 * @property Intent $intent
 */
class VisitorSessionIntents extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%visitor_session_intents}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['visitor_session_id', 'intent_id', 'visited_page_id'], 'required'],
            [['visitor_session_id', 'intent_id', 'visited_page_id'], 'integer'],
            [['detected_at'], 'safe'],
            [['detected_visited_page_id'], 'number'],
            [['visitor_session_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitorSession::className(), 'targetAttribute' => ['visitor_session_id' => 'id']],
            [['intent_id'], 'exist', 'skipOnError' => true, 'targetClass' => Intent::className(), 'targetAttribute' => ['intent_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'visitor_session_id' => 'Visitor Session ID',
            'intent_id' => 'Intent ID',
            'detected_at' => 'Detected At',
            'visited_page_id' => 'Visited Page ID',
            'detected_visited_page_id' => 'Detected Visited Page ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorSession()
    {
        return $this->hasOne(VisitorSession::className(), ['id' => 'visitor_session_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIntent()
    {
        return $this->hasOne(Intent::className(), ['id' => 'intent_id']);
    }
}