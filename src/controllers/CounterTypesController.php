<?php

namespace DevGroup\Analytics\controllers;


use DevGroup\Analytics\components\AbstractCounter;
use DevGroup\Analytics\models\CounterType;
use yii\base\InvalidParamException;
use yii\web\Controller;
use Yii;
use yii\web\NotFoundHttpException;

/**
 * Class CounterTypesController
 *
 * @package DevGroup\Analytics\controllers
 */
class CounterTypesController extends Controller
{
    public function actionIndex()
    {
        $params = Yii::$app->request->get();
        $searchModel = new CounterType();
        $dataProvider = $searchModel->search($params);

        return $this->render(
            'index',
            [
                'dataProvider' => $dataProvider,
                'searchModel' => $searchModel,
            ]
        );
    }

    public function actionEdit($id = null)
    {
        if (null !== $id) {
            if (null === $type = CounterType::findOne($id)) {
                throw new NotFoundHttpException(
                    Yii::t('app', "'{model}' with id '{id}' not found", [
                        'model' => Yii::t('app', 'Counter Type'),
                        'id' => $id
                    ])
                );
            }
        } else {
            $type = new CounterType();
            $type->loadDefaultValues();
        }
        $post = Yii::$app->request->post();
        if (false === empty($post)) {
            if (true === $type->load($post) && true === $type->save()) {
                Yii::$app->session->setFlash('success', Yii::t('app',
                    '{model} successfully saved', ['model' => Yii::t('app', 'Counter Type')]
                ));
                return $this->refresh();
            } else {
                Yii::$app->session->setFlash('error', Yii::t('app',
                    'There was an error while saving {model}', ['model' => Yii::t('app', 'Counter Type')]
                ));
            }
        }
        print_r(Yii::$app->session->getAllFlashes());
        return $this->render(
            'edit',
            [
                'model' => $type,
            ]
        );
    }

    public function actionAuth()
    {
        $params = Yii::$app->request->get();
        $id = isset($params['id']) ? $params['id'] : (isset($params['state']) ? $params['state'] : '');
        /** @var CounterType $type */
        if (null === $type = CounterType::findByParams($params)) {
            throw new NotFoundHttpException(
                Yii::t('app', "'{model}' with id '{id}' not found", [
                    'model' => Yii::t('app', 'Counter Type'),
                    'id' => $id
                ])
            );
        }
        $class = $type->class;
        if (false === class_exists($class) || (false === is_subclass_of($class, AbstractCounter::class))) {
            throw new InvalidParamException(
                Yii::t('app', "Unknown counter type class '{class}'", ['class' => $type->class])

            );
        }
        /** @var AbstractCounter $class */
        $class::authorizeCounter($type, $params);
        //TODO make it work
        //$this->redirect(['/analytics/counter-types/edit', 'id' => $type->id]);
    }
}