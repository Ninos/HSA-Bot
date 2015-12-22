'use strict';

let api = require( '../lib/api.js' ),
	cache = require( '../lib/cache.js' ),
	parse = require( '../lib/parse.js' ),
	request = require( 'request' ),
	moment = require( 'moment' );

module.exports = {
	name: 'schedule',
	description: 'This module returns the current schedule',
	help: [
		'param 1: semester',
		'param 2: date'
	],
	url: 'https://melpomene.webuntis.com/WebUntis/Timetable.do?school=HS-Augsburg',
	urlParam: {
		config: {
			'ajaxCommand': 'getPageConfig',
			'departmentId': 5,
			'filter.departmentId': 5,
			'formatId': 7,
			'type': 1
		},
		weekly: {
			'ajaxCommand': 'getWeeklyTimetable',
			'filter.departmentId': 5,
			'elementType': 1,
			'filter.buildingId': - 1,
			'filter.klasseId': - 1,
			'filter.restypeId': - 1,
			'filter.roomGroupId': - 1,
			'formatId': 7,
			'date': null,
			'elementId': null
		}
	},
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		let that = this;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		let that = this;

		// Check if param 1 is not empty (should be semester)
		if ( args.param[0] == undefined || args.param[0] == '' ) {
			api.say( args, new Error( 'Not valid semester' ) );

			return;
		}

		// Check if param 2 is not empty (should be a date)
		if ( args.param[1] == undefined || args.param[1] == '' ) {
			api.say( args, new Error( 'Not valid date' ) );

			return;
		}

		// Format the input date
		let date = parse.date( args.param[1], 'YYYYMMDD' );

		// Get the data object from url/cache with all nessessary configurations
		this.getConfig( function ( error, data ) {
			if ( error ) {
				api.say( args, error );

				return;
			}

			let id = null;
			data.every( function ( value ) {
				if ( args.param[0] == value.name ) {
					id = value.id;

					return false;
				}

				return true;
			} );

			// Check if semester was found
			if ( ! id ) {
				api.say( args, new Error( 'Semester not found' ) );

				return;
			}

			// Get the data object from url/cache with all nessessary menu informations
			that.getData( {id: id, date: date}, function ( error, data ) {
				if ( error ) {
					console.error( error );

					return;
				}

				// Check if a menu exists for the inputted date
				if ( ! data.plans[date] ) {
					api.say( args, new Error( 'For that date a plan does not exists' ) );

					return;
				}

				// Generate output content
				let content = [];
				Object.keys( data.plans[date] ).map( function ( key ) {
					let value = data.plans[date][key],
						lesson = data.lessons[value.planId];

					content.push( moment(
							value.startTime,
							'Hmm'
						).format( 'HH:mm' ) + ' - ' + moment(
							value.endTime,
							'Hmm'
						).format( 'HH:mm' ) + ': ' + lesson.longName + ' (' + lesson.displayName + ')' );
				} );

				api.say( args, content.join( "\n" ) );
			} );
		} );
	},
	getConfig: function ( callback ) {
		let that = this;

		// Return cache if exists and not expired
		let cacheName = that.name + '_data_config',
			data = cache.get( cacheName );
		if ( data ) {
			setImmediate( callback, null, data );

			return;
		}

		// Get json and return object
		request.post( {
			url: that.url,
			form: that.urlParam.config,
			json: true
		}, function ( error, response, body ) {
			if ( error ) {
				callback( error );

				return;
			}

			if ( response.statusCode != 200 ) {
				callback( new Error( 'Unexpected response code', 'Connection status ' + response.statusCode + ': Expected response code 200' ) );

				return;
			}

			data = body.elements;

			// Set the cache with an expire date of 3600 seconds
			cache.set( cacheName, data, 3600 );

			callback( null, data );
		} );
	},
	getData: function ( args, callback ) {
		let that = this;

		// Return cache if exists and not expired
		let cacheName = that.name + '_data_' + args.id + '_' + moment(
				args.date,
				'YYYYMMDD'
				).format( 'GGGGWW' ),
			data = cache.get( cacheName );
		if ( data ) {
			setImmediate( callback, null, data );

			return;
		}

		data = {};

		that.urlParam.weekly.elementId = args.id;
		that.urlParam.weekly.date = args.date;

		// Get json and return object
		request.post( {
			url: that.url,
			form: that.urlParam.weekly,
			json: true
		}, function ( error, response, body ) {
			if ( error ) {
				callback( error );

				return;
			}

			if ( response.statusCode != 200 ) {
				callback( new Error( 'Unexpected response code', 'Connection status ' + response.statusCode + ': Expected response code 200' ) );

				return;
			}

			let plans = body.result.data.elementPeriods[args.id],
				lessons = body.result.data.elements;

			data.plans = {};
			plans.forEach( function ( value ) {
				let planId = null;
				value.elements.every( function ( value ) {
					if ( value.type == 3 ) {
						planId = value.id;

						return false;
					}

					return true;
				} );

				data.plans[value.date] = data.plans[value.date] || {};
				data.plans[value.date][value.id] = {
					lessonId: value.lessonId,
					planId: planId,
					startTime: value.startTime,
					endTime: value.endTime,
					cellState: value.cellState
				};
			} );

			data.lessons = {};
			lessons.forEach( function ( value ) {
				data.lessons[value.id] = {
					name: value.name,
					longName: value.longName,
					displayName: value.displayname
				};
			} );

			// Set the cache with an expire date of 3600 seconds
			cache.set( cacheName, data, 3600 );

			callback( null, data );
		} );
	}
};