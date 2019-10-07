<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-06
 * Time: 1:34 AM
 */

namespace SCS\Controller;

use Slim\Http\Request;
use Slim\Http\Response;
use GuzzleHttp\Psr7\LazyOpenStream;

class HomeController
{
    public function __invoke(Request $req, Response $res)
    {
        $path = public_path('/tmpl/main.html');
        $stream = new LazyOpenStream($path, 'r');
        return $res->withBody($stream);
    }
}