<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-06
 * Time: 1:11 AM
 */

namespace SCS\Controller;

use Slim\Http\Request;
use Slim\Http\Response;
use SCS\Entity\Course;
use SCS\Entity\Certificate;

/**
 * Class ApiResourceController
 * @package SCS\Controller
 */
class ApiResourceController
{

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function course(Request $req, Response $res, array $args)
    {
        if( ($course = new Course( $args['code'] )) && !$course->isEmpty() ){
            return $res->withJson( $course->export() );
        }
        return $res->withJson(null,404);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @return Response
     */
    public function courses(Request $req, Response $res)
    {
        $list = Course::getList();
        return $res->withJson($list);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function certificate(Request $req, Response $res, array $args)
    {
        if( ($certificate = new Certificate( $args['code'] )) && !$certificate->isEmpty() ){
            return $res->withJson( $certificate->export() );
        }
        return $res->withJson(null,404);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @return Response
     */
    public function certificates(Request $req, Response $res)
    {
        $list = Certificate::getList();
        return $res->withJson($list);
    }

}