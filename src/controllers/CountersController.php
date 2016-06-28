<?php

namespace DevGroup\Analytics\controllers;

use DevGroup\Analytics\components\AbstractCounter;
use DevGroup\Analytics\models\Counter;
use yii\base\InvalidParamException;
use yii\web\Controller;
use Yii;
use yii\web\NotFoundHttpException;

/**
 * Class CountersController
 *
 * @package DevGroup\Analytics\controllers
 */
class CountersController extends Controller
{
    public function actionIndex()
    {
        $params = Yii::$app->request->get();
        $searchModel = new Counter();
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
            if (null === $counter = Counter::findOne($id)) {
                throw new NotFoundHttpException(
                    Yii::t('app', "'{model}' with id '{id}' not found", [
                        'model' => Yii::t('app', 'Counter'),
                        'id' => $id
                    ])
                );
            }
        } else {
            $counter = new Counter();
            $counter->loadDefaultValues();
        }
        $post = Yii::$app->request->post();
        if (false === empty($post)) {
            if (true === $counter->load($post) && true === $counter->save()) {
                Yii::$app->session->setFlash('success', Yii::t('app', 'Counter successfully saved'));
                return $this->redirect(['/analytics/counters/edit', 'id' => $counter->id]);
            } else {
                Yii::$app->session->setFlash('error', Yii::t('app', 'There was an error while saving Counter'));
            }
        }
        return $this->render(
            'edit',
            [
                'model' => $counter,
            ]
        );
    }

    public function actionGetCounterHtml($id = null)
    {
        /** @var Counter $counter */
        if (null === $counter = Counter::findOne($id)) {
            throw new NotFoundHttpException(
                Yii::t('app', "'{model}' with id '{id}' not found", [
                    'model' => Yii::t('app', 'Counter'),
                    'id' => $id
                ])
            );
        }
        $class = $counter->type->class;
        if (false === class_exists($class) || (false === is_subclass_of($class, AbstractCounter::class))) {
            throw new InvalidParamException(
                Yii::t('app', "Unknown counter type class '{class}'", ['class' => $class])

            );
        }
        /** @var AbstractCounter $class */
        $class::getCounterHtml($counter);
        $this->redirect(['/analytics/counters/edit', 'id' => $counter->id]);
    }
}