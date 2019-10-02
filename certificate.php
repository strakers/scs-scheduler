<?php
/**
 * Created by PhpStorm.
 * User: strakers
 * Date: 11/13/2017
 * Time: 5:35 PM
 */

error_reporting(-1);
ini_set('display_errors', 1);
header('Content-type: application/json');

require_once('functions.php');

$code = '';

// search for particular list of courses by certificate code
if( isset( $_GET['c'] ) && $_GET['c'] ){
    $code = $_GET['c'];
    if( preg_match( "/^CE\d{4}$/", $_GET['c'] ) ) {
        $master_path = 'https://learn.utoronto.ca/wp-content/uploads/scs/json/cert_categories.json';
        $certificate_path = 'https://learn.utoronto.ca/wp-content/uploads/scs/json/*.json';
        if ($master_file = @file_get_contents($master_path)) {

            // can't
            /*if( $code == 'CE0175' ){
                /*fn\report_error('Sorry, due to a bug, we can\'t process courses for the Marketing - Advanced certificate at the moment', 408, 'Timeout');
                return;* /
                $category = '17';
                $set = get_courses_by_category( $category );
                if( $set ) {
                    echo json_encode(array('c' => $set));
                }
                return;
            }
            else*/
            if( $code == 'CE0002' ){
                fn\report_error('Sorry, due to its unique setup, we can\'t process courses for the Creative Writing certificate at the moment', 408, 'Timeout');
                return;
            }
            elseif( $code == 'CE9999' ){
                fn\report_error('Oops! The experimental functionality we\'re currently working on is not yet available. Please try back in the year 2091', 408, 'Timeout');
                return;
            }
            if ($json = json_decode($master_file, true)) {
                if (array_key_exists('cc', $json)) {
                    $list = array_keys($json['cc']);
                    if ($list && count($list)) {
                        if (in_array($code, $list)) {
                            $certificate_file = @file_get_contents(str_replace('*', $code, $certificate_path));
                            if ($certificate_file) {

                                $cert = json_decode($certificate_file);
                                $required = $cert->rqc;
                                $electives = $cert->elc;
                                $course_list = array_merge($required, $electives);

                                $set = array();
                                foreach ($course_list as $course) {
                                    if (property_exists($course, 'c')) {
                                        $set[] = $course->c;
                                    }
                                }
                                echo json_encode(array( 'c' => $set ));
                                return;
                            }
                        } else {
                            fn\report_error("Certificate '{$code}' cannot be found, and may not be available");
                            return;
                        }
                    }
                }
            }
        }
        fn\report_error('Cannot connect to certificate', 408, 'Timeout');
        return;
    }
    fn\report_error("'{$code}' is not a valid certificate code", 400, 'Bad request' );
    return;
}

// gather list of all available certificates
elseif( isset( $_GET['list'] ) ){
    $list_path = 'https://learn.utoronto.ca/wp-content/uploads/scs/json/certificate_list.json';
    if ($list_file = @file_get_contents($list_path)) {
        if ($json = json_decode($list_file, true)) {
            if (array_key_exists('c', $json)) {
                $map = $json['c'];
                $list = array();
                foreach($map as $code=>$data){
                    $list[ $data['name'] ] = array(
                        'code' => $code,
                        'name' => $data['name']
                    );
                }

                ksort($list);

                echo json_encode(array( 'c' => array_values( $list )));
                return;
            }
        }
    }
    fn\report_error('Cannot connect to certificate list', 408, 'Timeout');
    return;
}
fn\report_error("The given input is not a valid certificate code", 400, 'Bad request' );
return;

// function to grab courses by category
function get_courses_by_category( $category_id ){
    $search_path = 'https://learn.utoronto.ca/wp-content/uploads/scs/json/search.json';
    if ($search_file = @file_get_contents($search_path)) {
        if ($json = json_decode($search_file)) {
            if (property_exists( $json, 'c')) {
                $map = $json->c;
                $courses = array();
                foreach($map as $course){
                    if( property_exists( $course, 'mi') && is_array( $course->mi ) && in_array( $category_id, $course->mi ) ){
                        $courses[ $course->n ] = $course->c;
                    }
                }

                ksort($courses);
                return array_values($courses);
            }
        }
    }
    fn\report_error('Cannot connect to search list', 408, 'Timeout');
    return '';
}