/**
 * Created by strakers on 11/13/2017.
 */


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
        ctrl.course_section = '';
        ctrl.schedules = [];

        // add schedule when selecting section
        ctrl.selectSection = function(){
            ctrl.title = ctrl.profile.get('title');
            ctrl.section = ctrl.profile.section( ctrl.course_section );
            ctrl.schedules = ctrl.profile.schedules( ctrl.course_section );

            // create new object to store section data
            $scope.$parent.masterList[ ctrl.course ] = {
                code: ctrl.course,
                title: ctrl.title,
                section: ctrl.course_section,
                delivery: ctrl.section.get('delivery'),
                campus: ctrl.section.campus(),
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

            if( ctrl.schedules.length ) {
                for( var i = 0, schedule, days ; i < ctrl.schedules.length; ++i ) {
                    schedule = ctrl.schedules[i];

                    for( var w in $scope.$parent.masterList[ ctrl.course ].days ){
                        if( schedule.weekdays.includes(w) && !schedule.isTBA ){

                            //if day slot hasn't yet been created, create new array
                            if(!$scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period]){
                                $scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period] = { schedules: [], startDate: null, endDate: null };
                            }
                            $scope.$parent.masterList[ctrl.course].days[w].occupied = true;
                            $scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period].schedules.push(schedule);

                            // set slot start date
                            if( !$scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period].startDate ){
                                $scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period].startDate = schedule.startDate;
                            }

                            // set slot end date
                            if( !schedule.endDate || (schedule.endDate > $scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period].endDate) ){
                                $scope.$parent.masterList[ctrl.course].days[w].slots[schedule.period].endDate = schedule.endDate;
                            }
                        }
                    }
                }
            }

            console.log('change', ctrl.course_section, ctrl.schedules );
        };

        ctrl.removeCourse = function(){
            delete $scope.$parent.courses[ ctrl.course ];
            delete $scope.$parent.masterList[ ctrl.course ];
            console.log('remove', ctrl.course );
        };

        /*ctrl.section_code = '1234-007';
         ctrl.course_title = 'Temp Course';
         ctrl.course_duration = 'Monday - Thursday';
         ctrl.delivery_method = 'Some Format';
         ctrl.weekdays = 'MTWR';*/

        console.log( 'card', $scope, ctrl, $scope.$ctrl, $scope.$ctrl.course_duration, $scope.$ctrl.profile );

        console.log( 'later', ctrl.course, ctrl.course_section );
    },
    bindings: {
        profile: '='
    }
});