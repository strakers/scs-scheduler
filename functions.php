<?php

// converted to namespace to prevent function name collisions
namespace fn;

// retrieve an array of files and combine them into a single file for download
function get_resources($files = array(), $separator = "\r\n\r\n;\r\n\r\n")
{
    $data = array();
    foreach ($files as $file) {
        if ($file) {
            if ($file_contents = file_get_contents($file)) {
                $data[] = $file_contents;
            } else {
                $data[] = "\r\n\r\n/* ERROR LOADING [{$file}]. Next */\r\n\r\n";
            }
        }
    }
    return join($separator, $data);
}

// explicitely set the cache time for documents
function set_cache($day_multiplier = 1)
{
    $day = 60 * 60 * 24;
    $cache_time = $day * $day_multiplier;
    $timestamp = gmdate("D, d M Y H:i:s", time() + $cache_time) . " GMT";
    header("Expires: {$timestamp}");
    header("Pragma: cache");
    header("Cache-control: max-age={$cache_time}");
}

// output JSON error message along with HTTP headers
function report_error($message, $code = '404', $text = 'Not found', $data = null)
{
    header("HTTP/1.0 {$code} {$text}");
    $info = array(
        'text' => $message
    );
    if ($data) {
        $info['data'] = $data;
    }
    echo json_encode($info);
}