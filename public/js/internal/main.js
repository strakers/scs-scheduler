(function() {

    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * Angular App Initializer
     * ---------------------------------------------------------------------------------------------------------------------
     */

    var app = angular.module('scheduler', ['ngAnimate', 'ui' /*,'ui.bootstrap'*/]);


    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * Resource Service
     * ---------------------------------------------------------------------------------------------------------------------
     */

    app.factory('$scs', function($q, $http) {
        return {

            getCourseByCode: function ( code ){
                return $http.get('api/course/' + code);
            },

            getCertificateByCode: function ( code ){
                return $http.get('api/certificate/' + code);
            },

            getCertificates: function (){
                return $http.get('api/certificates');
            },

            getCourses: function (){
                return $http.get('api/courses');
            }

        };
    });


    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * Storage Service
     * ---------------------------------------------------------------------------------------------------------------------
     */

    // factory for storing and retrieving course data
    app.factory("$storage", function($q, $http){
        return {
            _store: {},
            get: function( code ){
                if( code && code.match(/^\d{4}$/) ) {
                    if( this._store[ code ] ){
                        return this._store[ code ];
                    }
                }
                else {
                    // error code
                }
                return null;
            },
            set: function( code, data ){
                if( code && code.match(/^\d{4}$/) ) {
                    this._store[ code ] = data ;
                    return true;
                }
                else {
                    // error code
                }
                return false;
            }
        }
    });


});