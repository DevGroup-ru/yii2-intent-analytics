<?php

namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "self_reporting_block".
 *
 * @property integer $id
 * @property string $name
 * @property integer $analytics_goal_id
 * @property integer $track_inview
 * @property integer $inview_delay
 * @property integer $inview_tracking_type
 * @property integer $track_hover
 * @property integer $track_mouseclick
 * @property integer $track_text_select
 *
 * @property AnalyticsGoal $analyticsGoal
 */
class SelfReportingBlock extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%self_reporting_block}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'analytics_goal_id'], 'required'],
            [['id', 'analytics_goal_id', 'track_inview', 'inview_delay', 'inview_tracking_type', 'track_hover', 'track_mouseclick', 'track_text_select'], 'integer'],
            [['name'], 'string'],
            [['analytics_goal_id'], 'exist', 'skipOnError' => true, 'targetClass' => AnalyticsGoal::className(), 'targetAttribute' => ['analytics_goal_id' => 'id']],
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
            'analytics_goal_id' => 'Analytics Goal ID',
            'track_inview' => 'Track Inview',
            'inview_delay' => 'Inview Delay',
            'inview_tracking_type' => 'Inview Tracking Type',
            'track_hover' => 'Track Hover',
            'track_mouseclick' => 'Track Mouseclick',
            'track_text_select' => 'Track Text Select',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAnalyticsGoal()
    {
        return $this->hasOne(AnalyticsGoal::className(), ['id' => 'analytics_goal_id']);
    }
}