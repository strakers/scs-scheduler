<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:12 PM
 */

namespace SCS\Entity;


abstract class BaseEntity
{
    const RESOURCE = 'https://learn.utoronto.ca/sites/default/files/mimr/';
    protected static $_override_resource_base = '';
    protected static $_override_list_key = '';
    protected static $_key = '';

    protected $root;
    protected $json;
    protected $id;
    protected $empty = true;

    /**
     * BaseEntity constructor.
     * @param $id
     */
    public function __construct( $id )
    {
        $this->id = $id;
        static::getByKey( $id );
    }

    /**
     * @param string $id
     * @return array
     */
    public function getByKey( $id = '' )
    {
        if(empty($id)){
            $this->empty = true;
        }

        if( $this->json = static::getJsonFromResource($id) ){
            if( $root = static::extractJson($this->json) ){
                $this->root = $root;
                $this->empty = false;
            }
        }

        return [];
    }

    public function isEmpty()
    {
        return $this->empty;
    }

    public function getJson()
    {
        return $this->json;
    }

    abstract public function export();

    /**
     * @param $name
     * @param string $default
     * @return array|mixed|null
     */
    protected function find($name, $default = '' )
    {
        return getValueByKey($name, (array) $this->root, $default );
    }

    /**
     * @param $name
     * @return mixed
     */
    public function __get($name )
    {
        return $this->find( $name )
            ?: (
                property_exists( $this, $name) ? $this->{$name} : null
            );
    }

    /**
     * @param string $resource_key
     * @return string
     */
    public static function getJsonFromResource($resource_key = '' )
    {
        // define variables
        $resource_base = static::$_override_resource_base ?: basename(convert_directory_separators(strtolower(get_called_class())));
        $resource_key = $resource_key ?: $resource_base . 's';
        $path = self::RESOURCE . $resource_base . '/' . $resource_key . '.json';

        // retrieve json from server path
        if($json = @file_get_contents($path)){
            return $json;
        }

        // if no file found, return empty
        return '';
    }

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
                foreach( $root->data as $entity ){
                    if( static::$_key && property_exists($entity, $master_key)){
                        $id = $entity->{$master_key};
                        $list[ $id ] = static::getEntityExpressPackage($entity);
                    }
                }
            }
        }
        return array_values($list);
    }

    /**
     * @param $entity
     * @return mixed
     */
    protected static function getEntityExpressPackage($entity )
    {
        $master_key = static::$_override_list_key ?: static::$_key;
        return $entity->{$master_key};
    }

    /**
     * @param string $json
     * @return null|mixed
     */
    public static function extractJson( $json = '' )
    {
        if( $root = json_decode($json) ){
            if( is_object($root) || is_array($root) ){
                return $root;
            }
        }
        return null;
    }


}