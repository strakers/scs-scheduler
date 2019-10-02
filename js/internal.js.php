<?php

$files = array(
    './app.js',
    './components.js',
    './controllers.js',
);

require_once('../functions.php');

header('Content-type: text/javascript');
echo fn\get_resources( $files );

