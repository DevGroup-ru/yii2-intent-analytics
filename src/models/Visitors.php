<?php
namespace DevGroup\Analytics\models;

use Yii;
use app;
use yii\web\Session;
use yii\web\Request;


use DevGroup\Analytics\models\VisitedPage;
use DevGroup\Analytics\models\Visitor;
use DevGroup\Analytics\models\Cities;
use DevGroup\Analytics\models\Countries;

use DevGroup\Analytics\models\VisitorSession;

class Visitors extends Session
{

    public $_keyCookie = 'visitor';

    public $_visitorIdNameKey = 'visitor_id';

    public $_sessionIdNameKey = 'session_id';


    public $_statusAddLastVisitor = true;

    public $_statusAddLastSession = true;


    /**
     * @return int|mixed|null|string
     */
    public function getRefererId()
    {
        $referer = $this->getReferrer();

        if ($referer !== null) {
            return $this->getPageId($referer);
        } else {
            return null;
        }
    }

    public function addLastVisitor()
    {
        if ($this->_statusAddLastVisitor && $this->get($this->_sessionIdNameKey, false)) {
            VisitorSession::updateAll([
                'last_action_at' => date('Y-m-d H:i:s'),
                'last_visited_page_id' => $this->getPageId(Yii::$app->request->url)
            ], ['=', 'id', $this->get($this->_sessionIdNameKey, false)]);
        }
    }

    public function addLastSession()
    {
        if ($this->_statusAddLastSession && $this->get($this->_visitorIdNameKey, false)) {
            // incorrect
            Visitor::updateAll([
                'last_activity_at' => date('Y-m-d H:i:s'),
                'last_activity_visited_page_id' => $this->getPageId(Yii::$app->request->url)
            ], ['=', 'id', $this->get($this->_visitorIdNameKey, false)]);
        }
    }


    /**
     * @return int
     */
    private function sessionLifeTime()
    {
        return time() + 30;
    }

    public function __construct()
    {

        $this->init();

        $this->addLastVisitor();

        $this->addLastSession();

    }

    /**
     * @return string
     */
    public function getIpUser()
    {
        return Yii::$app->getRequest()->getUserIP();
    }

    /**
     * @param $link
     */
    public function getPageId($link)
    {
        if ($pageId = Yii::$app->cache->get($link)) {
            return $pageId;
        } else {
            $pageId = $this->getPageIdFromDB($link);
            Yii::$app->cache->set($link, $pageId, 24 * 60 * 60);
            return $pageId;
        }

    }

    /**
     * @return bool|string
     */
    public function startedAt()
    {
        return date('Y-m-d H:i:s');
    }

    /**
     * @return bool|string
     */
    public function lastActionAt()
    {
        return date('Y-m-d H:i:s');
    }

    /**
     * @return bool|string
     */
    public function firstActivityAt()
    {
        return date('Y-m-d H:i:s');
    }

    /**
     * @return bool|string
     */
    public function lastActivityAt()
    {
        return date('Y-m-d H:i:s');
    }

    /**
     * @return int
     */
    protected function timeExpire()
    {
        return time() + 24 * 60 * 60;
    }

    /**
     * @return mixed
     */
    private function getCookieValue($key)
    {
        return Yii::$app->getRequest()->getCookies()->getValue($key, false);
    }

    /**
     * @return bool
     */
    public function addVisitor()
    {
        $url = Yii::$app->request->url;
        $visitor = new Visitor();
// TODO if user authorized. add in the next iteration or for the future
//        $visitor->user_id;
        $visitor->first_visit_at = $this->firstActivityAt();
        $visitor->first_visit_referer = $this->getRefererId();
        $visitor->first_visit_visited_page_id = $this->getPageId($url);
        $visitor->first_traffic_sources_id = $this->getPageId($url);
        $visitor->last_activity_at = $this->lastActivityAt();
        $visitor->last_activity_visited_page_id = $this->getPageId($url);
        $visitor->last_traffic_sources_id = 1;

// TODO add data param in the next iteration or for the future
//        $visitor->geo_country_id;
//        $visitor->geo_region_id;
//        $visitor->geo_city_id;
//        $visitor->intents_count;
//        $visitor->sessions_count;
//        $visitor->actions_count;
//        $visitor->goals_count;
//        $visitor->overall_actions_value;
//        $visitor->overall_goals_value;
        $visitor->save();
        return $visitor->id;
    }

    private function addSession($visitorId)
    {
        $visitorSession = new VisitorSession();
        $visitorSession->visitor_id = $visitorId;
        $visitorSession->session_id = $this->id;
        $visitorSession->started_at = $this->startedAt();
        $visitorSession->last_action_at = $this->lastActionAt();
        $visitorSession->ip = $this->getIpUser();
        $visitorSession->first_visited_page_id = $this->getPageId(Yii::$app->request->url);
        $visitorSession->first_activity_at = $this->firstActivityAt();
        $visitorSession->last_visited_page_id = $this->getPageId(Yii::$app->request->url);
        $visitorSession->last_activity_at = $this->lastActivityAt();

// TODO add data param in the next iteration or for the future
//        $visitorSession->intents_count;
//        $visitorSession->actions_count;
//        $visitorSession->goals_count;
//        $visitorSession->actions_value;
//        $visitorSession->goals_value;
//        $visitorSession->traffic_sources_id = 1;
        $visitorSession->save();
        return $visitorSession->id;
    }

    /**
     * @return mixed|string
     */
    private function getReferrer()
    {
        return Yii::$app->request->referrer;
    }

    public function init()
    {
        // check Session for visitor
        if (!$this->get($this->_visitorIdNameKey, false) && !$this->get($this->_sessionIdNameKey, false)) {
            if (!$this->getCookieValue($this->_keyCookie)) {
                $visitorId = $this->addCookieReturnValue($this->_keyCookie, $this->addVisitor(), $this->timeExpire());
                $sessionId = $this->addSession($this->_visitorIdNameKey);
            } else {
                $visitorId = Visitor::findOne(['id' => $this->getCookieValue($this->_keyCookie)])->id;
                $sessionId = VisitorSession::findOne([
                    'visitor_id' => $this->_visitorIdNameKey,
                    'session_id' => $this->id
                ]);

                if ($this->_sessionIdNameKey === null) {
                    $this->_sessionIdNameKey = $this->addSession($this->_visitorIdNameKey);
                }
            }

            $this->set($this->_visitorIdNameKey, $visitorId);
            $this->set($this->_sessionIdNameKey, $sessionId);
        }
    }


    /**
     * @param $link
     * @return int|null|string
     */
    public function getPageIdFromDB($link)
    {
        $page = new VisitedPage();
        $checkPage = $page->findOne(['url' => $link]);

        if ($link !== null && empty($checkPage)) {

//              TODO add data param in the next iteration or for the future
//            $page->route = '';
//            $page->param = '';
            $page->url = $link;
            $page->save();
            return Yii::$app->db->getLastInsertId();
        } elseif ($link !== null) {
            return $checkPage->id;
        } else {
            return null;
        }
    }

    /**
     * @param $key
     * @param $value
     * @param $timeExpire
     * @return mixed
     */
    private function addCookieReturnValue($key, $value, $timeExpire = 0)
    {
        $cookies = Yii::$app->response->cookies;
        $cookies->add(new \yii\web\Cookie([
            'name' => $key,
            'value' => $value,
            'expire' => $timeExpire,
        ]));
        return $value;
    }
}