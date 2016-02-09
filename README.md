Yii2 intent analytics module
============================
Visitors intent analytics and integration with Google Analytics and Yandex.Metrika for Yii framework 2

[![Build Status](https://travis-ci.org/DevGroup-ru/yii2-intent-analytics.svg?branch=master)](https://travis-ci.org/DevGroup-ru/yii2-intent-analytics)
[![codecov.io](http://codecov.io/github/DevGroup-ru/yii2-intent-analytics/coverage.svg?branch=master)](http://codecov.io/github/DevGroup-ru/yii2-intent-analytics?branch=master)

## Install

```
composer require "devgroup/yii2-intent-analytics:*"
```

```bash
./yii migrate --migrationPath=vendor/devgroup/yii2-intent-analytics/src/migrations
```

### Configure your application

Add module:

```php
    'modules' => [
        ...
        'analytics' => [
            'class' => \DevGroup\Analytics\IntentAnalyticsModule::className(),
//            'detectFirstVisitSource' => true,
//            'detectAllVisitsSources' => true,
//            'storeLastActivity' => true,
//            'storeVisitedPages' => true,
//            'visitorCookieName' => 'visitor_id',
//            'visitorCookieTime' = 61516800,
//            'modelMap' => [
//                'Visitor' => [
//                    'class' => 'DevGroup\Analytics\models\Visitor',
//                ],
//            ],
        ],
        ...
```

Add 'analytics' in 'bootstrap' section

```php
'bootstrap' => [..., 'analytics'],
```