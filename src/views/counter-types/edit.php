<?php
/**
 * @var \DevGroup\Analytics\models\CounterType $model
 * @var \yii\web\View $this
 */

use yii\bootstrap\ActiveForm;
use yii\bootstrap\Html;

$form = ActiveForm::begin(['options' => [
    'id' => 'counter-type-edit'
]]);
?>
<?= $form->field($model, 'title') ?>
<?= $form->field($model, 'type') ?>
<?= $form->field($model, 'class') ?>
<?= $form->field($model, 'js_module') ?>
<?= $form->field($model, 'default_js_object') ?>
<?= $form->field($model, 'default_options_json') ?>
<?= $form->field($model, 'client_id') ?>
<?= $form->field($model, 'client_pass') ?>
<?= $form->field($model, 'access_token') ?>
<?= $form->field($model, 'credentials_json')->textarea(['rows' => 5]) ?>
<?= Yii::$app->formatter->asDate($model->token_expires) ?>
<?= Html::submitButton(Yii::t('app', 'Save')) ?>
<?= Html::a(Yii::t('app', 'Authorize'), ['/analytics/counter-types/auth', 'id' => $model->id]) ?>
<?php ActiveForm::end(); ?>