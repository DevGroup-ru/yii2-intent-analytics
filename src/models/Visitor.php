<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "visitor".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $first_visit_at
 * @property string $first_visit_referer
 * @property integer $first_visit_visited_page_id
 * @property integer $first_traffic_sources_id
 * @property string $last_activity_at
 * @property integer $last_activity_visited_page_id
 * @property integer $last_traffic_sources_id
 * @property integer $geo_country_id
 * @property integer $geo_region_id
 * @property integer $geo_city_id
 * @property integer $intents_count
 * @property integer $sessions_count
 * @property integer $actions_count
 * @property integer $goals_count
 * @property double $overall_actions_value
 * @property double $overall_goals_value
 *
 * @property VisitedPage $firstVisitVisitedPage
 * @property VisitedPage $lastActivityVisitedPage
 * @property VisitedPage $firstTrafficSources
 * @property VisitedPage $lastTrafficSources
 * @property VisitorSession $lastTrafficSources0
 */
class Visitor extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%visitor}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'last_traffic_sources_id'], 'required'],
            [['id', 'user_id', 'first_visit_visited_page_id', 'first_traffic_sources_id', 'last_activity_visited_page_id', 'last_traffic_sources_id', 'geo_country_id', 'geo_region_id', 'geo_city_id', 'intents_count', 'sessions_count', 'actions_count', 'goals_count'], 'integer'],
            [['first_visit_at', 'last_activity_at'], 'safe'],
            [['overall_actions_value', 'overall_goals_value'], 'number'],
            [['first_visit_referer'], 'string', 'max' => 255],
            [['first_visit_visited_page_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['first_visit_visited_page_id' => 'id']],
            [['last_activity_visited_page_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['last_activity_visited_page_id' => 'id']],
            [['first_traffic_sources_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['first_traffic_sources_id' => 'id']],
            [['last_traffic_sources_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['last_traffic_sources_id' => 'id']],
            [['last_traffic_sources_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitorSession::className(), 'targetAttribute' => ['last_traffic_sources_id' => 'visitor_id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'first_visit_at' => 'First Visit At',
            'first_visit_referer' => 'First Visit Referer',
            'first_visit_visited_page_id' => 'First Visit Visited Page ID',
            'first_traffic_sources_id' => 'First Traffic Sources ID',
            'last_activity_at' => 'Last Activity At',
            'last_activity_visited_page_id' => 'Last Activity Visited Page ID',
            'last_traffic_sources_id' => 'Last Traffic Sources ID',
            'geo_country_id' => 'Geo Country ID',
            'geo_region_id' => 'Geo Region ID',
            'geo_city_id' => 'Geo City ID',
            'intents_count' => 'Intents Count',
            'sessions_count' => 'Sessions Count',
            'actions_count' => 'Actions Count',
            'goals_count' => 'Goals Count',
            'overall_actions_value' => 'Overall Actions Value',
            'overall_goals_value' => 'Overall Goals Value',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getFirstVisitVisitedPage()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'first_visit_visited_page_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLastActivityVisitedPage()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'last_activity_visited_page_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getFirstTrafficSources()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'first_traffic_sources_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLastTrafficSources()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'last_traffic_sources_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLastTrafficSources0()
    {
        return $this->hasOne(VisitorSession::className(), ['visitor_id' => 'last_traffic_sources_id']);
    }
}