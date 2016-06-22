<?php
/**
 * @var string $clientId
 * @var \DevGroup\Analytics\models\CounterType $model
 */
use Yandex\OAuth\OAuthClient;
use Yandex\OAuth\Exception\AuthRequestException;

$client->authRedirect(true, OAuthClient::CODE_AUTH_TYPE, $model->id);

//$client = new OAuthClient($settings['clientId'], $settings['secretKey']);
//
//try {
//    // осуществляем обмен
//    $client->requestAccessToken($_REQUEST['code']);
//} catch (AuthRequestException $ex) {
//    echo $ex->getMessage();
//}
//
//// забираем полученный токен
//$token = $client->getAccessToken();