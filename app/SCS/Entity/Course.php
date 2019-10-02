<?php
/**
 * Created by PhpStorm.
 * User: strakez
 * Date: 2019-10-01
 * Time: 11:27 PM
 */

namespace SCS\Entity;


class Course extends BaseEntity
{
    protected static $_key = 'd_course_code';

    public function sections()
    {
        $sections = (array)$this->sections;
        foreach( $sections as &$section ){
            $section->d_course_section_code = "{$this->d_course_code}-{$section->d_section_code}";
            unset($section->d_section_notes);
            unset($section->instructors);
            unset($section->d_semester_begin_date);
            unset($section->start_month);
        }
        return [
            'd_course_id' => $this->d_course_id,
            'd_course_code' => $this->d_course_code,
            'd_course_name' => $this->d_course_name,
            'sections' => $sections
        ];
    }
}