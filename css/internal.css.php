<?php
/**
 * Created by PhpStorm.
 * User: strakers
 * Date: 11/13/2017
 * Time: 4:06 PM
 */

$files = array(
    './materia/bootstrap.min.css',
    './main.css',
);

require_once('../functions.php');

header('Content-type: text/css');
echo fn\get_resources( $files );