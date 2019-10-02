<?php
/**
 * Created by PhpStorm.
 * User: strakers
 * Date: 11/8/2017
 * Time: 6:56 PM
 */

error_reporting(-1);
ini_set('display_errors', 1);
header('Content-type: application/json');

require_once('functions.php');

$code = '';

// search for particular course data by code
if( isset( $_GET['c'] ) && $_GET['c'] ){
    $code = $_GET['c'];
    if( preg_match( "/^\d{4}$/", $_GET['c'] ) ) {
        $master_path = 'https://learn.utoronto.ca/wp-content/uploads/scs/json/codemap.json';
        $couse_path = 'https://learn.utoronto.ca/wp-content/uploads/scs/json/*.json';
        if ($master_file = file_get_contents($master_path)) {
            if ($json = json_decode($master_file, true)) {
                if (array_key_exists('co', $json)) {
                    $list = array_values($json['co']);
                    if ($list && count($list)) {
                        if (in_array($code, $list)) {
                            $course_file = file_get_contents(str_replace('*', $code, $couse_path));
                            if ($course_file) {
                                echo $course_file;
                                return;
                            }
                        } else {
                            fn\report_error("Course '{$code}' cannot be found, and may not be available");
                            return;
                        }
                    }
                }
            }
        }
        fn\report_error('Cannot connect to course', 408, 'Timeout');
        return;
    }
    fn\report_error("'{$code}' is not a valid course code", 400, 'Bad request' );
    return;
}
fn\report_error("The given input is not a valid course code", 400, 'Bad request' );
return;