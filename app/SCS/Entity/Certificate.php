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

    protected static function getEntityExpressPackage( $entity )
    {
        return [
            'id' => $entity->d_certificate_id,
            'code' => $entity->d_certificate_code,
            'name' => $entity->d_certificate_name,
        ];
    }

    public function courses()
    {
        $courses = [];

        foreach ((array)$this->required_courses as $group) {
            if (property_exists($group, 'courses')) {
                foreach ($group->courses as $course) {
                    if ($course && !array_key_exists($course->d_course_code, $courses)) {
                        if ($entity = new Course($course->d_course_code)) {
                            if( $sections = $entity->export() ){
                                $courses[$course->d_course_code] = $sections;
                            }
                        }
                    }
                }
            }
        }

        foreach ((array)$this->elective_courses as $group) {
            if (property_exists($group, 'courses')) {
                foreach ($group->courses as $course) {
                    if ($course && !array_key_exists($course->d_course_code, $courses)) {
                        if ($entity = new Course($course->d_course_code)) {
                            if( $sections = $entity->export() ){
                                $courses[$course->d_course_code] = $sections;
                            }
                        }
                    }
                }
            }
        }

        return array_values($courses);
    }

    public function export()
    {
        return [
            'd_certificate_id' => $this->d_certificate_id,
            'd_certificate_code' => $this->d_certificate_code,
            'd_certificate_name' => $this->d_certificate_name,
            'courses' => $this->courses()
        ];
    }
}