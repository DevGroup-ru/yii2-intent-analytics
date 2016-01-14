<?php

namespace DevGroup\Analytics\models;

use Yii;

/**
 * This is the model class for table "visited_page".
 *
 * @property integer $id
 * @property string $route
 * @property string $param
 * @property string $url
 *
 * @property VisitorSession $id0
 * @property Visitor[] $visitors
 * @property Visitor[] $visitors0
 * @property Visitor[] $visitors1
 * @property Visitor[] $visitors2
 * @property VisitorSessionGoals[] $visitorSessionGoals
 */
class VisitedPage extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%visited_page}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'integer'],
            [['route'], 'string', 'max' => 80],
            [['param', 'url'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'route' => 'Route',
            'param' => 'Param',
            'url' => 'Url',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getId0()
    {
        return $this->hasOne(VisitorSession::className(), ['first_visited_page_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitors()
    {
        return $this->hasMany(Visitor::className(), ['first_visit_visited_page_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitors0()
    {
        return $this->hasMany(Visitor::className(), ['last_activity_visited_page_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitors1()
    {
        return $this->hasMany(Visitor::className(), ['first_traffic_sources_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitors2()
    {
        return $this->hasMany(Visitor::className(), ['last_traffic_sources_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorSessionGoals()
    {
        return $this->hasMany(VisitorSessionGoals::className(), ['visited_page_id' => 'id']);
    }
}