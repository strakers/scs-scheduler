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
// todo: create Error class for return 404 messages when resource not found

$app = new \Slim\App();
$container = $app->getContainer();


// ---------------------------------------------------------------------------------------------------------------------
$app->get('/',function ($req, $res, $args) {
    $index_file = file_get_contents(__DIR__ . '/tmpl/main.html');
    return $index_file;
});

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/course/{code}',function ($req, $res, $args) {
    if( ($course = new Course( $args['code'] )) && !$course->isEmpty() ){
        return $res->withJson( $course->export() );
    }
    return $res->withJson(null,404);
});

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/courses',function ($req, $res, $args) {
    return 'hello world / courses';
});

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/certificate/{code}',function ($req, $res, $args) {
    if( ($certificate = new Certificate( $args['code'] )) && !$certificate->isEmpty() ){
        return $res->withJson( $certificate->export() );
    }
    return $res->withJson(null,404);
});

// ---------------------------------------------------------------------------------------------------------------------
$app->get('/api/certificates',function ($req, $res, $args) {
    $list = Certificate::getList();
    return $res->withJson($list);
});

// ---------------------------------------------------------------------------------------------------------------------

// Run application
$app->run();