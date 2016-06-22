<?php

namespace DevGroup\Analytics\controllers;


use DevGroup\Analytics\models\Counter;
use yii\web\Controller;
use Yii;
use yii\web\NotFoundHttpException;

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
                throw new NotFoundHttpException();
            }
        } else {
            $counter = new Counter();
            $counter->loadDefaultValues();
        }
        $post = Yii::$app->request->post();
        if (false === empty($post)) {
            if (true === $counter->load($post) && true === $counter->save()) {
                Yii::$app->session->setFlash('success', Yii::t('app', 'Counter successfully saved'));
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
}