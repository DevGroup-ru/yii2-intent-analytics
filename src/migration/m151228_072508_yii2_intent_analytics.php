<?php

use yii\db\Migration;

class m151228_072508_yii2_intent_analytics extends Migration
{
    public function up()
    {
        mb_internal_encoding("UTF-8");
        $tableOptions = $this->db->driverName === 'mysql'
            ? 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB'
            : null;

        $this->createTable(
            '{{%analytics_categories}}',
            [
                'id' =>$this->primaryKey(),
                'name' => $this->integer()->defaultValue('')->notNull(),
            ],
            $tableOptions
        );

        $this->createTable(
            '{{%analytics_goal}}',
            [
                'id' => $this->primaryKey(),
                'name' => $this->text(),
                'is_transactional' => $this->boolean()->notNull()->defaultValue(0),
                'analytics_categories_id' => $this->integer(10)->notNull(),
                'ga_action_name' => $this->string(),
                'ga_value' => $this->integer(10)->notNull(),
                'ga_label' => $this->string(),
                'ym_goal' => $this->string(),
                'custom_params' => $this->string(),
                'once_per_session' => $this->boolean()->notNull()->defaultValue(0),
                'once_per_visitor' => $this->boolean()->notNull()->defaultValue(0),
            ],
            $tableOptions);
        $this->createIndex('fk_analytics_goal_analytics_categories1_idx', '{{%analytics_goal}}', 'analytics_categories_id');

        $this->createTable(
            '{{%intent}}',
            [
                'id' => $this->primaryKey(),
                'name' => $this->string()->notNull(),
                'timeout' => $this->integer(10)->defaultValue(0)
            ], $tableOptions);

        $this->createTable(
            '{{%intent_detectors}}',
            [
                'id' => $this->primaryKey(),
                'name' => $this->string()->notNull(),
                'class_name' => $this->string()->notNull(),
                'params' => $this->string(),
                'needs_traffic_sources_id' => $this->integer(10)->defaultValue(0)->notNull()
            ], $tableOptions);
        $this->createIndex('fk_intent_detectors_traffic_sources2_idx', '{{%intent_detectors}}', 'needs_traffic_sources_id');

        $this->createTable(
            '{{%intent_detectors_chain}}',
            [
                'intent_id' => $this->integer(10)->notNull(),
                'intent_detectors_id' => $this->integer(10)->notNull(),
                'sort_order' => $this->integer(11)->defaultValue(null)
            ], $tableOptions);
        $this->addPrimaryKey('intent_detectors_chain_intent_id', '{{%intent_detectors_chain}}', 'intent_id');
        $this->createIndex('fk_intent_detectors_chain_intent_detectors1_idx', '{{%intent_detectors_chain}}', 'intent_detectors_id');

        $this->createTable(
            '{{%self_reporting_block}}',
            [
                'id' => $this->primaryKey(),
                'name' => $this->string(),
                'analytics_goal_id' => $this->integer(10)->notNull(),
                'track_inview' => $this->integer(1)->notNull()->defaultValue(0),
                'track_inview' => $this->integer(1)->notNull()->defaultValue(0),
                'inview_delay' => $this->integer(11)->defaultValue(0)->notNull(),
                'inview_tracking_type' => $this->integer(11)->defaultValue(0)->notNull(), /*add comment =>  COMMENT 'top, bottom, whole',*/
                'track_hover' => $this->integer(1)->notNull()->defaultValue(0),
                'track_mouseclick' => $this->integer(1)->notNull()->defaultValue(1),
                'track_text_select' => $this->integer(1)->notNull()->defaultValue(1)
            ], $tableOptions);
        $this->createIndex('fk_self_reporting_block_analytics_goal1_idx', '{{%self_reporting_block}}', 'analytics_goal_id');

        $this->createTable(
            '{{%traffic_sources}}',
            [
                'id' => $this->primaryKey(),
                'name' => $this->string(),
                'class_name' => $this->string(),
                'params' => $this->string()
            ], $tableOptions);

        $this->createTable(
            '{{%visited_page}}',
            [
                'id' => $this->primaryKey(),
                'route' => $this->string(80)->defaultValue(null),
                'param' => $this->string(),
                'url' => $this->string()
            ], $tableOptions);
        $this->createIndex('byRoute', '{{%visited_page}}', 'route');

        $this->createTable(
            '{{%visitor}}',
            [
                'id' => $this->primaryKey(),
                'user_id' => $this->integer(10)->defaultValue(0)->notNull(),
                'first_visit_at' => $this->dateTime()->defaultValue(null),
                'first_visit_referer' => $this->string(),
                'first_visit_visited_page_id' => $this->integer(10)->notNull()->defaultValue(0),
                'first_traffic_sources_id' => $this->integer(10)->defaultValue(0),
                'last_activity_at' => $this->dateTime()->defaultValue(null),
                'last_activity_visited_page_id' => $this->integer(10)->notNull()->defaultValue(0),
                'last_traffic_sources_id' => $this->integer(10)->notNull(),
                'geo_country_id' => $this->integer(10)->notNull()->defaultValue(0),
                'geo_region_id' => $this->integer(10)->notNull()->defaultValue(0),
                'geo_city_id' => $this->integer(10)->notNull()->defaultValue(0),
                'intents_count' => $this->integer(10)->notNull()->defaultValue(0),
                'sessions_count' => $this->integer(10)->notNull()->defaultValue(0),
                'actions_count' => $this->integer(10)->notNull()->defaultValue(0),
                'goals_count' => $this->integer(10)->notNull()->defaultValue(0),
                'overall_actions_value' => $this->float()->defaultValue(null),
                'overall_goals_value' => $this->float()->defaultValue(null),
            ], $tableOptions);
        $this->createIndex('byUser', '{{%visitor}}', 'user_id');
        $this->createIndex('byFirstVisit', '{{%visitor}}', 'first_visit_at');
        $this->createIndex('byLastVisit', '{{%visitor}}', 'last_activity_at');
        $this->createIndex('fk_Visitor_VisitedPage_first', '{{%visitor}}', 'first_visit_visited_page_id');
//        $this->createIndex('fk_Visitor_VisitedPage_last', '{{%visitor}}', 'last_activity_visited_page_id');
        $this->createIndex('fk_visitor_traffic_sources1_idx', '{{%visitor}}', 'first_traffic_sources_id');
        $this->createIndex('fk_visitor_traffic_sources2_idx', '{{%visitor}}', 'last_traffic_sources_id');

        $this->createTable(
            '{{%visitor_session}}',
            [
                'id' => $this->primaryKey(),
                'visitor_id' => $this->integer(10)->notNull(),
                'started_at' => $this->dateTime()->notNull(),
                'last_action_at' => $this->dateTime()->notNull(),
                'ip' => $this->string(45)->defaultValue(null),
                'first_visited_page_id' => $this->integer(10)->notNull(),
                'first_activity_at' => $this->dateTime()->notNull(),
                'last_visited_page_id' => $this->integer(10)->notNull(),
                'last_activity_at' => $this->dateTime()->notNull(),
                'intents_count' => $this->integer(11)->defaultValue(0),
                'actions_count' => $this->integer(11)->defaultValue(0),
                'goals_count' => $this->integer(11)->defaultValue(0),
                'actions_value' => $this->float()->defaultValue(0),
                'goals_value' => $this->float()->defaultValue(0),
                'traffic_sources_id' => $this->integer(10)->notNull(),
            ], $tableOptions);
        $this->createIndex('fk_VisitorSession_Visitor1_idx', '{{%visitor_session}}', 'visitor_id');
        $this->createIndex('fk_visitor_session_visited_page1_idx', '{{%visitor_session}}', 'first_visited_page_id');
        $this->createIndex('fk_visitor_session_visited_page2_idx', '{{%visitor_session}}', 'last_visited_page_id');
        $this->createIndex('fk_visitor_session_traffic_sources1_idx', '{{%visitor_session}}', 'traffic_sources_id');
        $this->createIndex('byTrafficSrc', '{{%visitor_session}}', 'traffic_sources_id');

        $this->createTable(
            '{{%visitor_session_goals}}',
            [
                'visitor_session_id' => $this->integer(10)->notNull(),
                'analytics_goal_id' => $this->integer(10)->notNull(),
                'goal_at' => $this->dateTime()->defaultValue(null),
                'visited_page_id' => $this->integer(10)->notNull(),
                'goal_value' => $this->float()->defaultValue(0),
            ], $tableOptions);
        $this->addPrimaryKey('visitor_session_id', '{{%visitor_session_goals}}', ['visitor_session_id', 'analytics_goal_id']);
        $this->createIndex('fk_visitor_session_goals_analytics_goal1_idx', '{{%visitor_session_goals}}', 'analytics_goal_id');
        $this->createIndex('fk_visitor_session_goals_visited_page1_idx', '{{%visitor_session_goals}}', 'visited_page_id');

        $this->createTable(
            '{{%visitor_session_intents}}',
            [
                'visitor_session_id' => $this->integer(10),
                'intent_id' => $this->integer(10),
                'detected_at' => $this->dateTime()->defaultValue(null),
                'visited_page_id' => $this->integer(10)->notNull(),
                'detected_visited_page_id' => $this->float()->defaultValue(0),
            ], $tableOptions);

        $this->addPrimaryKey('visitorSessionIntents', '{{%visitor_session_intents}}', ['visitor_session_id', 'intent_id']);

        $this->addForeignKey('intent_ibfk_1', 'intent', 'id', '{{%intent_detectors_chain}}', 'intent_id');
        $this->addForeignKey('analytics_categories_ibfk_1', 'analytics_categories', 'id', 'analytics_goal', 'analytics_categories_id');
        $this->addForeignKey('analytics_goal_ibfk_1', 'analytics_goal', 'id', 'visitor_session_goals', 'analytics_goal_id');
        $this->addForeignKey('intent_detectors_ibfk_1', 'intent_detectors', 'id', 'intent_detectors_chain', 'intent_detectors_id');
        $this->addForeignKey('fk_self_reporting_block_analytics_goal1', 'self_reporting_block', 'analytics_goal_id', 'analytics_goal', 'id');
        $this->addForeignKey('traffic_sources_ibfk_1', 'traffic_sources', 'id', 'intent_detectors', 'needs_traffic_sources_id');
        $this->addForeignKey('visited_page_ibfk_1', 'visitor_session', 'first_visited_page_id', 'visited_page', 'id');

//        $this->addForeignKey('fk_Visitor_VisitedPage_first', 'visitor', 'first_visit_visited_page_id', 'visited_page', 'id');
//        $this->addForeignKey('fk_Visitor_VisitedPage_last', 'visitor', 'last_activity_visited_page_id', 'visited_page', 'id');
        $this->addForeignKey('fk_visitor_traffic_sources1', 'visitor', 'first_traffic_sources_id', 'visited_page', 'id');
        $this->addForeignKey('fk_visitor_traffic_sources2', 'visitor', 'last_traffic_sources_id', 'visited_page', 'id');
        $this->addForeignKey('visitor_ibfk_1', 'visitor', 'last_traffic_sources_id', 'visitor_session', 'visitor_id');

//        $this->addForeignKey('visitor_session_ibfk_1', 'visitor_session', 'id', 'visitor_session_goals', 'visitor_session_id');
        $this->addForeignKey('visitor_session_goals_ibfk_1', 'visitor_session_goals', 'visited_page_id', 'visited_page', 'id');

        $this->addForeignKey('visitor_session_intents_ibfk_1', 'visitor_session_intents', 'visitor_session_id', 'visitor_session', 'id');
        $this->addForeignKey('visitor_session_intents_ibfk_2', 'visitor_session_intents', 'intent_id', 'intent', 'id');
//        $this->addForeignKey('visitor_session_intents_ibfk_3', 'visitor_session_intents', 'detected_visited_page_id', 'visited_page', 'id');

    }

    public function down()
    {
        $this->dropTable('{{%intent}}');
        return false;
    }
}
