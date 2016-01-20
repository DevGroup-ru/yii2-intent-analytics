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

    const KEY_COOKIE = 'visitor';

    const VISITOR_NAME_KEY = 'visitor_id';

    const SESSION_NAME_KEY = 'session_id';

    const USER_IF_AUTO = 'user_status';


    public $_statusAddLastVisitor = true;

    public $_statusAddLastSession = true;

    public $_statusAddUser = true;


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

    public function addLastVisitor($visitorId)
    {
        if ($this->_statusAddLastVisitor && $this->get($this::SESSION_NAME_KEY, false)) {
            VisitorSession::updateAll([
                'last_action_at' => date('Y-m-d H:i:s'),
                'last_visited_page_id' => $this->getPageId(Yii::$app->request->url)
            ], ['=', 'id', $visitorId]);
        }
    }

    public function addLastSession($sessionId)
    {
        if ($this->_statusAddLastSession && $this->get($this::VISITOR_NAME_KEY, false)) {
            // incorrect
            Visitor::updateAll([
                'last_activity_at' => date('Y-m-d H:i:s'),
                'last_activity_visited_page_id' => $this->getPageId(Yii::$app->request->url)
            ], ['=', 'id', $sessionId]);
        }
    }


    /**
     * @return int
     */
    private function sessionLifeTime()
    {
        return time() + 30;
    }

    public function run()
    {

        list($visitorId, $sessionId) = $this->init();

        if ($visitorId !== null && $sessionId !== null) {

//             if visitor first logged. add user id
            if (
                $this->_statusAddUser
                && !$this->get($this::USER_IF_AUTO, false)
                && Yii::$app->user->getId() !== null
            ) {
                Visitor::updateAll([
                    'user_id' => Yii::$app->user->getId()
                ], ['=', 'id', $visitorId]);

                $this->set($this::USER_IF_AUTO, true);
            }


            $this->addLastVisitor($visitorId);

            $this->addLastSession($sessionId);
        }

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

        $visitor->first_visit_at = $this->firstActivityAt();

//          todo first_visit_referer string
        $visitor->first_visit_referer = "" . $this->getRefererId();

        $visitor->first_visit_visited_page_id = $this->getPageId($url);
        $visitor->first_traffic_sources_id = $this->getPageId($url);
        $visitor->last_activity_at = $this->lastActivityAt();
        $visitor->last_activity_visited_page_id = $this->getPageId($url);
        $visitor->last_traffic_sources_id = 1;

        list($country, $region, $city) = $this->getGeoLocation();
        $visitor->geo_country_id = $country;
        $visitor->geo_region_id = $region;
        $visitor->geo_city_id = $city;

//          TODO add data param in the next iteration or for the future
//        $visitor->intents_count;
//        $visitor->sessions_count = 1;
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

//        TODO add data param in the next iteration or for the future
//        $visitorSession->intents_count;
//        $visitorSession->actions_count;
//        $visitorSession->goals_count;
//        $visitorSession->actions_value;
//        $visitorSession->goals_value;
//        todo When traffic uncommented result
        $visitorSession->traffic_sources_id = 0;
        $visitorSession->save();

        Visitor::updateAll([
            'sessions_count' => count(VisitorSession::findAll(['visitor_id' => $visitorId]))
        ], [
            '=', 'id', $visitorId
        ]);

        return $visitorSession->id;
    }

    /**
     * @return mixed|string
     */
    private function getReferrer()
    {
        return Yii::$app->request->referrer;
    }

    /**
     * @return array
     */
    public function init()
    {
        if (!$this->get($this::VISITOR_NAME_KEY, false) && !$this->get($this::SESSION_NAME_KEY, false)) {
            if (!$this->getCookieValue($this::KEY_COOKIE)) {
                $visitorId = $this->addCookieReturnValue($this::KEY_COOKIE, $this->addVisitor(), $this->timeExpire());
                $sessionId = $this->addSession($visitorId);
            } else {
                $visitorId = Visitor::findOne(['id' => $this->getCookieValue($this::KEY_COOKIE)])->id;
                $sessionId = VisitorSession::findOne([
                    'visitor_id' => $visitorId,
                    'session_id' => $this->id
                ]);

                if ($sessionId === null) {
                    $sessionId = $this->addSession($visitorId);
                }
            }

            $this->set($this::VISITOR_NAME_KEY, $visitorId);
            $this->set($this::SESSION_NAME_KEY, $sessionId);

            return [$visitorId, $sessionId];
        } else {
            return [
                $this->get($this::VISITOR_NAME_KEY, false),
                $this->get($this::SESSION_NAME_KEY, false)
            ];
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

    /**
     * @return array
     */
    private function getGeoLocation()
    {
        //          if it you localhost. you ip = 127.0.0.1 and result 0 0 0
        $geo = Yii::$app->multilingual->geo(Yii::$app->multilingual->getIp());

        $country = ($geo!==null && $geo->country->id !== NULL) ? $geo->country->id : 0;
        $region = ($geo!==null && $geo->region->id !== NULL) ? $geo->region->id : 0;
        $city = ($geo!==null && $geo->city->id !== NULL) ? $geo->city->id : 0;

        return [$country, $region, $city];
    }

}