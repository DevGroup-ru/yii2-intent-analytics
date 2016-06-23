<?php
/**
 * @var \DevGroup\Analytics\models\Counter $model
 * @var \yii\web\View $this
 */

use yii\bootstrap\ActiveForm;
use DevGroup\Analytics\models\CounterType;
use yii\bootstrap\Html;

$form = ActiveForm::begin(['options' => [
    'id' => 'counter-edit'
]]);
?>
<?= $form->field($model, 'title') ?>
<?= $form->field($model, 'js_object') ?>
<?= $form->field($model, 'counter_id') ?>
<?= $form->field($model, 'options_json') ?>
<?= $form->field($model, 'counter_html')->textarea([
    'rows' => 5,
    'placeholder' => Yii::t('app', 'This field will be filled automatically')
]) ?>
<?= $form->field($model, 'active')->checkbox() ?>
<?= $form->field($model, 'type_id')->dropDownList(CounterType::getTypes()) ?>
<?= Html::submitButton(Yii::t('app', 'Save')) ?>
<?php if (true === $model->type->isAuthorized()) : ?>
    <?= Html::a(Yii::t('app', 'Get Counter Html Code'), ['/analytics/counters/get-counter-html', 'id' => $model->id]) ?>
<?php else : ?>
    <?= Html::a(Yii::t('app', 'Authorize'), ['/analytics/counter-types/auth', 'id' => $model->type->id]) ?>
<?php endif; ?>
<?php ActiveForm::end(); ?>