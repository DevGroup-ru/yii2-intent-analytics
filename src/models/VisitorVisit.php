<?php

namespace DevGroup\Analytics\models;

use Yii;
use yii\db\Expression;

/**
 * This is the model class for table "{{%visitor_visit}}".
 *
 * @property integer $id
 * @property integer $visitor_id
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
 * @property TrafficSources $trafficSources
 * @property Visitor $visitor
 * @property VisitedPage $firstVisitedPage
 * @property VisitedPage $lastVisitedPage
 * @property VisitorVisitGoals[] $visitorVisitGoals
 * @property AnalyticsGoal[] $analyticsGoals
 * @property VisitorVisitIntents[] $visitorVisitIntents
 */
class VisitorVisit extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%visitor_visit}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['visitor_id', 'first_visited_page_id', 'last_visited_page_id', 'intents_count', 'actions_count', 'goals_count', 'traffic_sources_id'], 'integer'],
            [['started_at', 'first_visited_page_id', 'first_activity_at', 'last_visited_page_id', 'last_activity_at'], 'required'],
            [['started_at', 'last_action_at', 'first_activity_at', 'last_activity_at'], 'safe'],
            [['actions_value', 'goals_value'], 'number'],
            [['ip'], 'string', 'max' => 45],
            [['traffic_sources_id'], 'exist', 'skipOnError' => true, 'targetClass' => TrafficSources::className(), 'targetAttribute' => ['traffic_sources_id' => 'id']],
            [['visitor_id'], 'exist', 'skipOnError' => true, 'targetClass' => Visitor::className(), 'targetAttribute' => ['visitor_id' => 'id']],
            [['first_visited_page_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['first_visited_page_id' => 'id']],
            [['last_visited_page_id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitedPage::className(), 'targetAttribute' => ['last_visited_page_id' => 'id']],
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
    public function getTrafficSources()
    {
        return $this->hasOne(TrafficSources::className(), ['id' => 'traffic_sources_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitor()
    {
        return $this->hasOne(Visitor::className(), ['id' => 'visitor_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getFirstVisitedPage()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'first_visited_page_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLastVisitedPage()
    {
        return $this->hasOne(VisitedPage::className(), ['id' => 'last_visited_page_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorVisitGoals()
    {
        return $this->hasMany(VisitorVisitGoals::className(), ['visitor_visit_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAnalyticsGoals()
    {
        return $this->hasMany(AnalyticsGoal::className(), ['id' => 'analytics_goal_id'])->viaTable('{{%visitor_visit_goals}}', ['visitor_visit_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorVisitIntents()
    {
        return $this->hasMany(VisitorVisitIntents::className(), ['visitor_visit_id' => 'id']);
    }

    /**
     * @param int $visitor_id
     * @param int $page_id
     * @param int $onlineTime
     */
    public function createOrUpdate($visitor_id, $page_id, $onlineTime)
    {
        $visit_id = static::find()
            ->select('id')
            ->where([
                'visitor_id' => $visitor_id,
            ])
            ->andWhere(['>=', 'last_action_at', new Expression('NOW()')])
            ->scalar();

        if ($visit_id) {
            Yii::$app->db->createCommand()
                ->update(static::tableName(), [
                    'last_action_at' => new Expression('DATE_ADD(NOW(), INTERVAL :onlineTime SECOND)', [
                        ':onlineTime' => $onlineTime,
                    ]),
                    'last_visited_page_id' => $page_id,
                    'last_activity_at' => new Expression('NOW()'),
                    'actions_count' => new Expression('actions_count + 1'),
                ], [
                    'id' => $visit_id,
                ])
                ->execute();
        } else {
            Yii::$app->db->createCommand()
                ->insert(static::tableName(), [
                    'visitor_id' => $visitor_id,
                    'started_at' => new Expression('NOW()'),
                    'last_action_at' => new Expression('DATE_ADD(NOW(), INTERVAL :onlineTime SECOND)', [
                        ':onlineTime' => $onlineTime,
                    ]),
                    'ip' => $this->getUserIp(),
                    'first_visited_page_id' => $page_id,
                    'first_activity_at' => new Expression('NOW()'),
                    'last_visited_page_id' => $page_id,
                    'last_activity_at' => new Expression('NOW()'),
                    'actions_count' => 1,
                ])
                ->execute();
        }
    }

    /**
     * @return string IP where user is located
     */
    private function getUserIp()
    {
        $validator = new \DevGroup\Multilingual\validators\IpValidator;
        $validator->ipv4 = true;
        if (isset($_SERVER['HTTP_CLIENT_IP'])) {
            if ($validator->validate($_SERVER['HTTP_CLIENT_IP'])) {
                return $_SERVER['HTTP_CLIENT_IP'];
            }
        }
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            if ($validator->validate($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                return $_SERVER['HTTP_X_FORWARDED_FOR'];
            }
        }
        return Yii::$app->request->userIP;
    }
}
