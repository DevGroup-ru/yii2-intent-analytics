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

    private $_keyCookie = 'IDs';

    public function __construct()
    {
        if (!$this->getCookieValue()) {
            $visitorId = $this->setCookie($this->addVisitor());
        } else {
            $visitor = new Visitor();
            $visitorId = $visitor->findOne(['id' => $this->getCookieValue()])->id;
        }

        $visitorSession = new VisitorSession();

        if ($visitorSession->findOne([
                'visitor_id' => $visitorId,
                'session_id' => $this->id
            ]) === null) {
            $this->addSession($visitorId);
        }
        return true;
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
        $page = new VisitedPage();
        $checkPage = $page->findOne(['url' => $link]);

        if ($link !== null && empty($checkPage)) {
            $page->route = '';
            $page->param = '';
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
     * @param $ip
     * @return array
     */
    public function getGeoLocation($ip)
    {
        $record = false;
        $reader = new Reader('/home/user/www/dotplant3/dotplant3/GeoLite2-City.mmdb', ['ru']);
        try {
            $record = $reader->city($ip);
        } catch (\Exception $e) {
//            print_r($e);
        }

        if ($record !== false) {
            $country = ($record->country->geonameId);
            $city = ($record->city->geonameId);
            return [$country, $city];
        } else {
            return [null, null];
        }
    }

    public function cookieParser($str)
    {
        $cookies = [];

        foreach (explode('; ', $str) as $k => $v) {
            preg_match('/^(.*?)=(.*?)$/i', trim($v), $matches);
            $cookies[trim($matches[1])] = urldecode($matches[2]);
        }

        return $cookies;
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
    private function getCookieValue()
    {
        return Yii::$app->getRequest()->getCookies()->getValue($this->_keyCookie, false);
    }

    /**
     * @param $cookies
     */
    private function setCookie($value)
    {
        $cookies = Yii::$app->response->cookies;
        $cookies->add(new \yii\web\Cookie([
            'name' => $this->_keyCookie,
            'value' => $value,
            'expire' => $this->timeExpire(),
        ]));
        return $value;
    }

    /**
     * @return bool
     */
    public function addVisitor()
    {
        $url = Yii::$app->request->url;
        $visitor = new Visitor();
        $visitor->user_id;
        $visitor->first_visit_at = $this->firstActivityAt();
        $visitor->first_visit_referer = $this->getPageId($this->getReferrer());
        $visitor->first_visit_visited_page_id = $this->getPageId($url);
        $visitor->first_traffic_sources_id = $this->getPageId($url);
        $visitor->last_activity_at = $this->lastActivityAt();
        $visitor->last_activity_visited_page_id = $this->getPageId($url);
        $visitor->last_traffic_sources_id = 1;
        $visitor->geo_country_id;
        $visitor->geo_region_id;
        $visitor->geo_city_id;
        $visitor->intents_count;
        $visitor->sessions_count;
        $visitor->actions_count;
        $visitor->goals_count;
        $visitor->overall_actions_value;
        $visitor->overall_goals_value;
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
        $visitorSession->intents_count;
        $visitorSession->actions_count;
        $visitorSession->goals_count;
        $visitorSession->actions_value;
        $visitorSession->goals_value;
        $visitorSession->traffic_sources_id = 1;
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

}