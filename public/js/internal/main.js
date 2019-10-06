

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
        },

        'getCoursesByText' : function ( text ){
            return $http.get('api/course/search?q=' + text);
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


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Filter Functions
 * ---------------------------------------------------------------------------------------------------------------------
 */

// object/array order reversal filter
app.filter('reverse',function(){
    return function( items ){
        var resolve = items;

        // if is an object instead of an array, coerce to an array in order to reverse
        if( !angular.isArray( resolve ) ){
            resolve = Object.values(resolve);
        }

        // reverse array order
        return resolve.slice().reverse();
    }
});

// date filter
app.filter('moment',function(){
    return function( timeString ){
        return new moment(timeString).format('DD MMM YYYY');
    }
});

// https://jsfiddle.net/OriDrori/1pgbwgtg/4/
// join filter
app.filter('join', function () {
    return function join(array, separator, prop) {
        if (!Array.isArray(array)) {
            return array; // if not array return original - can also throw error
        }

        separator = separator || ', ';

        return (!!prop ? array.map(function (item) {
            return item[prop];
        }) : array).join(separator);
    };
});