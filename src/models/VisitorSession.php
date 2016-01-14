<?php

namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "visitor_session".
 *
 * @property integer $id
 * @property integer $visitor_id
 * @property string $session_id
 * @property string $started_at
 * @property string $last_action_at
 * @property string $ip
 * @property integer $first_visited_page_id
 * @property string $first_activity_at
 * @property integer $last_visited_page_id
 * @property string $last_activity_at
 * @property integer $intents_count
 * @property integer $actions_count
 * @property integer $goals_count
 * @property double $actions_value
 * @property double $goals_value
 * @property integer $traffic_sources_id
 *
 * @property VisitedPage $visitedPage
 * @property Visitor[] $visitors
 * @property VisitorSessionIntents[] $visitorSessionIntents
 * @property Intent[] $intents
 */
class VisitorSession extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%visitor_session}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['visitor_id', 'started_at', 'last_action_at', 'first_visited_page_id', 'first_activity_at', 'last_visited_page_id', 'last_activity_at', 'traffic_sources_id'], 'required'],
            [['visitor_id', 'first_visited_page_id', 'last_visited_page_id', 'intents_count', 'actions_count', 'goals_count', 'traffic_sources_id'], 'integer'],
            [['started_at', 'last_action_at', 'first_activity_at', 'last_activity_at'], 'safe'],
            [['actions_value', 'goals_value'], 'number'],
            [['session_id'], 'string', 'max' => 256],
            [['ip'], 'string', 'max' => 45],
            [['first_visited_page_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['first_visited_page_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'visitor_id' => 'Visitor ID',
            'session_id' => 'Session ID',
            'started_at' => 'Started At',
            'last_action_at' => 'Last Action At',
            'ip' => 'Ip',
            'first_visited_page_id' => 'First Visited Page ID',
            'first_activity_at' => 'First Activity At',
            'last_visited_page_id' => 'Last Visited Page ID',
            'last_activity_at' => 'Last Activity At',
            'intents_count' => 'Intents Count',
            'actions_count' => 'Actions Count',
            'goals_count' => 'Goals Count',
            'actions_value' => 'Actions Value',
            'goals_value' => 'Goals Value',
            'traffic_sources_id' => 'Traffic Sources ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitedPage()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'first_visited_page_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitors()
    {
        return $this->hasMany(Visitor::className(), ['last_traffic_sources_id' => 'visitor_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorSessionIntents()
    {
        return $this->hasMany(VisitorSessionIntents::className(), ['visitor_session_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIntents()
    {
        return $this->hasMany(Intent::className(), ['id' => 'intent_id'])->viaTable('visitor_session_intents', ['visitor_session_id' => 'id']);
    }
}