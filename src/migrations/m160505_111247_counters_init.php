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
        $this->createTable('{{%intent_counter}}', [
            'id' => $this->primaryKey(),
            'type' => "ENUM('Google Analytics', 'Yandex.Metrika', 'Piwik')",
            'title' => $this->string(255)->notNull()->unique(),
            'class' => $this->string(255)->notNull(),
            'js_module' => $this->string(255)->notNull(),
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
        $this->insert('{{%intent_counter}}', [
            'type' => 'Google Analytics',
            'title' => 'Google Analytics',
            'class' => GoogleAnalyticsCounter::class,
            'js_module' => 'CounterGoogleAnalytics',
            'js_object' => 'ga',
            'options_json' => '{}',
            'active' => false,
        ]);

        $this->insert('{{%intent_counter}}', [
            'type' => 'Yandex.Metrika',
            'title' => 'Yandex.Metrika',
            'class' => YandexMetrikaCounter::class,
            'js_module' => 'CounterYandexMetrika',
            'js_object' => '_yaq',
            'options_json' => '{}',
            'active' => false,
        ]);

        $this->insert('{{%intent_counter}}', [
            'type' => 'Piwik',
            'title' => 'Piwik',
            'class' => PiwikCounter::class,
            'js_module' => 'CounterPiwik',
            'js_object' => '_paq',
            'options_json' => '{}',
            'active' => false,
        ]);

        $this->insert('{{%intent_event_type}}', [
            'type' => 'click',
            'title' => 'Click',
            'class' => ClickEvent::class,
            'js_module' => 'Click',
            'default_options_json' => Json::encode([
                'selectors' => ['.iaq-click-event',],
            ]),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('{{%intent_counter}}');
        $this->dropTable('{{%intent_event}}');
        $this->dropTable('{{%intent_event_type}}');

        return true;
    }
}
