<?php

use yii\db\Migration;

class m160208_093809_intent_analytics extends Migration
{
    public function up()
    {
        mb_internal_encoding("UTF-8");
        $tableOptions = $this->db->driverName === 'mysql'
            ? 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB'
            : null;

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%analytics_categories}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(250)->defaultValue(''),
        ], $tableOptions);

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%analytics_goal}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(250)->defaultValue(''),
            'is_transactional' => $this->boolean()->notNull()->defaultValue(0),
            'analytics_categories_id' => $this->integer()->notNull(),
            'ga_action_name' => $this->string(250)->defaultValue(''),
            'ga_value' => $this->integer()->unsigned(),
            'ga_label' => $this->string(250)->defaultValue(''),
            'ym_goal' => $this->string(250)->defaultValue(''),
            'custom_params' => $this->string(250)->defaultValue(''),
            'once_per_visit' => $this->boolean()->notNull()->defaultValue(0),
            'once_per_visitor' => $this->boolean()->notNull()->defaultValue(0),
        ], $tableOptions);

        $this->addForeignKey(
            'fk_analytics_goal_analytics_categories1',
            '{{%analytics_goal}}',
            ['analytics_categories_id'],
            '{{%analytics_categories}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%self_reporting_block}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(250)->defaultValue(''),
            'analytics_goal_id' => $this->integer()->notNull(),
            'track_inview' => $this->boolean()->notNull()->defaultValue(0),
            'inview_delay' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'inview_tracking_type' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'track_hover' => $this->boolean()->notNull()->defaultValue(0),
            'track_mouseclick' => $this->boolean()->notNull()->defaultValue(1),
            'track_text_select' => $this->boolean()->notNull()->defaultValue(1),
        ], $tableOptions);

        $this->addForeignKey(
            'fk_self_reporting_block_analytics_goal1',
            '{{%self_reporting_block}}',
            ['analytics_goal_id'],
            '{{%analytics_goal}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%intent}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(250)->defaultValue(''),
            'timeout' => $this->integer()->unsigned()->notNull()->defaultValue(0),
        ], $tableOptions);

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%traffic_sources}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(250)->defaultValue(''),
            'class_name' => $this->string(250)->defaultValue(''),
            'params' => $this->text(),
        ], $tableOptions);

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%intent_detectors}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(250)->defaultValue('')->notNull(),
            'class_name' => $this->string(250)->defaultValue('')->notNull(),
            'params' => $this->text(),
            'needs_traffic_sources_id' => $this->integer()->notNull()->defaultValue(0),
        ], $tableOptions);

        $this->addForeignKey(
            'fk_intent_detectors_traffic_sources2',
            '{{%intent_detectors}}',
            ['needs_traffic_sources_id'],
            '{{%traffic_sources}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%intent_detectors_chain}}', [
            'intent_id' => $this->integer()->notNull(),
            'intent_detectors_id' => $this->integer()->notNull(),
            'sort_order' => $this->integer(),
            'name' => $this->string(250)->defaultValue('')->notNull(),
            'class_name' => $this->string(250)->defaultValue('')->notNull(),
            'params' => $this->text(),
            'needs_traffic_sources_id' => $this->integer()->notNull()->defaultValue(0),
        ], $tableOptions);
        $this->addPrimaryKey('PRIMARY KEY', '{{%intent_detectors_chain}}', ['intent_id', 'intent_detectors_id']);

        $this->addForeignKey(
            'fk_intent_detectors_chain_intent1',
            '{{%intent_detectors_chain}}',
            ['intent_id'],
            '{{%intent}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_intent_detectors_chain_intent_detectors1',
            '{{%intent_detectors_chain}}',
            ['intent_detectors_id'],
            '{{%intent_detectors}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%visited_page}}', [
            'id' => $this->primaryKey(),
            'route' => $this->string(250)->defaultValue(''),
            'params' => $this->text(),
            'url' => $this->string(255)->defaultValue(''),
        ], $tableOptions);
        $this->createIndex('byRoute', '{{%visited_page}}', ['route']);
        $this->createIndex('byUrl', '{{%visited_page}}', ['url']);

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%visitor}}', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'first_visit_at' => $this->dateTime(),
            'first_visit_referrer' => $this->string(255)->defaultValue(''),
            'first_visit_visited_page_id' => $this->integer()->defaultExpression('NULL'),
            'first_traffic_sources_id' => $this->integer()->defaultExpression('NULL'),
            'last_activity_at' => $this->dateTime(),
            'last_activity_visited_page_id' => $this->integer()->defaultExpression('NULL'),
            'last_traffic_sources_id' => $this->integer()->defaultExpression('NULL'),
            'geo_country_id' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'geo_region_id' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'geo_city_id' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'intents_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'visits_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'actions_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'goals_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'overall_actions_value' => $this->float(),
            'overall_goals_value' => $this->float(),
        ], $tableOptions);
        $this->createIndex('byUser', '{{%visitor}}', ['user_id']);
        $this->createIndex('byFirstVisit', '{{%visitor}}', ['first_visit_at']);
        $this->createIndex('byLastVisit', '{{%visitor}}', ['last_activity_at']);
        $this->createIndex('byFirstUrls', '{{%visitor}}', ['first_visit_referrer']);

        $this->addForeignKey(
            'fk_Visitor_VisitedPage_first',
            '{{%visitor}}',
            ['first_visit_visited_page_id'],
            '{{%visited_page}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_Visitor_VisitedPage_last',
            '{{%visitor}}',
            ['last_activity_visited_page_id'],
            '{{%visited_page}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_traffic_sources1',
            '{{%visitor}}',
            ['first_traffic_sources_id'],
            '{{%traffic_sources}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_traffic_sources2',
            '{{%visitor}}',
            ['last_traffic_sources_id'],
            '{{%traffic_sources}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%visitor_visit}}', [
            'id' => $this->primaryKey(),
            'visitor_id' => $this->integer()->notNull()->defaultValue(0),
            'started_at' => $this->dateTime()->notNull(),
            'last_action_at' => $this->dateTime(),
            'ip' => $this->string(45)->defaultValue(''),
            'first_visited_page_id' => $this->integer()->notNull(),
            'first_activity_at' => $this->dateTime()->notNull(),
            'last_visited_page_id' => $this->integer()->notNull(),
            'last_activity_at' => $this->dateTime()->notNull(),
            'intents_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'actions_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'goals_count' => $this->integer()->unsigned()->notNull()->defaultValue(0),
            'actions_value' => $this->float(),
            'goals_value' => $this->float(),
            'traffic_sources_id' => $this->integer()->defaultExpression('NULL'),
        ], $tableOptions);
        $this->createIndex('byTrafficSrc', '{{%visitor_visit}}', ['traffic_sources_id']);

        $this->addForeignKey(
            'fk_VisitorSession_Visitor1',
            '{{%visitor_visit}}',
            ['visitor_id'],
            '{{%visitor}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_visit_visited_page1',
            '{{%visitor_visit}}',
            ['first_visited_page_id'],
            '{{%visited_page}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_visit_visited_page2',
            '{{%visitor_visit}}',
            ['last_visited_page_id'],
            '{{%visited_page}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_visit_traffic_sources1',
            '{{%visitor_visit}}',
            ['traffic_sources_id'],
            '{{%traffic_sources}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%visitor_visit_intents}}', [
            'visitor_visit_id' => $this->integer()->notNull(),
            'intent_id' => $this->integer()->unsigned()->notNull(),
            'detected_at' => $this->dateTime()->notNull(),
            'detected_visited_page_id' => $this->integer()->notNull(),
        ], $tableOptions);
        $this->addPrimaryKey('PRIMARY KEY', '{{%visitor_visit_intents}}', ['visitor_visit_id', 'intent_id']);

        $this->addForeignKey(
            'fk_visitor_visit_intents_visitor_visit1',
            '{{%visitor_visit_intents}}',
            ['visitor_visit_id'],
            '{{%visitor_visit}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_visit_intents_visited_page1',
            '{{%visitor_visit_intents}}',
            ['detected_visited_page_id'],
            '{{%visited_page}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );

        //--------------------------------------------------------------------------------------------------------------
        $this->createTable('{{%visitor_visit_goals}}', [
            'visitor_visit_id' => $this->integer()->notNull(),
            'analytics_goal_id' => $this->integer()->notNull(),
            'goal_at' => $this->dateTime(),
            'visited_page_id' => $this->integer()->notNull(),
            'goal_value' => $this->float()->unsigned(),
        ], $tableOptions);
        $this->addPrimaryKey('PRIMARY KEY', '{{%visitor_visit_goals}}', ['visitor_visit_id', 'analytics_goal_id']);

        $this->addForeignKey(
            'fk_visitor_visit_goals_visitor_visit1',
            '{{%visitor_visit_goals}}',
            ['visitor_visit_id'],
            '{{%visitor_visit}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_visit_goals_visited_page1',
            '{{%visitor_visit_goals}}',
            ['visited_page_id'],
            '{{%visited_page}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
        $this->addForeignKey(
            'fk_visitor_visit_goals_analytics_goal1',
            '{{%visitor_visit_goals}}',
            ['analytics_goal_id'],
            '{{%analytics_goal}}',
            ['id'],
            'NO ACTION',
            'NO ACTION'
        );
    }

    public function down()
    {

        $this->dropTable('{{%visitor_visit_goals}}');
        $this->dropTable('{{%visitor_visit_intents}}');
        $this->dropTable('{{%visitor_visit}}');
        $this->dropTable('{{%visitor}}');
        $this->dropTable('{{%visited_page}}');
        $this->dropTable('{{%intent_detectors_chain}}');
        $this->dropTable('{{%intent_detectors}}');
        $this->dropTable('{{%traffic_sources}}');
        $this->dropTable('{{%intent}}');
        $this->dropTable('{{%self_reporting_block}}');
        $this->dropTable('{{%analytics_goal}}');
        $this->dropTable('{{%analytics_categories}}');
    }
}
