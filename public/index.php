<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:08 PM
 */

include_once dirname(__DIR__) . '/vendor/autoload.php';

use Slim\App;
use SCS\Controller\HomeController;
use SCS\Controller\ApiResourceController;

$app = new App();
$container = $app->getContainer();

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/', HomeController::class);

$app->group('/api',function( App $group ){
    $group->get('/course/search', ApiResourceController::class . ':searchCourseByName');
    $group->get('/course/{code:\d+}', ApiResourceController::class . ':course');
    $group->get('/courses', ApiResourceController::class . ':courses');
    $group->get('/certificate/{code}', ApiResourceController::class . ':certificate');
    $group->get('/certificates', ApiResourceController::class . ':certificates');
});

// Run application
$app->run();