<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:08 PM
 */

include_once dirname(__DIR__) . '/vendor/autoload.php';

use SCS\Entity\Course;
use SCS\Entity\Certificate;


$app = new \Slim\App();

$app->get('/',function ($req, $res, $args) {
    return 'hello world';
});

$app->get('/api/course/{code}',function ($req, $res, $args) {
    if( ($course = new Course( $args['code'] )) && !$course->isEmpty() ){
        return $res->withJson( $course->sections() );
    }
    return $res->withJson(null,404);
});

$app->get('/api/courses',function ($req, $res, $args) {
    return 'hello world / courses';
});

$app->get('/api/certificate/{code}',function ($req, $res, $args) {
    if( ($certificate = new Certificate( $args['code'] )) && !$certificate->isEmpty() ){
        return $res->withJson( $certificate->courses() );
    }
    return $res->withJson(null,404);
});

$app->get('/api/certificates',function ($req, $res, $args) {
    $list = Certificate::getList();
    return $res->withJson($list);
});

// Run application
$app->run();