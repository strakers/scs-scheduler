<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:08 PM
 */

include_once dirname(__DIR__) . '/vendor/autoload.php';

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use SCS\Entity\Course;
use SCS\Entity\Certificate;
use SCS\Controller\ApiResourceController;
// todo: create Error class for return 404 messages when resource not found

$app = new \Slim\App();
$container = $app->getContainer();


// ---------------------------------------------------------------------------------------------------------------------
$app->get('/',function ($req, $res, $args) {
    $index_file = file_get_contents(__DIR__ . '/tmpl/main.html');
    return $index_file;
});

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/course/{code}',ApiResourceController::class . ':course');

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/courses',ApiResourceController::class . ':courses');

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/certificate/{code}',ApiResourceController::class . ':certificate');

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/certificates',ApiResourceController::class . ':certificates');

// ---------------------------------------------------------------------------------------------------------------------

// Run application
$app->run();