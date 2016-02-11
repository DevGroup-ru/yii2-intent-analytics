SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `analytics_categories`;
CREATE TABLE IF NOT EXISTS `analytics_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `analytics_goal`;
CREATE TABLE IF NOT EXISTS `analytics_goal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `is_transactional` tinyint(1) NOT NULL DEFAULT '0',
  `analytics_categories_id` int(11) NOT NULL,
  `ga_action_name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `ga_value` int(11) unsigned DEFAULT NULL,
  `ga_label` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `ym_goal` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `custom_params` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `once_per_visit` tinyint(1) NOT NULL DEFAULT '0',
  `once_per_visitor` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_analytics_goal_analytics_categories1` (`analytics_categories_id`),
  CONSTRAINT `fk_analytics_goal_analytics_categories1` FOREIGN KEY (`analytics_categories_id`) REFERENCES `analytics_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `intent`;
CREATE TABLE IF NOT EXISTS `intent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `timeout` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `traffic_sources`;
CREATE TABLE IF NOT EXISTS `traffic_sources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `class_name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `params` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `intent_detectors`;
CREATE TABLE IF NOT EXISTS `intent_detectors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `class_name` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `params` text COLLATE utf8_unicode_ci,
  `needs_traffic_sources_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_intent_detectors_traffic_sources2` (`needs_traffic_sources_id`),
  CONSTRAINT `fk_intent_detectors_traffic_sources2` FOREIGN KEY (`needs_traffic_sources_id`) REFERENCES `traffic_sources` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `intent_detectors_chain`;
CREATE TABLE IF NOT EXISTS `intent_detectors_chain` (
  `intent_id` int(11) NOT NULL,
  `intent_detectors_id` int(11) NOT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `name` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `class_name` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `params` text COLLATE utf8_unicode_ci,
  `needs_traffic_sources_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intent_id`,`intent_detectors_id`),
  KEY `fk_intent_detectors_chain_intent_detectors1` (`intent_detectors_id`),
  CONSTRAINT `fk_intent_detectors_chain_intent1` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_intent_detectors_chain_intent_detectors1` FOREIGN KEY (`intent_detectors_id`) REFERENCES `intent_detectors` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `self_reporting_block`;
CREATE TABLE IF NOT EXISTS `self_reporting_block` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `analytics_goal_id` int(11) NOT NULL,
  `track_inview` tinyint(1) NOT NULL DEFAULT '0',
  `inview_delay` int(11) unsigned NOT NULL DEFAULT '0',
  `inview_tracking_type` int(11) unsigned NOT NULL DEFAULT '0',
  `track_hover` tinyint(1) NOT NULL DEFAULT '0',
  `track_mouseclick` tinyint(1) NOT NULL DEFAULT '1',
  `track_text_select` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_self_reporting_block_analytics_goal1` (`analytics_goal_id`),
  CONSTRAINT `fk_self_reporting_block_analytics_goal1` FOREIGN KEY (`analytics_goal_id`) REFERENCES `analytics_goal` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `visited_page`;
CREATE TABLE IF NOT EXISTS `visited_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route` varchar(250) COLLATE utf8_unicode_ci DEFAULT '',
  `params` text COLLATE utf8_unicode_ci,
  `url` varchar(500) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `byRoute` (`route`),
  KEY `byUrl` (`url`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `visitor`;
CREATE TABLE IF NOT EXISTS `visitor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `first_visit_at` datetime DEFAULT NULL,
  `first_visit_referrer` varchar(500) COLLATE utf8_unicode_ci DEFAULT '',
  `first_visit_visited_page_id` int(11) DEFAULT NULL,
  `first_traffic_sources_id` int(11) DEFAULT NULL,
  `last_activity_at` datetime DEFAULT NULL,
  `last_activity_visited_page_id` int(11) DEFAULT NULL,
  `last_traffic_sources_id` int(11) DEFAULT NULL,
  `geo_country_id` int(11) unsigned NOT NULL DEFAULT '0',
  `geo_region_id` int(11) unsigned NOT NULL DEFAULT '0',
  `geo_city_id` int(11) unsigned NOT NULL DEFAULT '0',
  `intents_count` int(11) unsigned NOT NULL DEFAULT '0',
  `visits_count` int(11) unsigned NOT NULL DEFAULT '0',
  `actions_count` int(11) unsigned NOT NULL DEFAULT '0',
  `goals_count` int(11) unsigned NOT NULL DEFAULT '0',
  `overall_actions_value` float DEFAULT NULL,
  `overall_goals_value` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `byUser` (`user_id`),
  KEY `byFirstVisit` (`first_visit_at`),
  KEY `byLastVisit` (`last_activity_at`),
  KEY `byFirstUrls` (`first_visit_referrer`(255)),
  KEY `fk_Visitor_VisitedPage_first` (`first_visit_visited_page_id`),
  KEY `fk_Visitor_VisitedPage_last` (`last_activity_visited_page_id`),
  KEY `fk_visitor_traffic_sources1` (`first_traffic_sources_id`),
  KEY `fk_visitor_traffic_sources2` (`last_traffic_sources_id`),
  CONSTRAINT `fk_visitor_traffic_sources1` FOREIGN KEY (`first_traffic_sources_id`) REFERENCES `traffic_sources` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_traffic_sources2` FOREIGN KEY (`last_traffic_sources_id`) REFERENCES `traffic_sources` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Visitor_VisitedPage_first` FOREIGN KEY (`first_visit_visited_page_id`) REFERENCES `visited_page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Visitor_VisitedPage_last` FOREIGN KEY (`last_activity_visited_page_id`) REFERENCES `visited_page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `visitor_visit`;
CREATE TABLE IF NOT EXISTS `visitor_visit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visitor_id` int(11) NOT NULL DEFAULT '0',
  `started_at` datetime NOT NULL,
  `last_action_at` datetime DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8_unicode_ci DEFAULT '',
  `first_visited_page_id` int(11) NOT NULL,
  `first_activity_at` datetime NOT NULL,
  `last_visited_page_id` int(11) NOT NULL,
  `last_activity_at` datetime NOT NULL,
  `intents_count` int(11) unsigned NOT NULL DEFAULT '0',
  `actions_count` int(11) unsigned NOT NULL DEFAULT '0',
  `goals_count` int(11) unsigned NOT NULL DEFAULT '0',
  `actions_value` float DEFAULT NULL,
  `goals_value` float DEFAULT NULL,
  `traffic_sources_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `byTrafficSrc` (`traffic_sources_id`),
  KEY `fk_VisitorSession_Visitor1` (`visitor_id`),
  KEY `fk_visitor_visit_visited_page1` (`first_visited_page_id`),
  KEY `fk_visitor_visit_visited_page2` (`last_visited_page_id`),
  CONSTRAINT `fk_VisitorSession_Visitor1` FOREIGN KEY (`visitor_id`) REFERENCES `visitor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_visit_traffic_sources1` FOREIGN KEY (`traffic_sources_id`) REFERENCES `traffic_sources` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_visit_visited_page1` FOREIGN KEY (`first_visited_page_id`) REFERENCES `visited_page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_visit_visited_page2` FOREIGN KEY (`last_visited_page_id`) REFERENCES `visited_page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `visitor_visit_goals`;
CREATE TABLE IF NOT EXISTS `visitor_visit_goals` (
  `visitor_visit_id` int(11) NOT NULL,
  `analytics_goal_id` int(11) NOT NULL,
  `goal_at` datetime DEFAULT NULL,
  `visited_page_id` int(11) NOT NULL,
  `goal_value` float unsigned DEFAULT NULL,
  PRIMARY KEY (`visitor_visit_id`,`analytics_goal_id`),
  KEY `fk_visitor_visit_goals_visited_page1` (`visited_page_id`),
  KEY `fk_visitor_visit_goals_analytics_goal1` (`analytics_goal_id`),
  CONSTRAINT `fk_visitor_visit_goals_analytics_goal1` FOREIGN KEY (`analytics_goal_id`) REFERENCES `analytics_goal` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_visit_goals_visited_page1` FOREIGN KEY (`visited_page_id`) REFERENCES `visited_page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_visit_goals_visitor_visit1` FOREIGN KEY (`visitor_visit_id`) REFERENCES `visitor_visit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `visitor_visit_intents`;
CREATE TABLE IF NOT EXISTS `visitor_visit_intents` (
  `visitor_visit_id` int(11) NOT NULL,
  `intent_id` int(11) unsigned NOT NULL,
  `detected_at` datetime NOT NULL,
  `detected_visited_page_id` int(11) NOT NULL,
  PRIMARY KEY (`visitor_visit_id`,`intent_id`),
  KEY `fk_visitor_visit_intents_visited_page1` (`detected_visited_page_id`),
  CONSTRAINT `fk_visitor_visit_intents_visited_page1` FOREIGN KEY (`detected_visited_page_id`) REFERENCES `visited_page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitor_visit_intents_visitor_visit1` FOREIGN KEY (`visitor_visit_id`) REFERENCES `visitor_visit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;