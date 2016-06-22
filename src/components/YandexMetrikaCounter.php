<?php
namespace DevGroup\Analytics\components;

use DevGroup\Analytics\models\Counter;
use Yandex\OAuth\Exception\AuthRequestException;
use Yandex\OAuth\OAuthClient;
use Yii;

class YandexMetrikaCounter extends AbstractCounter
{
    /**
     * @inheritdoc
     */
    protected static function initCounter(Counter $model)
    {
        $options = $model->getOptions();

        if (true === empty($model->counter_html)) {

        }
    }

    /**
     * Время жизни токена яндекса зависит от прав, предоставлемых приложению.
     * Для приложения с правамидоступа к API метрики токен живет не меньше, чем год.
     * Так что, спокойно можем авторизовать этим методом и пользоваться.
     *
     * @inheritdoc
     */
    public static function authorizeCounter($counter, $config)
    {
        $answer = isset($config['state']) && isset($config['code']);
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
                //TODO make PR with ability getting this param
                //$expires = $client->getTokenExpires();
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
                }
            }
        }
    }
}
