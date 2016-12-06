<?php

namespace DevGroup\Analytics\models;

use Yii;
use yii\helpers\Json;

/**
 * This is the model class for table "visited_page".
 *
 * @property integer $id
 * @property string $route
 * @property string $params
 * @property string $url
 *
 * @property Visitor[] $visitors
 * @property Visitor[] $visitors0
 * @property VisitorVisit[] $visitorVisits
 * @property VisitorVisit[] $visitorVisits0
 * @property VisitorVisitGoals[] $visitorVisitGoals
 * @property VisitorVisitIntents[] $visitorVisitIntents
 */
class VisitedPage extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'visited_page';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['params'], 'string'],
            [['route'], 'string', 'max' => 250],
            [['url'], 'string', 'max' => 500],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'route' => Yii::t('app', 'Route'),
            'params' => Yii::t('app', 'Params'),
            'url' => Yii::t('app', 'Url'),
        ];
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
    public function getVisitorVisits()
    {
        return $this->hasMany(VisitorVisit::className(), ['first_visited_page_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorVisits0()
    {
        return $this->hasMany(VisitorVisit::className(), ['last_visited_page_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorVisitGoals()
    {
        return $this->hasMany(VisitorVisitGoals::className(), ['visited_page_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVisitorVisitIntents()
    {
        return $this->hasMany(VisitorVisitIntents::className(), ['detected_visited_page_id' => 'id']);
    }

    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if ($this->isNewRecord) {
                $this->route = Yii::$app->requestedRoute;
                $this->params = Json::encode(Yii::$app->request->get());
                $this->url = Yii::$app->request->url;
            }

            return true;
        }
        return false;
    }

    /**
     * @param null|string $url
     * @return VisitedPage
     */
    public function findOrCreate($url = null) {
        $url = $url ?: Yii::$app->request->url;
        $page = static::findOne([
            'url' => $url,
        ]);
        if ($page !== null) {
            return $page;
        }
        $this->save();
        return $this;
    }
}
