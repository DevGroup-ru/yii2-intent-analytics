<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "visitor_session_goals".
 *
 * @property integer $visitor_session_id
 * @property integer $analytics_goal_id
 * @property string $goal_at
 * @property integer $visited_page_id
 * @property double $goal_value
 *
 * @property AnalyticsGoal $analyticsGoal
 * @property VisitedPage $visitedPage
 */
class VisitorSessionGoals extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'visitor_session_goals';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['visitor_session_id', 'analytics_goal_id', 'visited_page_id'], 'required'],
            [['visitor_session_id', 'analytics_goal_id', 'visited_page_id'], 'integer'],
            [['goal_at'], 'safe'],
            [['goal_value'], 'number'],
            [['visited_page_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['visited_page_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'visitor_session_id' => 'Visitor Session ID',
            'analytics_goal_id' => 'Analytics Goal ID',
            'goal_at' => 'Goal At',
            'visited_page_id' => 'Visited Page ID',
            'goal_value' => 'Goal Value',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAnalyticsGoal()
    {
        return $this->hasOne(AnalyticsGoal::className(), ['id' => 'analytics_goal_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitedPage()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'visited_page_id']);
    }
}