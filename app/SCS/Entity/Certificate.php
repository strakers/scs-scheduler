<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-02
 * Time: 12:26 AM
 */

namespace SCS\Entity;


class Certificate extends BaseEntity
{
    protected static $_key = 'd_certificate_code';

    /**
     * @param string $resource_key
     * @return array
     */
    public static function getList($resource_key = '' )
    {
        $list = [];
        $master_key = static::$_override_list_key ?: static::$_key;

        if( $json = static::getJsonFromResource($resource_key) ){
            if( $root = static::extractJson($json) ){
                foreach( $root->data as $certificate ){
                    if( static::$_key && property_exists($certificate, $master_key)){
                        $id = $certificate->{$master_key};
                        $list[ $id ] = [
                            'id' => $id,
                            'code' => $certificate->d_certificate_code,
                            'name' => $certificate->d_certificate_name,
                        ];
                    }
                }
            }
        }
        return array_values($list);
    }
}