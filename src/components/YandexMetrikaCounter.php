<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use DevGroup\Analytics\models\CounterType;
use Yandex\Metrica\Management\ManagementClient;
use Yandex\Metrica\Management\Models\CounterParams;
use Yandex\OAuth\Exception\AuthRequestException;
use Yandex\OAuth\OAuthClient;
use Yandex\Metrica\Management\Models\Counter as YaCounter;
use Yii;

class YandexMetrikaCounter extends AbstractCounter
{
    /**
     * @inheritdoc
     */
    protected static function initCounter(Counter $model)
    {
        return [];
    }

    /**
     * Время жизни токена яндекса зависит от прав, предоставлемых приложению.
     * Для приложения с правамидоступа к API метрики токен живет не меньше, чем год.
     * Так что, спокойно можем авторизовать этим методом и пользоваться.
     * Метода проверки токена на свежеть библиотека не предоставляет.
     *
     * @inheritdoc
     */
    public static function authorizeCounter(CounterType $counter, $config)
    {
        $answer = isset($config['state']) && isset($config['code']);
        if (true === self::isAuthorized($counter)) {
            Yii::$app->session->setFlash('success', Yii::t('app',
                Yii::t('app', "Access token is alive.")
            ));
            return true;
        }
        if (false === $answer) {
            $client = new OAuthClient($counter->client_id);
            $client->authRedirect(true, OAuthClient::CODE_AUTH_TYPE, $counter->id);
        } else {
            $code = $config['code'];
            $token = $expires = '';
            $client = new OAuthClient($counter->client_id, $counter->client_pass);
            try {
                $client->requestAccessToken($code);
                $token = $client->getAccessToken();
                /**
                 * TODO make PR with ability getting this param ? oj just make authorization rep request.
                 * if app was already authorized there is no need to confirm users credentials, so
                 * $expires = $client->getTokenExpires();
                 */
            } catch (AuthRequestException $ex) {
                Yii::$app->session->setFlash('error', $ex->getMessage());
            }
            if (false === empty($token)) {
                $counter->access_token = $token;
                //TODO get expiration date
                //$type->token_expires = $expires;
                if (true === $counter->save()) {
                    Yii::$app->session->setFlash('success', Yii::t('app',
                        Yii::t('app', '{type} successfully authorized!', ['type' => $counter->type])
                    ));
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @inheritdoc
     */
    public static function getCounterHtml(Counter $counter)
    {
        /** @var CounterType $type */
        $type = $counter->type;
        if (true === $type->isAuthorized()) {
            try {
                $managementClient = new ManagementClient($type->access_token);
                $paramsObj = new CounterParams();
                /**
                 * @var YaCounter $yaCounter
                 * @see http://api.yandex.ru/metrika/doc/beta/management/counters/counters.xml
                 */
                $yaCounter = $managementClient->counters()->getCounter($counter->counter_id, $paramsObj);
                if (false === $yaCounter instanceof YaCounter) {
                    Yii::$app->session->setFlash('error',
                        Yii::t('app', "'{model}' with id '{id}' not found", [
                            'model' => Yii::t('app', 'Counter'),
                            'id' => $counter->counter_id
                        ])
                    );
                    return false;
                }
                $code = $yaCounter->getCode();
                if (null === $code) {
                    Yii::$app->session->setFlash('error', Yii::t('app', 'Error receiving Counter code'));
                    return false;

                }
                //this is we need for correct counter object initialization
                //we cant set this option in Yandex backend for now, but we have to use it
                if(false === strpos($code, 'triggerEvent')) {
                    preg_match('%Ya\.Metrika\(\{([^\}]*)\}\)%', $code, $m);
                    if (true === isset($m[0], $m[1])) {
                        $code = str_replace($m[0], "Ya.Metrika({{$m[1]},triggerEvent:true})", $code);
                    }
                }
                $counter->counter_html = $code;
                if (true === $counter->save()) {
                    Yii::$app->session->setFlash('success', Yii::t('app', 'Counter code successfully received'));
                    return true;
                } else {
                    Yii::$app->session->setFlash('error', implode(', ', $counter->errors));
                    return false;
                }
            } catch (\Exception $ex) {
                Yii::$app->session->setFlash('error', $ex->getMessage());
                return false;
            }
        } else {
            //TODO
            //send to auth
        }
    }

    /**
     * @inheritdoc
     */
    static function isAuthorized(CounterType $counter, $client = null)
    {
        return true !== empty($counter->access_token);
    }

    static function getGoals(Counter $counter)
    {
        // TODO: Implement getGoals() method.
    }


}
