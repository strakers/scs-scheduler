<?php
/**
 * Created by PhpStorm.
 * User: strakers
 * Date: 11/13/2017
 * Time: 4:06 PM
 */

$files = array(
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.min.js',
    'https://cdn.jsdelivr.net/sweetalert2/6.6.0/sweetalert2.min.js',
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-animate.min.js',
    'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js',
);

require_once('../functions.php');

header('Content-type: text/javascript');
fn\set_cache( 7 );
echo fn\get_resources( $files );