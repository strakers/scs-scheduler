<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-02
 * Time: 12:27 AM
 */

include_once dirname(__DIR__) . '/vendor/autoload.php';

$r = \SCS\Entity\Certificate::getJsonFromResource();
##var_dump(strlen($c));
$l = \SCS\Entity\Certificate::getList();
print_r($l);
$c = new \SCS\Entity\Certificate('CE0001');
#var_dump(($c->d_certificate_name));