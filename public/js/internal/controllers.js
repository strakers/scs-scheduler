

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Master Control
 * ---------------------------------------------------------------------------------------------------------------------
 */

// the main controller for this application
app.controller('MasterController', function ($scope, $res, $cache, $q, $location) {

    $scope.isLoading = {};
    $scope.current_course_code = '';
    $scope.courses = {};
    $scope.masterList = {};
    $scope.certificateList = [];
    $scope.letters = 'DMTWRFS'.split('');

    $scope.retrieveCourse = function (code, suppressErrors) {

        let stored_data;
        code = code || $scope.current_course_code;

        // -------------------------------------------------------------------------------------------------------------
        // stop process and warn user when no code is entered
        if( !code ){

            swal({
                title: "Oops!",
                text: "Please enter a course code",
                timer: 4000,
                type: "warning"
            });

            return;
        }

        // -------------------------------------------------------------------------------------------------------------
        // if data is cached, load from cache
        if(stored_data = $cache.get(code)){

            // create course item
            $scope.courses[code] = stored_data;
            $scope.masterList[code] = {};
            console.log('retrieved', stored_data);

            return;
        }

        // -------------------------------------------------------------------------------------------------------------
        // if loading, halt consecutive requests
        if ($scope.isLoading[code]) {
            swal({
                title: "Sorry",
                text: "Please wait for the data to load",
                timer: 4000,
                type: "warning"
            });
            console.log('impatient user', 'already loaded', code, profile);
            return;
        }

        // -------------------------------------------------------------------------------------------------------------
        // already displayed. change existing
        if ($scope.masterList[code]) {
            if (!suppressErrors) {
                swal({
                    title: "Oops",
                    text: "The course has already been added",
                    timer: 4000,
                    type: "warning"
                });
            }
            return;
        }

        // -------------------------------------------------------------------------------------------------------------
        // load data from resource

        // set loading state
        $scope.isLoading[code] = true;

        // request data
        $res.getCourseByCode(code)
            .then(
                // success
                function (response) {

                    if( response && response.data && response.data['d_course_code'] ){

                        // store data for later use
                        $cache.set( code, response.data );

                        // create course item
                        $scope.courses[code] = response.data;
                        $scope.masterList[code] = {};
                        console.log('success', response);
                    }

                    $scope.isLoading[code] = false;
                },

                //failure
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

                    $scope.isLoading[code] = false;
                }
            );

        // clear request field
        $scope.current_course_code = '';
    };

    $scope.retrieveCoursesByCertificate = function(code, suppressErrors) {

        let stored_data;
        code = code || $scope.current_certificate_code;

        // -------------------------------------------------------------------------------------------------------------
        // stop process and warn user when no code is entered
        if( !code ){

            swal({
                title: "Oops!",
                text: "Please select a certificate",
                timer: 4000,
                type: "warning"
            });

            return;
        }

        // -------------------------------------------------------------------------------------------------------------
        // if data is cached, load from cache
        if(stored_data = $cache.get(code)){

            // create course items from certificate


            console.log('retrieved', stored_data);

            return;
        }

        // -------------------------------------------------------------------------------------------------------------
        // load data from resource

        // request data
        $res.getCertificateByCode(code)
            .then(
                // success
                function( response ){

                    if( response && response.data && response.data['d_certificate_code'] ){

                        if( response.data['courses'] ) {

                            // store data for later use
                            $cache.set(code, response.data);

                            for(let i = 0; i < response.data.courses.length; ++i){
                                let course_code = response.data.courses[i].d_course_code;

                                // store data for later use
                                $cache.set( course_code, response.data.courses[i] );

                                // create course item
                                $scope.courses[course_code] = response.data.courses[i];
                                $scope.masterList[course_code] = {};
                            }
                        }
                        else {
                            // no courses listed for cert
                        }

                        console.log('success certs', response);
                    }
                },

                //failure
                function (error) {
                    console.error('error', error);

                    // notify user if error
                    if( !suppressErrors ) {
                        swal({
                            title: "Uh oh!",
                            text: (error.data && error.data['text'] ? error.data['text'] : "Could not load certificates"),
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

    // =================================================================================================================

    $res.getCertificates()
        .then(
            // success
            function( response ){

                if( response && response.data ){

                    $scope.certificateList = response.data;
                    console.log('success certs', response);
                }
            },

            //failure
            function (error) {
                console.error('error', error);

                // notify user if error
                if( !suppressErrors ) {
                    swal({
                        title: "Uh oh!",
                        text: (error.data && error.data['text'] ? error.data['text'] : "Could not load certificates"),
                        timer: 4000,
                        type: "error"
                    });
                }
            }
        );
});