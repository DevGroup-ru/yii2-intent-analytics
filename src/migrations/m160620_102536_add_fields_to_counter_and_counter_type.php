<?php

use yii\db\Migration;
use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;

class m160620_102536_add_fields_to_counter_and_counter_type extends Migration
{
    public function up()
    {
        $this->addColumn(
            Counter::tableName(),
            'counter_html',
            $this->text()
        );
        $this->addColumn(
            CounterType::tableName(),
            'client_id',
            $this->string(255)
        );
        $this->addColumn(
            CounterType::tableName(),
            'client_pass',
            $this->string(255)
        );
        $this->addColumn(
            CounterType::tableName(),
            'access_token',
            $this->text()
        );
        $this->addColumn(
            CounterType::tableName(),
            'credentials_json',
            $this->text()
        );
        $this->addColumn(
            CounterType::tableName(),
            'token_expires',
            $this->string(255)
        );
    }

    public function down()
    {
        $this->dropColumn(Counter::tableName(), 'counter_html');
        $this->dropColumn(CounterType::tableName(), 'client_id');
        $this->dropColumn(CounterType::tableName(), 'client_pass');
        $this->dropColumn(CounterType::tableName(), 'credentials_json');
        $this->dropColumn(CounterType::tableName(), 'access_token');
        $this->dropColumn(CounterType::tableName(), 'token_expires');
    }
}
