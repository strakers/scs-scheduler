<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:30 PM
 */

include_once dirname(__DIR__) . '/vendor/autoload.php';

$r = \SCS\Entity\Course::getJsonFromResource();
##var_dump(strlen($c));
$l = \SCS\Entity\Course::getList();
#print_r($l);
$c = new \SCS\Entity\Course('1860');
var_dump(($c->d_course_id));