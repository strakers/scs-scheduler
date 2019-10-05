
/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Card Components
 * ---------------------------------------------------------------------------------------------------------------------
 */

app.component('scheduleCard', {
    templateUrl: 'tmpl/schedule-card.html',
    controller: function(){},
    bindings: {
        block: '=',
        campus: '=',
        delivery: '='
    }
});

app.component('courseCard', {
    templateUrl: 'tmpl/course-card.html',
    controller: function( $scope ){

        // set up initial variables
        var ctrl = this, profile = $scope.$ctrl.profile;
        ctrl.course = '';
        ctrl.section = '';
        ctrl.course_section_id = '';
        ctrl.schedules = [];

        ctrl.selectSection = function(){
            let course_code = ctrl.section.d_course_code;
            $scope.$parent.masterList[ course_code ] = {
                code: ctrl.section.d_course_section_code,
                title: ctrl.section.d_course_section_name,
                section: ctrl.section.course_section,
                delivery: ctrl.section.instruction_methods,
                campus: ctrl.section.campuses.join(', '),
                days: {
                    'D': { occupied: false, slots: {} },
                    'M': { occupied: false, slots: {} },
                    'T': { occupied: false, slots: {} },
                    'W': { occupied: false, slots: {} },
                    'R': { occupied: false, slots: {} },
                    'F': { occupied: false, slots: {} },
                    'S': { occupied: false, slots: {} }
                }
            };

            for( let i = 0, schedule; i < ctrl.section.schedules.length; ++i ){
                schedule = ctrl.section.schedules[i];

                for( let w in $scope.$parent.masterList[ course_code ].days ){
                    if( schedule.weekday_keys.includes(w) && !schedule.d_section_schedule_is_tba ){

                        // if day slot hasn't yet been created, create new array
                        if(!$scope.$parent.masterList[course_code].days[w].slots[schedule.period]){
                            $scope.$parent.masterList[course_code].days[w].slots[schedule.period] = { schedules: [], startDate: null, endDate: null };
                        }
                        $scope.$parent.masterList[course_code].days[w].occupied = true;
                        $scope.$parent.masterList[course_code].days[w].slots[schedule.period].schedules.push(schedule);

                        // set slot start date
                        if( !$scope.$parent.masterList[course_code].days[w].slots[schedule.period].startDate ){
                            $scope.$parent.masterList[course_code].days[w].slots[schedule.period].startDate = schedule.d_section_schedule_start_date;
                        }

                        // set slot end date
                        if( !$scope.$parent.masterList[course_code].days[w].slots[schedule.period].endDate || (schedule.d_section_schedule_end_date > $scope.$parent.masterList[course_code].days[w].slots[schedule.period].endDate) ){
                            $scope.$parent.masterList[course_code].days[w].slots[schedule.period].endDate = schedule.d_section_schedule_end_date;
                        }

                    }
                }
            }
        };

        ctrl.removeCourse = function(){
            delete $scope.$parent.courses[ ctrl.course ];
            delete $scope.$parent.masterList[ ctrl.course ];
            console.log('remove', ctrl.course );
        };

    },
    bindings: {
        profile: '='
    }
});