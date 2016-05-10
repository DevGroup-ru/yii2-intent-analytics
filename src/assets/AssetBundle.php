<?php
namespace DevGroup\Analytics\assets;

class AssetBundle extends \yii\web\AssetBundle
{
    public $sourcePath = __DIR__;
    public $js = [
        'dist/scripts/app.js',
    ];
}
