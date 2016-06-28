<?php
namespace DevGroup\Analytics\models;

use Yii;
use yii\base\InvalidParamException;
use yii\data\ActiveDataProvider;
use yii\helpers\Json;

/**
 * This is the model class for table "{{%intent_counter}}".
 *
 * @property integer $id
 * @property integer $type_id
 * @property string $title
 * @property string $js_object
 * @property string $options_json
 * @property string $counter_html
 * @property string $counter_id
 * @property integer $active
 *
 * @property CounterType $type
 */
class Counter extends \yii\db\ActiveRecord
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;

    /**
     * @var Counter[]|array
     */
    protected static $_activeCounters = null;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_counter}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['options_json', 'counter_html'], 'string'],
            [['title', 'js_object', 'type_id',], 'required'],
            [['title', 'js_object', 'counter_id'], 'string', 'max' => 255],
            [['title', 'js_object',], 'unique'],
            [['type_id', 'active',], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'type_id' => Yii::t('app', 'Type ID'),
            'title' => Yii::t('app', 'Title'),
            'js_object' => Yii::t('app', 'Js Object'),
            'options_json' => Yii::t('app', 'Options Json'),
            'counter_html' => Yii::t('app', 'Counter HTML'),
            'counter_id' => Yii::t('app', 'Counter ID'),
            'active' => Yii::t('app', 'Active'),
        ];
    }

    public static function getStatuses()
    {
        return [
            self::STATUS_ACTIVE => Yii::t('app', 'Active'),
            self::STATUS_INACTIVE => Yii::t('app', 'Inactive'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getType()
    {
        return $this->hasOne(CounterType::class, ['id' => 'type_id']);
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->type->class;
    }

    /**
     * @return Counter[]|array
     */
    public static function getActiveCounters()
    {
        if (null === static::$_activeCounters) {
            static::$_activeCounters = static::find()->where([
                'and',
                ['active' => self::STATUS_ACTIVE],
                ['not', 'counter_html' => '']
            ])->all();
        }

        return static::$_activeCounters;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        try {
            $result = Json::decode($this->options_json);
        } catch (InvalidParamException $e) {
            $result = [];
        }

        return $result;
    }

    /**
     * @param $params
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = self::find()->indexBy('id');
        $query->joinWith(['type']);
        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => 15,
            ],
        ]);
        if (false === $this->load($params)) {
            return $dataProvider;
        }
        $counterTypeTable = CounterType::tableName();
        $dataProvider->sort->attributes['type'] = [
            'asc' => [$counterTypeTable . '.title' => SORT_ASC],
            'desc' => [$counterTypeTable . '.title' => SORT_DESC],
        ];
        $query->andFilterWhere(['like', 'title', $this->title]);
        $query->andFilterWhere(['like', 'counter_id', $this->counter_id]);
        $query->andFilterWhere(['active' => $this->active]);
        $query->andFilterWhere([$counterTypeTable . '.id' => $this->type_id]);
        return $dataProvider;
    }
}
