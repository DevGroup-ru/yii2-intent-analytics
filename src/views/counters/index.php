<?php
/**
 * @var \yii\web\View $this
 * @var \yii\data\ActiveDataProvider $dataProvider
 * @var \DevGroup\Analytics\models\Counter $searchModel
 */
use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;

echo \yii\grid\GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
        'id',
        'title',
        [
            'attribute' => 'active',
            'value' => function ($data) {
                return Yii::$app->formatter->asBoolean($data->active);
            },
            'filter' => Counter::getStatuses()
        ],
        [
            'attribute' => 'type_id',
            'value' => 'type.type',
            'filter' => CounterType::getTypes()
        ],
        ['class' => 'yii\grid\ActionColumn'],
    ]
]);