/**
 * Created by strakers on 11/13/2017.
 */

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Master Control
 * ---------------------------------------------------------------------------------------------------------------------
 */

// the main controller for this application
app.controller('MasterController', function($scope, $profile, $storage, $q, $location ){

    // set up variables
    $scope.courses = {};
    $scope.masterList = {};
    $scope.letters = 'DMTWRFS'.split('');
    $scope.isLoading = {};
    $scope.certificateList = [];

    // ajax call to retrieve course data from web
    $scope.retrieveCourse = function( code, suppressErrors ){
        code = code || $scope.course_code;
        var course = $storage.get( code );

        // already displayed. change existing
        if( $scope.masterList[ code ] ) {
            if( !suppressErrors ) {
                swal({
                    title: "Oops",
                    text: "The course has already been added",
                    timer: 4000,
                    type: "warning"
                });
            }
            return;
        }

        if( $scope.isLoading[ code ]  ){
            console.log('impatient user', 'already loaded', code, profile);
            return;
        }

        $scope.isLoading[ code ] = true;

        // request course data
        $profile.get(code)
            .then(

                // success
                function (response) {
                    if (response && response.data && response.data['co']) {
                        var profile = response.data['co'];

                        // store data for later use
                        $storage.set(code, profile);

                        // create course item
                        $scope.courses[code] = $storage.get(code);
                        $scope.masterList[code] = {};

                        console.log('success', profile);
                    }
                    $scope.isLoading[ code ] = false;
                },

                // fail
                function (error) {
                    console.error('error', error);

                    // notify user if error
                    if( !suppressErrors ) {
                        swal({
                            title: "Uh oh!",
                            text: (error.data && error.data['text'] ? error.data['text'] : "Something went wrong!"),
                            timer: 4000,
                            type: "error"
                        });
                    }
                    $scope.isLoading[ code ] = false;
                }
            );

        // clears input for next query
        $scope.course_code = '';
    };

    // request set of course data by certificate relation
    $scope.retrieveCoursesByCertificate = function( code, suppressErrors ){
        code = code || $scope.certificate_code;

        $profile.group( code ).then(
            function( response ){
                if( response && response.data ){
                    if( response.data['c'] ){
                        for( var i=0,c; i < response.data['c'].length; ++i ){
                            c = response.data['c'][i];
                            $scope.retrieveCourse(c,true);
                        }
                    }
                }
                console.log('cert run', 'success', response);
            },
            function( error ){

                // notify user if error
                if( !suppressErrors ) {
                    swal({
                        title: "Uh oh!",
                        text: (error.data && error.data['text'] ? error.data['text'] : "Something went wrong!"),
                        timer: 4000,
                        type: "error"
                    });
                }

                console.log('cert run', 'fail', error);
            }
        );
    };

    $scope.retrieveListofCertificates = function( suppressErrors ){
        $profile.list().then(
            function( response ){
                if( response && response.data ){
                    if( response.data['c'] ){
                        $scope.certificateList = response.data['c'];
                    }
                }
            },
            function( error ){

                // notify user if error
                if( !suppressErrors ) {
                    swal({
                        title: "Uh oh!",
                        text: (error.data && error.data['text'] ? error.data['text'] : "Something went wrong!"),
                        timer: 4000,
                        type: "error"
                    });
                }
            }
        );
    };

    $scope.removeAllCourses = function(){
        $scope.courses = {};
        $scope.masterList = {};
    };

    $scope.getScheduleURL = function(){
        var list = Object.keys($scope.masterList), o = window.location;
        return o.origin + o.pathname + '#!/?q=' + list.join(',');
    };

    // allow for loading schedules from batch lists
    (function($s,$l){
        var s = $l.search(), t = s['q'], q = t ? t.split(',') : [], ce = s['ce'];

        // load from list of courses
        if( q.length ){
            for(var i=0,c;i<q.length;++i){
                c = q[i];
                if( c.match(/^\d{4}$/) ){
                    $s.retrieveCourse(c,true);
                }
            }
        }

        // load from certificate
        else if( ce ){
            $scope.retrieveCoursesByCertificate( ce );
        }
        console.log('location', s, t ,q, ce );
    })($scope,$location);

    $scope.retrieveListofCertificates();
});

//angular.bootstrap(document, ['SchedulerApp']);