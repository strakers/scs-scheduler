<?php
/**
 * Created by PhpStorm.
 * User: strakers
 * Date: 11/13/2017
 * Time: 4:06 PM
 */

$files = array(
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/sweetalert2/6.6.0/sweetalert2.min.css',
);

require_once('../functions.php');

header('Content-type: text/css');
fn\set_cache( 7 );
echo fn\get_resources( $files );