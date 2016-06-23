<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;
use Google_Service_Analytics;
use Google_Client;
use Yii;

class GoogleAnalyticsCounter extends AbstractCounter
{
    /**
     * @inheritdoc
     */
    protected static function initCounter(Counter $model)
    {
        return [];
    }

    /**
     * Время жизни постоянного токена зависит от типа приложения. Начинается от 1 часа.
     * В идеале, для такого типа приложения нужно делать авторизацию через *.json, который Google
     * предоставляет при создании учетных данных в консоли администратора.
     *
     * @inheritdoc
     */
    public static function authorizeCounter(CounterType $counter, $config)
    {
        $answer = isset($config['state']) && isset($config['code']);
        $client = self::getClient($counter->id);
        self::setCredentials($counter, $client);
        if (true === self::isAuthorized($counter, $client)) {
            Yii::$app->session->setFlash('success', Yii::t('app',
                Yii::t('app', "Access token is alive.")
            ));
            return true;
        }
        if (false === $answer) {
            $auth_url = $client->createAuthUrl();
            Yii::$app->getResponse()->redirect($auth_url)->send();
            return;
        } else {
            $code = $config['code'];
            try {
                $creds = $client->fetchAccessTokenWithAuthCode($code);
            } catch (\InvalidArgumentException $ex) {
                Yii::$app->session->setFlash('error', $ex->getMessage());
                return false;
            }
            return self::handleCredentials($counter, $creds);
        }

    }

    private static function getClient($state)
    {
        $client = new Google_Client();
        //TODO do not forget to change
        $client->setRedirectUri('http://localhost:9080');
        //$client->setRedirectUri(Url::to(['/analytics/counter-types/auth'], true));
        $client->setAccessType('offline');
        $client->setApplicationName(Yii::$app->id);
        $client->addScope(Google_Service_Analytics::ANALYTICS);
        $client->addScope(Google_Service_Analytics::ANALYTICS_EDIT);
        $client->setIncludeGrantedScopes(true);
        $client->setState($state);
        return $client;
    }

    /**
     * @param CounterType $counter
     * @param Google_Client $client
     * @return bool
     */
    protected static function setCredentials($counter, $client)
    {
        $account = json_decode($counter->credentials_json, true);
        if (null === $account || false === isset($account['web'])) {
            Yii::$app->session->setFlash('error', Yii::t('app',
                Yii::t('app', "Credentials are empty! Maybe you first need to register application in the Google development console.")
            ));
            return false;
        }
        $client->setClientId($account['web']['client_id']);
        $client->setClientSecret($account['web']['client_secret']);
        if (isset($account['web']['redirect_uris'])) {
            $client->setRedirectUri($account['web']['redirect_uris'][0]);
        }
    }

    /**
     * @param CounterType $counter
     * @param array $creds
     * @return bool
     */
    protected static function handleCredentials($counter, $creds)
    {
        if (false === isset($creds['error']) && true === isset($creds['access_token'])) {
            if (false === empty($counter->access_token)) {
                $current = json_decode($counter->access_token, true);
                if (null !== $current && true === isset($current['access_token'], $current['refresh_token'])) {
                    $creds['refresh_token'] = $current['refresh_token'];
                } else {
                    Yii::$app->session->setFlash('error', Yii::t('app',
                        'There in no "refresh_token" stored! Please, create new credentials and authorize again!'
                    ));
                }
            }
            $counter->access_token = json_encode($creds);
            if (true === $counter->save()) {
                Yii::$app->session->setFlash('success', Yii::t('app',
                    Yii::t('app', '{type} successfully authorized!', ['type' => $counter->type])
                ));
                return true;
            } else {
                Yii::$app->session->setFlash('error', Yii::t('app',
                    'There was an error while saving {model}', ['model' => Yii::t('app', 'Counter Type')]
                ));
            }
        } else {
            return self::handleError($creds);
        }
        return false;
    }

    protected static function handleError($creds)
    {
        Yii::$app->session->setFlash('error', implode(': ', $creds));
        return false;
        //TODO
    }

    /**
     * @param Counter $counter
     * @return bool
     */
    public static function getCounterHtml(Counter $counter)
    {
        new Google_Service_Analytics([]);
    }

    /**
     * @inheritdoc
     */
    public static function isAuthorized(CounterType $counter, $client = null)
    {
        if (false === empty($counter->access_token)) {
            if (null === $client) {
                $client = self::getClient($counter->id);
            }
            $client->setAccessToken($counter->access_token);
            if (true === $client->isAccessTokenExpired()) {
                $creds = $client->fetchAccessTokenWithRefreshToken();
                return self::handleCredentials($counter, $creds);
            }
            return true;
        }
        return false;
    }


}
