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
            $section->instruction_methods = implode(', ', $section->instruction_methods);
            $section->campuses = [];
            $section->d_course_code = $this->d_course_code;
            $section->d_section_name = $this->d_course_name;
            foreach($section->schedules as &$schedule){
                $schedule->period = '';
                if( !$schedule->d_section_schedule_is_tba && !($schedule->d_section_schedule_start_time == '00:00:00' || $schedule->d_section_schedule_end_time == '00:00:00' )){
                    $schedule->period = !$schedule->d_section_schedule_is_tba
                        ? "{$schedule->d_section_schedule_start_time} - {$schedule->d_section_schedule_end_time}"
                        : '';
                }
                $schedule->weekday_keys = static::weekdayKeys( (array) $schedule->d_section_schedule_days );
                if($schedule->d_campus_name) $section->campuses[] = $schedule->d_campus_name;
            }
            unset($section->d_section_notes);
            unset($section->instructors);
            unset($section->d_semester_begin_date);
            unset($section->start_month);
            unset($section->d_section_self_paced_max_days);
        }
        return $sections;
    }

    public function export()
    {
        return [
            'd_course_id' => $this->d_course_id,
            'd_course_code' => $this->d_course_code,
            'd_course_name' => $this->d_course_name,
            'sections' => $this->sections()
        ];
    }

    public static function weekdayKeys( array $weekdays = [] )
    {
        $map = [
            'Monday' => 'M',
            'Tuesday' => 'T',
            'Wednesday' => 'W',
            'Thursday' => 'R',
            'Friday' => 'F',
            'Saturday' => 'S',
            'Sunday' => 'D',
        ];

        $keys = [];

        if( $weekdays ) {
            foreach ($weekdays as $i => $weekday) {
                if (array_key_exists($weekday, $map)) {
                    $keys[$i] = $map[$weekday];
                }
            }
        }

        return $keys;
    }

    protected static function getEntityExpressPackage( $entity )
    {
        return [
            'id' => $entity->d_course_id,
            'code' => $entity->d_course_code,
            'name' => $entity->d_course_name,
        ];
    }
}