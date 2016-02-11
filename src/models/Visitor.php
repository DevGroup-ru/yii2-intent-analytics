<?php

namespace DevGroup\Analytics\models;

use DevGroup\Analytics\IntentAnalyticsModule;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

/**
 * This is the model class for table "{{%visitor}}".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $first_visit_at
 * @property string $first_visit_referrer
 * @property integer $first_visit_visited_page_id
 * @property integer $first_traffic_sources_id
 * @property string $last_activity_at
 * @property integer $last_activity_visited_page_id
 * @property integer $last_traffic_sources_id
 * @property integer $geo_country_id
 * @property integer $geo_region_id
 * @property integer $geo_city_id
 * @property integer $intents_count
 * @property integer $visits_count
 * @property integer $actions_count
 * @property integer $goals_count
 * @property double $overall_actions_value
 * @property double $overall_goals_value
 *
 * @property TrafficSources $lastTrafficSources
 * @property TrafficSources $firstTrafficSources
 * @property VisitedPage $firstVisitVisitedPage
 * @property VisitedPage $lastActivityVisitedPage
 * @property VisitorVisit[] $visitorVisits
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
    public function behaviors()
    {
        return [
            'timestamp' => [
                'class' => TimestampBehavior::className(),
                'createdAtAttribute' => 'first_visit_at',
                'updatedAtAttribute' => 'last_activity_at',
                'value' => new Expression('NOW()'),
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'first_visit_visited_page_id', 'first_traffic_sources_id', 'last_activity_visited_page_id', 'last_traffic_sources_id', 'geo_country_id', 'geo_region_id', 'geo_city_id', 'intents_count', 'visits_count', 'actions_count', 'goals_count'], 'integer'],
            [['first_visit_at', 'last_activity_at'], 'safe'],
            [['overall_actions_value', 'overall_goals_value'], 'number'],
            [['first_visit_referrer'], 'string', 'max' => 500],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        $category = IntentAnalyticsModule::module()->i18category . '.model';
        return [
            'id' => Yii::t($category, 'ID'),
            'user_id' => Yii::t($category, 'User ID'),
            'first_visit_at' => Yii::t($category, 'First Visit At'),
            'first_visit_referrer' => Yii::t($category, 'First Visit Referrer'),
            'first_visit_visited_page_id' => Yii::t($category, 'First Visit Visited Page ID'),
            'first_traffic_sources_id' => Yii::t($category, 'First Traffic Sources ID'),
            'last_activity_at' => Yii::t($category, 'Last Activity At'),
            'last_activity_visited_page_id' => Yii::t($category, 'Last Activity Visited Page ID'),
            'last_traffic_sources_id' => Yii::t($category, 'Last Traffic Sources ID'),
            'geo_country_id' => Yii::t($category, 'Geo Country ID'),
            'geo_region_id' => Yii::t($category, 'Geo Region ID'),
            'geo_city_id' => Yii::t($category, 'Geo City ID'),
            'intents_count' => Yii::t($category, 'Intents Count'),
            'visits_count' => Yii::t($category, 'Visits Count'),
            'actions_count' => Yii::t($category, 'Actions Count'),
            'goals_count' => Yii::t($category, 'Goals Count'),
            'overall_actions_value' => Yii::t($category, 'Overall Actions Value'),
            'overall_goals_value' => Yii::t($category, 'Overall Goals Value'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLastTrafficSources()
    {
        return $this->hasOne(TrafficSources::className(), ['id' => 'last_traffic_sources_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getFirstTrafficSources()
    {
        return $this->hasOne(TrafficSources::className(), ['id' => 'first_traffic_sources_id']);
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
    public function getVisitorVisits()
    {
        return $this->hasMany(VisitorVisit::className(), ['visitor_id' => 'id']);
    }

    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if ($this->isNewRecord) {
                $this->user_id = Yii::$app->user->isGuest ? 0 : \Yii::$app->user->identity->getId();
                $this->first_visit_referrer = Yii::$app->request->getReferrer();
            }

            return true;
        }
        return false;
    }

    /**
     * Detect is visitor connected with User
     *
     * @return bool
     */
    public function hasUserId()
    {
        if (Yii::$app->user->isGuest) {
            return $this->user_id !== 0;
        }
        return $this->user_id == Yii::$app->user->identity->getId();
    }

    /**
     * Update visitor User info
     *
     * @param int $user_id
     * @return bool
     */
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
        return $this->save(true, ['user_id']);
    }
}
