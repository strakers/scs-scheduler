

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Angular App Initializer
 * ---------------------------------------------------------------------------------------------------------------------
 */

var app = angular.module( 'scheduler', [ 'ngAnimate', 'ui' ]);


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Resource Service
 * ---------------------------------------------------------------------------------------------------------------------
 */

app.factory( '$res', function( $http ) {
    return {

        'getCourseByCode' : function ( code ){
            return $http.get('api/course/' + code);
        },

        'getCertificateByCode' : function ( code ){
            return $http.get('api/certificate/' + code);
        },

        'getCertificates' : function (){
            return $http.get('api/certificates');
        },

        'getCourses' : function (){
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
app.factory( '$cache', function(){
    return {
        '_store' : {},
        '_cache_life' : 1000 * 60 * 30, // 30 minutes
        'get' : function( code ){
            if( code && code.match(/^\d{4,6}$/) ) {
                if( this._store[ code ] && (Date.now() - this._store[ code ].time < this._cache_life) ){
                    return this._store[ code ].data;
                }
            }
            return null;
        },
        'set' : function( code, data ){
            if( code && code.match(/^\d{4,6}$/) ) {
                this._store[ code ] = {
                    'data' : data,
                    'time' : Date.now()
                };
                return true;
            }
            return false;
        }
    }
});