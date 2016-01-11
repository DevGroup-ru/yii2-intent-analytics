<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "analytics_goal".
 *
 * @property integer $id
 * @property string $name
 * @property integer $is_transactional
 * @property integer $analytics_categories_id
 * @property string $ga_action_name
 * @property integer $ga_value
 * @property string $ga_label
 * @property string $ym_goal
 * @property string $custom_params
 * @property integer $once_per_session
 * @property integer $once_per_visitor
 *
 * @property AnalyticsCategories $analyticsCategories
 * @property VisitorSessionGoals $id0
 * @property SelfReportingBlock[] $selfReportingBlocks
 */
class AnalyticsGoal extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'analytics_goal';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'analytics_categories_id', 'ga_value'], 'required'],
            [['id', 'is_transactional', 'analytics_categories_id', 'ga_value', 'once_per_session', 'once_per_visitor'], 'integer'],
            [['name', 'ga_action_name', 'ga_label', 'ym_goal'], 'string'],
            [['custom_params'], 'string', 'max' => 255],
            [['id'], 'exist', 'skipOnError' => true, 'targetClass' => VisitorSessionGoals::className(), 'targetAttribute' => ['id' => 'analytics_goal_id']],
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
            'is_transactional' => 'Is Transactional',
            'analytics_categories_id' => 'Analytics Categories ID',
            'ga_action_name' => 'Ga Action Name',
            'ga_value' => 'Ga Value',
            'ga_label' => 'Ga Label',
            'ym_goal' => 'Ym Goal',
            'custom_params' => 'Custom Params',
            'once_per_session' => 'Once Per Session',
            'once_per_visitor' => 'Once Per Visitor',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAnalyticsCategories()
    {
        return $this->hasOne(AnalyticsCategories::className(), ['id' => 'analytics_categories_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getId0()
    {
        return $this->hasOne(VisitorSessionGoals::className(), ['analytics_goal_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSelfReportingBlocks()
    {
        return $this->hasMany(SelfReportingBlock::className(), ['analytics_goal_id' => 'id']);
    }
}