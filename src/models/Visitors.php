<?php
namespace app\models;

use Yii;
use app;
use yii\web\Session;
use yii\web\Request;
use PragmaRX\Tracker\Tracker;


use app\models\VisitedPage;
use app\models\Visitor;
use app\models\Cities;
use app\models\Countries;

use GeoIp2\Database\Reader;
use app\models\VisitorSession;

class Visitors extends Session
{

    public function test()
    {

        if (isset($_SERVER['HTTP_COOKIE'])) {
            $CP = $this->cookieParser($_SERVER['HTTP_COOKIE']);
//            var_dump($CP);
//            die;
        }

        $visitorSession = new VisitorSession();
        $visitorSession->visitor_id = $this->getId();
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
        $visitorSession->traffic_sources_id;
        var_dump($visitorSession->save());

        die;

        $visitorSession->geo_city_id = $city;
        var_dump($visitorSession);
        die;
    }

    /**
     * @return string
     */
    public function getIpUser()
    {
        return Yii::$app->getRequest()->getUserIP();
    }

    /**
     * @param $urlReferrer
     */
    public function getPageId($urlReferrer)
    {
        $page = new VisitedPage();
        $checkPage = $page->findOne(['url' => $urlReferrer]);

        if ($urlReferrer !== null && empty($checkPage)) {

            $page->route = '';
            $page->param = '';
            $page->url = $urlReferrer;
            $page->save();

            return Yii::$app->db->getLastInsertId();

        } elseif ($urlReferrer !== null) {
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
}