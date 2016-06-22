<?php
/**
 * @var \yii\web\View $this
 * @var \yii\data\ActiveDataProvider $dataProvider
 * @var \DevGroup\Analytics\models\CounterType $searchModel
 */

echo \yii\grid\GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
        'id',
        'title',
        'type',
        'class',
        'js_module',
        'default_js_object',
        ['class' => 'yii\grid\ActionColumn'],
    ]
]);