/**
 * Created by strakers on 11/13/2017.
 */

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Angular App Initializer
 * ---------------------------------------------------------------------------------------------------------------------
 */

var app = angular.module('SchedulerApp', ['ngAnimate', 'ui' /*,'ui.bootstrap'*/ ]);


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Helper Classes
 * ---------------------------------------------------------------------------------------------------------------------
 */

// class wrapper for courses
function CourseObj( data ){
    if( !data ) throw new TypeError("Null data cannot be passed.");
    if( data.constructor !== Object.prototype.constructor ) throw new TypeError("Data must be an Object.");

    this._code = data['c'] ? data['c'].toString() : undefined;

    // retrieve course data object or its properties (when specified)
    this.get = function( prop ){
        if( prop ){

            // define aliases
            switch( prop ){
                case 'id' :
                case 'index' : prop = 'i'; break;
                case 'code' : prop = 'c'; break;
                case 'title' :
                case 'name' : prop = 'n'; break;
                case 'sections' : prop = 'se'; break;
                case 'availability' : prop = 'av'; break;
                case 'keywords' : prop = 'k'; break;
            }

            if( prop in data ){
                // return course data property value
                return data[prop];
            }

            return false;
        }

        // return course data object
        return data;
    };

    // retrieve course code
    this.code = function(){
        return this._code;
    };

    // retrieve section data object
    this.section = function( code ){

        // coerce code to string
        code = code.toString();

        // if code is valid section code
        if( code.match(/^\d{3}$/) && data.se && data.se.length ){

            // loop to find code
            for(var i=0; i<data.se.length;++i){
                if( code === data.se[i].c.toString() ){
                    return new SectionObj( data.se[i], this._code );
                }
            }
        }

        return false;
    };

    // retrieve list of section data objects
    this.sections = function(){
        var sections = [];
        if( data.se && data.se.length ){
            for(var i=0,s; i<data.se.length;++i){
                s = new SectionObj( data.se[i], this._code );
                sections.push(s);
            }
        }
        return sections;
    };

    // retrieve array of section codes for a course
    this.sectionList = function( includeTBAOnlySections ){

        var sections = data['se'];

        // exclude sections which only contain TBA schedules
        // if(!includeTBAOnlySections)
        sections = _.filter(sections,function(s){ return _.filter(s.s, function(sch){ return sch.dt !== 'Date and Time TBA'; }).length ; });

        // if sections exist, return list of section codes
        if( sections ) {
            return _.map(sections, function (a) {
                return a.c.toString();
            });
        }

        // available sections do not exist
        return [];
    };

    // add schedule method to data
    this.schedules = function( code ){

        // coerce code to string
        code = code.toString();

        // if code is valid section code
        if( code.match(/^\d{3}$/) && data.se && data.se.length ){

            // loop to find code
            for(var i=0; i<data.se.length;++i){
                if( code === data.se[i].c.toString() ){
                    return this._convertSchedules(data.se[i].s, data.se[i].dm);
                }
            }
        }

        return false;
    };

    this._parseWeekdays = function( days ){
        var map = '';
        for(var i=0;i<days.length;++i){
            switch( days[i]){
                case 'Saturday': map+= 'S'; break;
                case 'Sunday': map+= 'D'; break;
                case 'Monday': map+= 'M'; break;
                case 'Tuesday': map+= 'T'; break;
                case 'Wednesday': map+= 'W'; break;
                case 'Thursday': map+= 'R'; break;
                case 'Friday': map+= 'F'; break;
            }
        }
        return map;
    };
    this._convertSchedules = function( data, delivery ){

        if( !data ) throw new TypeError("Null data cannot be passed.");
        if( data.constructor !== Array.prototype.constructor ) throw new TypeError("Data must be an Array.");

        var schedules = [], schedule;

        for(var i=0,sch,matches;i<data.length;++i){
            schedule = {};
            sch = data[i];

            console.log('out sch',sch);

            // get class start and end dates
            matches = sch.dt.match(/^(\d{2} \w{3} \d{4}) ?-? ?(\d{2} \w{3} \d{4})?/);
            if( matches ) matches.shift();
            schedule.startDate = matches && matches[0] ? moment(matches[0], 'DD MMM YYYY') : null;
            schedule.endDate = matches && matches[1] ? moment(matches[1], 'DD MMM YYYY') : schedule.startDate;

            // check if is TBA
            schedule.isTBA = ( sch.dt === 'Date and Time TBA' );

            // get class time period duration
            schedule.period = sch.t;

            // get class days of week
            schedule.weekdays = this._parseWeekdays( sch.dw );

            if( delivery ) schedule.delivery = delivery;

            schedules.push( schedule );
        }

        return schedules;
    };
}

// class wrapper for sections
function SectionObj( data, courseCode ){
    courseCode = courseCode ? courseCode.toString() : '';
    if( !data ) throw new TypeError("Null data cannot be passed.");
    if( data.constructor !== Object.prototype.constructor ) throw new TypeError("Data must be an Object.");
    if( !courseCode || !courseCode.match(/^\d{4}$/) ) throw new TypeError("Requires valid course code.");

    this._code = data['c'] ? data['c'].toString() : undefined;
    this._fullCode = this._code ? courseCode + '-' + this._code : undefined;

    this.get = function( prop ){
        if( prop ){

            // define aliases
            switch( prop ){
                case 'id' :
                case 'index' : prop = 'i'; break;
                case 'code' : prop = 'c'; break;
                case 'title' :
                case 'action' : prop = 'ac'; break;
                case 'schedules' : prop = 's'; break;
                case 'availability' : prop = 'av'; break;
                case 'delivery' : prop = 'dm'; break;
                case 'isPublic' : prop = 'pe'; break;
                case 'campus' : prop = 'ca'; break;
                case 'cost' :
                case 'fee' : prop = 'f'; break;
            }

            // return course data property value
            if( prop in data ){
                return data[prop];
            }

            return false;
        }

        // return course data object
        return data;
    };

    this.course = function(){
        return $sch.course( courseCode );
    };

    this.code = function(){
        return this._fullCode;
    };

    this.title = function(){
        return this.course().get('title');
    };

    this.campus = function(){
        var campus = this.get('campus');
        return campus ? campus.n : '';
    };

    // add schedule method to data
    this.schedules = function(){

        // coerce code to string
        code = this._code;

        // if code is valid section code
        if( code.match(/^\d{3}$/) && data.s && data.s.length ){

            return this._convertSchedules(data.s);
        }

        return false;
    };
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * Factory Objects
 * ---------------------------------------------------------------------------------------------------------------------
 */
// factory for retrieving course data from server
app.factory("$profile", function($q, $http){
    return {
        get: function( code ){
            if( code && code.match(/^\d{4}$/) ) {
                return $http.get('course.php?c=' + code);
            }
            else {
                var error;
                error = {
                    statusText: 'Uh oh!',
                    status: 400,
                    data: {
                        text: 'That code is invalid. Please enter a 4-digit number'
                    }
                };
                if( !code ){
                    error.data.text = 'Please first enter a course code';
                }
                return $q.reject(error);
            }
        },
        group: function( code ){
            if( code && code.match(/^CE\d{4}$/) ) {
                return $http.get('certificate.php?c=' + code);
            }
            else {
                var error;
                error = {
                    statusText: 'Uh oh!',
                    status: 400,
                    data: {
                        text: 'That code is invalid. Please enter a valid certificate code'
                    }
                };
                if( !code ){
                    error.data.text = 'Please first enter a certificate code';
                }
                return $q.reject(error);
            }
        },
        list : function(){
            return $http.get('certificate.php?list');
        }
    }
});

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
                this._store[ code ] = new CourseObj( data ) ;
                return true;
            }
            else {
                // error code
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
    return function( moment ){
        return moment.format('DD MMM YYYY');
    }
});