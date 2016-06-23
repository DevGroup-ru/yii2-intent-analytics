<?php
namespace DevGroup\Analytics\models;

use DevGroup\Analytics\components\AbstractCounter;
use Yii;
use yii\base\InvalidParamException;
use yii\data\ActiveDataProvider;

/**
 * This is the model class for table "{{%intent_counter_type}}".
 *
 * @property integer $id
 * @property string $type
 * @property string $title
 * @property string $class
 * @property string $js_module
 * @property string $default_js_object
 * @property string $default_options_json
 * @property string $client_id
 * @property string $client_pass
 * @property string $credentials_json
 * @property string $access_token
 * @property string $token_expires
 *
 * @property Counter[] $counters
 */
class CounterType extends \yii\db\ActiveRecord
{
    protected static $typesMap = [];

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%intent_counter_type}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type', 'title', 'class', 'js_module', 'default_js_object'], 'required'],
            [['default_options_json', 'credentials_json'], 'string'],
            [
                [
                    'type',
                    'title',
                    'class',
                    'js_module',
                    'default_js_object',
                    'client_id',
                    'client_pass',
                    'access_token',
                    'token_expires',
                ],
                'string',
                'max' => 255
            ],
            [['type'], 'unique'],
            [['title'], 'unique'],
            [['default_js_object'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'type' => 'Type',
            'title' => 'Title',
            'class' => 'Class',
            'js_module' => 'Js Module',
            'default_js_object' => 'Default Js Object',
            'default_options_json' => 'Default Options Json',
            'client_id' => 'Client Id',
            'client_pass' => 'Client Password',
            'credentials_json' => 'Credentials JSON (for Google)',
            'access_token' => 'Access Token',
            'token_expires' => 'Token Expires'
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCounters()
    {
        return $this->hasMany(Counter::class, ['type_id' => 'id']);
    }

    /**
     * OAuth allows us to pass additional parameter to achieve per-request customization.
     * After giving all necessary permissions we can get it as $_GET['state'] param and use in our callback method
     * to find what kind of counter we are working with
     *
     * @param $params
     * @return self | null
     */
    public static function findByParams($params)
    {
        $id = isset($params['id']) ? $params['id'] : null;
        $state = isset($params['state']) ? $params['state'] : null;
        $type = null;
        if (null === $id && null === $state) {
            return null;
        }
        if (null !== $id) {
            if (null === $type = self::findOne($id)) {
                return null;
            }
        } else if (null !== $state) {
            if (null === $type = self::findOne($state)) {
                return null;
            }
        }
        return $type;
    }

    /**
     * For now it is very naive
     * Just because all kind of APIs has the different token lifetimes and not every API library provides method
     * to get token expiration date
     *
     * TODO improve checks
     *
     * @return bool
     */
    public function isAuthorized()
    {
        /** @var AbstractCounter $class */
        $class = $this->class;
        if (false === class_exists($class) || (false === is_subclass_of($class, AbstractCounter::class))) {
            throw new InvalidParamException(
                Yii::t('app', "Unknown counter type class '{class}'", ['class' => $class])

            );
        }
        return $class::isAuthorized($this);
    }

    /**
     * @return array
     */
    public static function getTypes()
    {
        if (count(self::$typesMap) == 0) {
            self::$typesMap = self::find()->select('type')->asArray(true)->indexBy('id')->column();
        }
        return self::$typesMap;
    }

    /**
     * @param $params
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = self::find()->indexBy('id');
        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => 15,
            ],
        ]);
        if (false === $this->load($params)) {
            return $dataProvider;
        }
        $query->andFilterWhere(['like', 'type', $this->title]);
        $query->andFilterWhere(['like', 'title', $this->title]);
        $query->andFilterWhere(['like', 'class', $this->title]);
        $query->andFilterWhere(['like', 'js_module', $this->title]);
        $query->andFilterWhere(['like', 'default_js_object', $this->title]);
        return $dataProvider;
    }
}
