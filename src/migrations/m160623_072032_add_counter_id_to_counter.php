<?php

use yii\db\Migration;
use DevGroup\Analytics\models\Counter;

class m160623_072032_add_counter_id_to_counter extends Migration
{
    public function up()
    {
        $this->addColumn(
            Counter::tableName(),
            'counter_id',
            $this->string(255)
        );
    }

    public function down()
    {
        $this->dropColumn(Counter::tableName(), 'counter_id');
    }
}
