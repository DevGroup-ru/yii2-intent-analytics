<?php

use DevGroup\Analytics\components\ClickEvent;
use DevGroup\Analytics\components\GoogleAnalyticsCounter;
use DevGroup\Analytics\components\PiwikCounter;
use DevGroup\Analytics\components\YandexMetrikaCounter;
use yii\db\Migration;
use yii\helpers\Json;

class m160505_111247_counters_init extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%intent_counter_type}}', [
            'id' => $this->primaryKey(),
            'type' => $this->string(255)->notNull()->unique(),
            'title' => $this->string(255)->notNull()->unique(),
            'class' => $this->string(255)->notNull(),
            'js_module' => $this->string(255)->notNull(),
            'default_js_object' => $this->string(255)->notNull()->unique(),
            'default_options_json' => $this->text(),
        ]);

        $this->createTable('{{%intent_counter}}', [
            'id' => $this->primaryKey(),
            'type_id' => $this->integer()->notNull(),
            'title' => $this->string(255)->notNull()->unique(),
            'js_object' => $this->string(255)->notNull()->unique(),
            'options_json' => $this->text(),
            'active' => $this->boolean()->defaultValue(true),
        ]);

        $this->createTable('{{%intent_event_type}}', [
            'id' => $this->primaryKey(),
            'type' => $this->string(255)->notNull()->unique(),
            'title' => $this->string(255)->notNull(),
            'class' => $this->string(255)->notNull(),
            'js_module' => $this->string(255)->notNull(),
            'default_options_json' => $this->text(),
        ]);

        $this->createTable('{{%intent_event}}', [
            'id' => $this->primaryKey(),
            'type_id' => $this->integer()->notNull(),
            'title' => $this->string(255)->notNull(),
            'options_json' => $this->text(),
            'active' => $this->boolean()->defaultValue(true),
        ]);

        $this->addForeignKey(
            'fk_intent_counter_type',
            '{{%intent_counter}}',
            'type_id',
            '{{%intent_counter_type}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );

        $this->addForeignKey(
            'fk_intent_event_type',
            '{{%intent_event}}',
            'type_id',
            '{{%intent_event_type}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );


        /**
         * Default
         */
        $this->insert('{{%intent_counter_type}}', [
            'type' => 'Google Analytics',
            'title' => 'Google Analytics',
            'class' => GoogleAnalyticsCounter::class,
            'js_module' => 'CounterGoogleAnalytics',
            'default_js_object' => 'ga',
            'default_options_json' => '{}',
        ]);

        $this->insert('{{%intent_counter_type}}', [
            'type' => 'Yandex.Metrika',
            'title' => 'Yandex.Metrika',
            'class' => YandexMetrikaCounter::class,
            'js_module' => 'CounterYandexMetrika',
            'default_js_object' => '_yaq',
            'default_options_json' => '{}',
        ]);

        $this->insert('{{%intent_counter_type}}', [
            'type' => 'Piwik',
            'title' => 'Piwik',
            'class' => PiwikCounter::class,
            'js_module' => 'CounterPiwik',
            'default_js_object' => '_paq',
            'default_options_json' => '{}',
        ]);

        $this->insert('{{%intent_event_type}}', [
            'type' => 'click',
            'title' => 'Click',
            'class' => ClickEvent::class,
            'js_module' => 'Click',
            'default_options_json' => Json::encode([
                'selectors' => ['.ua-click-event',],
            ]),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('{{%intent_counter}}');
        $this->dropTable('{{%intent_counter_type}}');
        $this->dropTable('{{%intent_event}}');
        $this->dropTable('{{%intent_event_type}}');

        return true;
    }
}
