<?php

namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "analytics_categories".
 *
 * @property integer $id
 * @property integer $name
 *
 * @property AnalyticsGoal $id0
 */
class AnalyticsCategories extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%analytics_categories}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id', 'name'], 'integer'],
            [['id'], 'exist', 'skipOnError' => true, 'targetClass' => AnalyticsGoal::className(), 'targetAttribute' => ['id' => 'analytics_categories_id']],
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
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getId0()
    {
        return $this->hasOne(AnalyticsGoal::className(), ['analytics_categories_id' => 'id']);
    }
}