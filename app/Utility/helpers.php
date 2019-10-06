<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:16 PM
 */

if( !function_exists('getValueByKey')){
    // https://selvinortiz.com/blog/traversing-arrays-using-dot-notation
    function getValueByKey($key, array $data, $default = null)
    {
        // @assert $key is a non-empty string
        // @assert $data is a loopable array
        // @otherwise return $default value
        if (!is_string($key) || empty($key) || !count($data))
        {
            return $default;
        }

        // @assert $key contains a dot notated string
        if (strpos($key, '.') !== false)
        {
            $keys = explode('.', $key);

            foreach ($keys as $innerKey)
            {
                // @assert $data[$innerKey] is available to continue
                // @otherwise return $default value
                if (!array_key_exists($innerKey, $data))
                {
                    return $default;
                }

                $data = $data[$innerKey];
            }

            return $data;
        }

        // @fallback returning value of $key in $data or $default value
        return array_key_exists($key, $data) ? $data[$key] : $default;
    }
}

if( !function_exists( 'app_path')){
    function app_path( $path = '' ){
        $path = preg_replace("/[\/\\\]+/",DIRECTORY_SEPARATOR,$path);
        $path = ($path && strpos($path,DIRECTORY_SEPARATOR) !== 0 ) ? DIRECTORY_SEPARATOR . $path : $path;
        return dirname(dirname(__DIR__)) . $path;
    }
}

if( !function_exists( 'public_path')){
    function public_path( $path = '' ){
        return app_path( '/public/' . $path );
    }
}